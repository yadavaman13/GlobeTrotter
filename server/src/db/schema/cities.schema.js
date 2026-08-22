import {
    pgTable,
    uuid,
    text,
    numeric,
    timestamp,
    index,
    uniqueIndex,
    check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const cities = pgTable(
    'cities',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        name: text('name').notNull(),

        country: text('country').notNull(),

        region: text('region'),

        costIndex: numeric('cost_index', {
            precision: 10,
            scale: 2,
        }),

        popularity: numeric('popularity', {
            precision: 10,
            scale: 2,
        }),

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
        nameIdx: index('cities_name_idx').on(table.name),

        countryIdx: index('cities_country_idx').on(table.country),

        regionIdx: index('cities_region_idx').on(table.region),

        popularityIdx: index('cities_popularity_idx').on(table.popularity),

        countryNameUnique: uniqueIndex('cities_country_name_unique').on(table.country, table.name),

        costIndexCheck: check(
            'cities_cost_index_check',
            sql`cost_index IS NULL OR cost_index >= 0`,
        ),

        popularityCheck: check(
            'cities_popularity_check',
            sql`popularity IS NULL OR popularity >= 0`,
        ),
    }),
);
