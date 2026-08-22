import { db } from '../../../config/database.config.js';
import {
    communityPosts,
    communityLikes,
    communityComments,
} from '../../../db/schema/community_posts.schema.js';
import { users } from '../../../db/schema/users.schema.js';
import { trips } from '../../../db/schema/trips.schema.js';
import { activities } from '../../../db/schema/activities.schema.js';
import { tripStops } from '../../../db/schema/trip_stops.schema.js';
import { eq, and, or, ilike, desc, asc, sql } from 'drizzle-orm';

/**
 * Fetch a single community post by its ID with full author and target metadata
 */
export async function getPostById(postId) {
    const [post] = await db
        .select({
            id: communityPosts.id,
            postType: communityPosts.postType,
            title: communityPosts.title,
            content: communityPosts.content,
            createdAt: communityPosts.createdAt,
            updatedAt: communityPosts.updatedAt,
            author: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                profileImage: users.profileImage,
            },
            trip: {
                id: trips.id,
                name: trips.name,
            },
            activity: {
                id: activities.id,
                name: activities.name,
            },
        })
        .from(communityPosts)
        .innerJoin(users, eq(communityPosts.authorId, users.id))
        .leftJoin(trips, eq(communityPosts.tripId, trips.id))
        .leftJoin(activities, eq(communityPosts.activityId, activities.id))
        .where(eq(communityPosts.id, postId));

    return post || null;
}

/**
 * Create a new community post
 */
export async function createPost(authorId, data) {
    const { postType, title, content, tripId, activityId } = data;

    if (postType === 'trip') {
        const [trip] = await db.select().from(trips).where(eq(trips.id, tripId));
        if (!trip) {
            throw new Error('Trip not found');
        }
        if (trip.ownerId !== authorId) {
            throw new Error('Unauthorized: You do not own this trip');
        }
    } else if (postType === 'activity') {
        const [activity] = await db.select().from(activities).where(eq(activities.id, activityId));
        if (!activity) {
            throw new Error('Activity not found');
        }
    }

    const [newPost] = await db
        .insert(communityPosts)
        .values({
            authorId,
            postType,
            title,
            content,
            tripId: tripId || null,
            activityId: activityId || null,
        })
        .returning();

    return getPostById(newPost.id);
}

/**
 * Update an existing post's title and/or content
 */
export async function updatePost(postId, userId, updates) {
    const [existingPost] = await db
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.id, postId));

    if (!existingPost) {
        throw new Error('Post not found');
    }
    if (existingPost.authorId !== userId) {
        throw new Error('Unauthorized to edit this post');
    }

    const { title, content } = updates;
    const valuesToSet = {};
    if (title !== undefined) valuesToSet.title = title;
    if (content !== undefined) valuesToSet.content = content;

    await db
        .update(communityPosts)
        .set({
            ...valuesToSet,
            updatedAt: new Date(),
        })
        .where(eq(communityPosts.id, postId));

    return getPostById(postId);
}

/**
 * Delete a community post
 */
export async function deletePost(postId, userId) {
    const [existingPost] = await db
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.id, postId));

    if (!existingPost) {
        throw new Error('Post not found');
    }
    if (existingPost.authorId !== userId) {
        throw new Error('Unauthorized to delete this post');
    }

    await db.delete(communityPosts).where(eq(communityPosts.id, postId));
    return true;
}

/**
 * Toggle like on a community post
 */
export async function toggleLikePost(postId, userId) {
    const [existingLike] = await db
        .select()
        .from(communityLikes)
        .where(and(eq(communityLikes.postId, postId), eq(communityLikes.userId, userId)));

    let isLiked;
    if (existingLike) {
        await db.delete(communityLikes).where(eq(communityLikes.id, existingLike.id));
        isLiked = false;
    } else {
        await db.insert(communityLikes).values({ postId, userId });
        isLiked = true;
    }

    const [countRes] = await db
        .select({ count: sql`count(*)` })
        .from(communityLikes)
        .where(eq(communityLikes.postId, postId));

    const likesCount = parseInt(countRes?.count || '0', 10);
    return { isLiked, likesCount };
}

