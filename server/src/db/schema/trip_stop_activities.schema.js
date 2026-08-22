import {
    pgTable,
    uuid,
    date,
    time,
    integer,
    text,
    timestamp,
    index,
    uniqueIndex,
    check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tripStops } from './trip_stops.schema.js';
import { activities } from './activities.schema.js';

export const tripStopActivities = pgTable(
    'trip_stop_activities',
    {
        id: uuid('id')
            .defaultRandom()
            .primaryKey(),

        tripStopId: uuid('trip_stop_id')
            .notNull()
            .references(() => tripStops.id, {
                onDelete: 'cascade',
            }),

        activityId: uuid('activity_id')
            .notNull()
            .references(() => activities.id, {
                onDelete: 'restrict',
            }),

        activityDate: date('activity_date', {
            mode: 'string',
        }).notNull(),

        startTime: time('start_time'),

        endTime: time('end_time'),

        sequenceOrder: integer('sequence_order')
            .default(1)
            .notNull(),

        notes: text('notes'),

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
        stopIdx: index(
            'trip_stop_activities_stop_idx',
        ).on(table.tripStopId),

        activityIdx: index(
            'trip_stop_activities_activity_idx',
        ).on(table.activityId),

        dateIdx: index(
            'trip_stop_activities_date_idx',
        ).on(
            table.tripStopId,
            table.activityDate,
        ),

        sequenceIdx: index(
            'trip_stop_activities_sequence_idx',
        ).on(
            table.tripStopId,
            table.sequenceOrder,
        ),

        duplicateActivityUnique: uniqueIndex(
            'trip_stop_activities_unique',
        ).on(
            table.tripStopId,
            table.activityId,
            table.activityDate,
            table.startTime,
        ),

        sequenceCheck: check(
            'trip_stop_activities_sequence_check',
            sql`sequence_order > 0`,
        ),

        timeCheck: check(
            'trip_stop_activities_time_check',
            sql`start_time IS NULL OR end_time IS NULL OR start_time < end_time`,
        ),
    }),
);
