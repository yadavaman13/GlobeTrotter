import { pgTable, uuid, text, integer, timestamp, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { activities } from './activities.schema.js';

export const activityImages = pgTable(
    'activity_images',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        activityId: uuid('activity_id')
            .notNull()
            .references(() => activities.id, {
                onDelete: 'cascade',
            }),

        imageUrl: text('image_url').notNull(),

        displayOrder: integer('display_order').default(0).notNull(),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },

    (table) => ({
        activityIdx: index('activity_images_activity_idx').on(table.activityId),

        orderIdx: index('activity_images_order_idx').on(table.activityId, table.displayOrder),

        orderCheck: check('activity_images_order_check', sql`display_order >= 0`),
    }),
);
