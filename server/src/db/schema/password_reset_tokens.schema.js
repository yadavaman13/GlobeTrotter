import {
    pgTable,
    uuid,
    text,
    timestamp,
    index,
} from 'drizzle-orm/pg-core';

import { users } from './users.schema.js';

export const passwordResetTokens = pgTable(
    'password_reset_tokens',
    {
        id: uuid('id')
            .defaultRandom()
            .primaryKey(),

        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        tokenHash: text('token_hash')
            .notNull()
            .unique(),

        expiresAt: timestamp('expires_at', {
            withTimezone: true,
        }).notNull(),

        usedAt: timestamp('used_at', {
            withTimezone: true,
        }),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },

    (table) => ({
        userIdx: index(
            'password_reset_tokens_user_idx',
        ).on(table.userId),

        hashIdx: index(
            'password_reset_tokens_hash_idx',
        ).on(table.tokenHash),
    }),
);
