import {
    pgTable,
    uuid,
    text,
    integer,
    numeric,
    timestamp,
    index,
    check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { cities } from './cities.schema.js';

export const activities = pgTable(
    'activities',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        cityId: uuid('city_id')
            .notNull()
            .references(() => cities.id, {
                onDelete: 'restrict',
            }),

        name: text('name').notNull(),

        description: text('description'),

        activityType: text('activity_type'),

        cost: numeric('cost', {
            precision: 12,
            scale: 2,
        }),

        durationMinutes: integer('duration_minutes'),

        currency: text('currency').default('INR'),

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
        cityIdx: index('activities_city_idx').on(table.cityId),

        typeIdx: index('activities_type_idx').on(table.activityType),

        costIdx: index('activities_cost_idx').on(table.cost),

        durationIdx: index('activities_duration_idx').on(table.durationMinutes),

        cityNameIdx: index('activities_city_name_idx').on(table.cityId, table.name),

        costCheck: check('activities_cost_check', sql`cost IS NULL OR cost >= 0`),

        durationCheck: check(
            'activities_duration_check',
            sql`duration_minutes IS NULL OR duration_minutes > 0`,
        ),
    }),
);