/**
 * Add a comment to a community post
 */
export async function addComment(postId, authorId, content) {
    const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, postId));
    if (!post) {
        throw new Error('Post not found');
    }

    const [newComment] = await db
        .insert(communityComments)
        .values({
            postId,
            authorId,
            content,
        })
        .returning();

    const [commentWithAuthor] = await db
        .select({
            id: communityComments.id,
            postId: communityComments.postId,
            content: communityComments.content,
            createdAt: communityComments.createdAt,
            author: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                profileImage: users.profileImage,
            },
        })
        .from(communityComments)
        .innerJoin(users, eq(communityComments.authorId, users.id))
        .where(eq(communityComments.id, newComment.id));

    return commentWithAuthor;
}

/**
 * Fetch comments for a community post
 */
export async function getComments(postId) {
    return db
        .select({
            id: communityComments.id,
            postId: communityComments.postId,
            content: communityComments.content,
            createdAt: communityComments.createdAt,
            author: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                profileImage: users.profileImage,
            },
        })
        .from(communityComments)
        .innerJoin(users, eq(communityComments.authorId, users.id))
        .where(eq(communityComments.postId, postId))
        .orderBy(asc(communityComments.createdAt));
}

/**
 * Retrieve community feed with optional filters, search, sorting, and pagination
 */
export async function getPosts(filters = {}) {
    const { search, type, cityId, activityId, sortBy = 'recent', page = 1, limit = 20 } = filters;

    const conditions = [];

    if (type) {
        conditions.push(eq(communityPosts.postType, type));
    }

    if (activityId) {
        conditions.push(eq(communityPosts.activityId, activityId));
    }

    if (search) {
        const searchPattern = `%${search}%`;
        conditions.push(
            or(
                ilike(communityPosts.title, searchPattern),
                ilike(communityPosts.content, searchPattern),
            ),
        );
    }

    if (cityId) {
        conditions.push(
            or(
                eq(activities.cityId, cityId),
                sql`exists(
                    select 1 from ${tripStops} 
                    where ${tripStops.tripId} = ${communityPosts.tripId} 
                    and ${tripStops.cityId} = ${cityId}
                )`,
            ),
        );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const baseQuery = db
        .select({
            id: communityPosts.id,
            postType: communityPosts.postType,
            title: communityPosts.title,
            content: communityPosts.content,
            createdAt: communityPosts.createdAt,
            updatedAt: communityPosts.updatedAt,
            author: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                profileImage: users.profileImage,
            },
            trip: {
                id: trips.id,
                name: trips.name,
            },
            activity: {
                id: activities.id,
                name: activities.name,
            },
            likesCount: sql`(select count(*) from ${communityLikes} where ${communityLikes.postId} = ${communityPosts.id})::int`,
            commentsCount: sql`(select count(*) from ${communityComments} where ${communityComments.postId} = ${communityPosts.id})::int`,
        })
        .from(communityPosts)
        .innerJoin(users, eq(communityPosts.authorId, users.id))
        .leftJoin(trips, eq(communityPosts.tripId, trips.id))
        .leftJoin(activities, eq(communityPosts.activityId, activities.id))
        .where(whereClause);

    const sortOrder =
        sortBy === 'oldest' ? asc(communityPosts.createdAt) : desc(communityPosts.createdAt);

    const offset = (page - 1) * limit;

    const items = await baseQuery.orderBy(sortOrder).limit(limit).offset(offset);

    const countRes = await db
        .select({ count: sql`count(*)` })
        .from(communityPosts)
        .leftJoin(activities, eq(communityPosts.activityId, activities.id))
        .where(whereClause);

    const total = parseInt(countRes[0]?.count || 0, 10);
    const totalPages = Math.ceil(total / limit);

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
}
