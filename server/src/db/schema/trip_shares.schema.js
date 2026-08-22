import {
    pgTable,
    uuid,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';

import { trips } from './trips.schema.js';
import { users } from './users.schema.js';

export const tripShares = pgTable(
    'trip_shares',
    {
        id: uuid('id')
            .defaultRandom()
            .primaryKey(),

        tripId: uuid('trip_id')
            .notNull()
            .references(() => trips.id, {
                onDelete: 'cascade',
            }),

        sharedWithUserId: uuid('shared_with_user_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        createdBy: uuid('created_by')
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
        tripIdx: index(
            'trip_shares_trip_idx',
        ).on(table.tripId),

        sharedWithUserIdx: index(
            'trip_shares_shared_with_user_idx',
        ).on(table.sharedWithUserId),

        uniqueShare: uniqueIndex(
            'trip_shares_unique_idx',
        ).on(
            table.tripId,
            table.sharedWithUserId,
        ),
    }),
);
