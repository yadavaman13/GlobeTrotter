import {
    pgTable,
    uuid,
    text,
    date,
    numeric,
    timestamp,
    pgEnum,
    index,
    check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema.js';

// --------------------------------------------------
// TRIP VISIBILITY
// --------------------------------------------------

export const tripVisibilityEnum = pgEnum('trip_visibility_enum', ['private', 'public']);

// --------------------------------------------------
// TRIP STATUS
// --------------------------------------------------

export const tripStatusEnum = pgEnum('trip_status_enum', [
    'draft',
    'planned',
    'ongoing',
    'completed',
    'cancelled',
]);

// --------------------------------------------------
// TRIPS
// --------------------------------------------------

export const trips = pgTable(
    'trips',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        ownerId: uuid('owner_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        name: text('name').notNull(),

        description: text('description'),

        startDate: date('start_date', {
            mode: 'string',
        }).notNull(),

        endDate: date('end_date', {
            mode: 'string',
        }).notNull(),

        coverPhotoUrl: text('cover_photo_url'),

        budgetAmount: numeric('budget_amount', {
            precision: 12,
            scale: 2,
        }),

        budgetCurrency: text('budget_currency').default('INR').notNull(),

        // ------------------------------------------
        // STATUS
        // ------------------------------------------

        status: tripStatusEnum('status').default('draft').notNull(),

        // ------------------------------------------
        // VISIBILITY
        // ------------------------------------------

        visibility: tripVisibilityEnum('visibility').default('private').notNull(),

        publicSlug: text('public_slug').unique(),

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
        // ------------------------------------------
        // OWNER / USER QUERIES
        // ------------------------------------------

        ownerIdx: index('trips_owner_idx').on(table.ownerId),

        ownerStartDateIdx: index('trips_owner_start_date_idx').on(table.ownerId, table.startDate),

        // ------------------------------------------
        // STATUS
        // ------------------------------------------

        statusIdx: index('trips_status_idx').on(table.status),

        ownerStatusIdx: index('trips_owner_status_idx').on(table.ownerId, table.status),

        // ------------------------------------------
        // VISIBILITY
        // ------------------------------------------

        visibilityIdx: index('trips_visibility_idx').on(table.visibility),

        publicSlugIdx: index('trips_public_slug_idx').on(table.publicSlug),

        // ------------------------------------------
        // CONSTRAINTS
        // ------------------------------------------

        datesCheck: check('trips_dates_check', sql`start_date <= end_date`),

        budgetCheck: check('trips_budget_check', sql`budget_amount IS NULL OR budget_amount >= 0`),
    }),
);
