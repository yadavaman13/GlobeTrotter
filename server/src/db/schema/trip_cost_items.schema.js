import {
    pgTable,
    uuid,
    text,
    numeric,
    date,
    timestamp,
    pgEnum,
    index,
    check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { trips } from './trips.schema.js';
import { tripStops } from './trip_stops.schema.js';
import { tripStopActivities } from './trip_stop_activities.schema.js';

export const costCategoryEnum = pgEnum(
    'cost_category_enum',
    [
        'transport',
        'stay',
        'activity',
        'meal',
    ],
);

export const tripCostItems = pgTable(
    'trip_cost_items',
    {
        id: uuid('id')
            .defaultRandom()
            .primaryKey(),

        tripId: uuid('trip_id')
            .notNull()
            .references(() => trips.id, {
                onDelete: 'cascade',
            }),

        tripStopId: uuid('trip_stop_id')
            .references(() => tripStops.id, {
                onDelete: 'set null',
            }),

        tripStopActivityId: uuid(
            'trip_stop_activity_id',
        ).references(() => tripStopActivities.id, {
            onDelete: 'set null',
        }),

        category: costCategoryEnum('category')
            .notNull(),

        description: text('description'),

        amount: numeric('amount', {
            precision: 12,
            scale: 2,
        }).notNull(),

        currency: text('currency')
            .default('INR')
            .notNull(),

        costDate: date('cost_date', {
            mode: 'string',
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
        tripIdx: index(
            'trip_cost_items_trip_idx',
        ).on(table.tripId),

        stopIdx: index(
            'trip_cost_items_stop_idx',
        ).on(table.tripStopId),

        activityIdx: index(
            'trip_cost_items_activity_idx',
        ).on(table.tripStopActivityId),

        categoryIdx: index(
            'trip_cost_items_category_idx',
        ).on(
            table.tripId,
            table.category,
        ),

        costDateIdx: index(
            'trip_cost_items_date_idx',
        ).on(
            table.tripId,
            table.costDate,
        ),

        amountCheck: check(
            'trip_cost_items_amount_check',
            sql`amount >= 0`,
        ),
    }),
);
