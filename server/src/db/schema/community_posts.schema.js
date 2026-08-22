import {
    pgTable,
    uuid,
    text,
    timestamp,
    pgEnum,
    index,
    uniqueIndex,
    check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema.js';
import { trips } from './trips.schema.js';
import { activities } from './activities.schema.js';

// --------------------------------------------------
// COMMUNITY POST TYPE
// --------------------------------------------------

export const communityPostTypeEnum = pgEnum('community_post_type_enum', ['trip', 'activity']);

// --------------------------------------------------
// COMMUNITY POSTS
// --------------------------------------------------

export const communityPosts = pgTable(
    'community_posts',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        authorId: uuid('author_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        postType: communityPostTypeEnum('post_type').notNull(),

        tripId: uuid('trip_id').references(() => trips.id, {
            onDelete: 'cascade',
        }),

        activityId: uuid('activity_id').references(() => activities.id, {
            onDelete: 'restrict',
        }),

        title: text('title').notNull(),

        content: text('content').notNull(),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp('updated_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },

    (table) => ({
        authorIdx: index('community_posts_author_idx').on(table.authorId),

        typeIdx: index('community_posts_type_idx').on(table.postType),

        tripIdx: index('community_posts_trip_idx').on(table.tripId),

        activityIdx: index('community_posts_activity_idx').on(table.activityId),

        createdAtIdx: index('community_posts_created_at_idx').on(table.createdAt),

        typeCreatedAtIdx: index('community_posts_type_created_at_idx').on(
            table.postType,
            table.createdAt,
        ),

        targetCheck: check(
            'community_posts_target_check',
            sql`
            (
                post_type = 'trip'
                AND trip_id IS NOT NULL
                AND activity_id IS NULL
            )
            OR
            (
                post_type = 'activity'
                AND activity_id IS NOT NULL
                AND trip_id IS NULL
            )
            `,
        ),
    }),
);

// --------------------------------------------------
// COMMUNITY LIKES
// --------------------------------------------------

export const communityLikes = pgTable(
    'community_likes',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        postId: uuid('post_id')
            .notNull()
            .references(() => communityPosts.id, {
                onDelete: 'cascade',
            }),

        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        postIdx: index('community_likes_post_idx').on(table.postId),
        userIdx: index('community_likes_user_idx').on(table.userId),
        postUserUnique: uniqueIndex('community_likes_post_user_unique').on(
            table.postId,
            table.userId,
        ),
    }),
);

// --------------------------------------------------
// COMMUNITY COMMENTS
// --------------------------------------------------

export const communityComments = pgTable(
    'community_comments',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        postId: uuid('post_id')
            .notNull()
            .references(() => communityPosts.id, {
                onDelete: 'cascade',
            }),

        authorId: uuid('author_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        content: text('content').notNull(),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp('updated_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        postIdx: index('community_comments_post_idx').on(table.postId),
        authorIdx: index('community_comments_author_idx').on(table.authorId),
    }),
);
