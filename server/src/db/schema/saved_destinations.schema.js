import { pgTable, uuid, timestamp, index, primaryKey } from 'drizzle-orm/pg-core';

import { users } from './users.schema.js';
import { cities } from './cities.schema.js';

export const savedDestinations = pgTable(
    'saved_destinations',
    {
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        cityId: uuid('city_id')
            .notNull()
            .references(() => cities.id, {
                onDelete: 'cascade',
            }),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },

    (table) => ({
        pk: primaryKey({
            columns: [table.userId, table.cityId],
        }),

        cityIdx: index('saved_destinations_city_idx').on(table.cityId),

        userIdx: index('saved_destinations_user_idx').on(table.userId),
    }),
);
