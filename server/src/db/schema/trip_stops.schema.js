import {
    pgTable,
    uuid,
    date,
    integer,
    timestamp,
    index,
    uniqueIndex,
    check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { trips } from './trips.schema.js';
import { cities } from './cities.schema.js';

export const tripStops = pgTable(
    'trip_stops',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        tripId: uuid('trip_id')
            .notNull()
            .references(() => trips.id, {
                onDelete: 'cascade',
            }),

        cityId: uuid('city_id')
            .notNull()
            .references(() => cities.id, {
                onDelete: 'restrict',
            }),

        startDate: date('start_date', {
            mode: 'string',
        }).notNull(),

        endDate: date('end_date', {
            mode: 'string',
        }).notNull(),

        sequenceOrder: integer('sequence_order').notNull(),

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
        tripIdx: index('trip_stops_trip_idx').on(table.tripId),

        cityIdx: index('trip_stops_city_idx').on(table.cityId),

        tripSequenceUnique: uniqueIndex('trip_stops_trip_sequence_unique').on(
            table.tripId,
            table.sequenceOrder,
        ),

        datesCheck: check('trip_stops_dates_check', sql`start_date <= end_date`),

        sequenceCheck: check('trip_stops_sequence_check', sql`sequence_order > 0`),
    }),
);
