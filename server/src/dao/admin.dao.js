import { db } from '../config/database.config.js';
import { users, trips, savedDestinations } from '../db/schema/schema.js';
import { eq, and, or, ilike, count, desc, asc } from 'drizzle-orm';

/**
 * Get paginated list of users with search and filters (Admin)
 */
export async function getAdminUsersList({
    page = 1,
    limit = 20,
    search = '',
    role = null,
    isActive = null,
    isDeleted = null,
    sortBy = 'createdAt',
    sortOrder = 'desc',
} = {}) {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (parsedPage - 1) * parsedLimit;
    const conditions = [];

    if (search && search.trim() !== '') {
        const query = `%${search.trim()}%`;
        conditions.push(
            or(
                ilike(users.firstName, query),
                ilike(users.lastName, query),
                ilike(users.email, query),
            ),
        );
    }

    if (role && (role === 'user' || role === 'admin')) {
        conditions.push(eq(users.role, role));
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
        conditions.push(eq(users.isActive, isActive === 'true' || isActive === true));
    }

    if (isDeleted !== null && isDeleted !== undefined && isDeleted !== '') {
        conditions.push(eq(users.isDeleted, isDeleted === 'true' || isDeleted === true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Total count
    const [{ total }] = await db
        .select({ total: count() })
        .from(users)
        .where(whereClause);

    // Order
    let orderColumn = users.createdAt;
    if (sortBy === 'email') orderColumn = users.email;
    if (sortBy === 'firstName') orderColumn = users.firstName;
    if (sortBy === 'lastName') orderColumn = users.lastName;
    if (sortBy === 'role') orderColumn = users.role;
    if (sortBy === 'updatedAt') orderColumn = users.updatedAt;

    const orderExpr = String(sortOrder).toLowerCase() === 'asc' ? asc(orderColumn) : desc(orderColumn);

    const userList = await db
        .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            profileImage: users.profileImage,
            role: users.role,
            emailVerified: users.emailVerified,
            isActive: users.isActive,
            isDeleted: users.isDeleted,
            deletedAt: users.deletedAt,
            recoveryExpiresAt: users.recoveryExpiresAt,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        })
        .from(users)
        .where(whereClause)
        .orderBy(orderExpr)
        .limit(parsedLimit)
        .offset(offset);

    return {
        users: userList,
        pagination: {
            total: Number(total),
            page: parsedPage,
            limit: parsedLimit,
            totalPages: Math.ceil(Number(total) / parsedLimit),
        },
    };
}

/**
 * Get detailed user profile with travel engagement stats (Admin)
 */
export async function getAdminUserDetails(userId) {
    const [user] = await db
        .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            profileImage: users.profileImage,
            role: users.role,
            emailVerified: users.emailVerified,
            isActive: users.isActive,
            isDeleted: users.isDeleted,
            deletedAt: users.deletedAt,
            recoveryExpiresAt: users.recoveryExpiresAt,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, userId));

    if (!user) return null;

    // Aggregate user travel stats
    const [{ totalTrips }] = await db
        .select({ totalTrips: count() })
        .from(trips)
        .where(eq(trips.ownerId, userId));

    const [{ totalSavedDestinations }] = await db
        .select({ totalSavedDestinations: count() })
        .from(savedDestinations)
        .where(eq(savedDestinations.userId, userId));

    return {
        ...user,
        stats: {
            totalTrips: Number(totalTrips),
            totalSavedDestinations: Number(totalSavedDestinations),
        },
    };
}

/**
 * Update user status and flags (Admin)
 */
export async function updateAdminUserStatus(userId, { isActive, isDeleted, role }) {
    const updates = { updatedAt: new Date() };

    if (isActive !== undefined) {
        updates.isActive = Boolean(isActive);
    }

    if (role !== undefined && (role === 'user' || role === 'admin')) {
        updates.role = role;
    }

    if (isDeleted !== undefined) {
        const deleted = Boolean(isDeleted);
        updates.isDeleted = deleted;
        if (deleted) {
            const deletedAt = new Date();
            updates.isActive = false;
            updates.deletedAt = deletedAt;
            updates.recoveryExpiresAt = new Date(deletedAt.getTime() + 15 * 24 * 60 * 60 * 1000);
        } else {
            updates.deletedAt = null;
            updates.recoveryExpiresAt = null;
            updates.isActive = true;
        }
    }

    const [updatedUser] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, userId))
        .returning();

    return updatedUser || null;
}
