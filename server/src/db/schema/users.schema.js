import { pgTable, uuid, text, boolean, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role_enum', ['user', 'admin']);

export const users = pgTable(
    'users',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        firstName: text('first_name').notNull(),

        lastName: text('last_name').notNull(),

        email: text('email').unique().notNull(),

        password: text('password').notNull(),

        profileImage: text('profile_image').default(
            'https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg',
        ),

        phone: text('phone'),

        city: text('city'),

        country: text('country'),

        additionalInformation: text('additional_information'),

        role: roleEnum('role').default('user').notNull(),

        emailVerified: boolean('email_verified').default(false).notNull(),

        googleId: text('google_id'),

        isActive: boolean('is_active').default(true).notNull(),

        isDeleted: boolean('is_deleted').default(false).notNull(),

        deletedAt: timestamp('deleted_at', {
            withTimezone: true,
        }),

        recoveryExpiresAt: timestamp('recovery_expires_at', {
            withTimezone: true,
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

    (table) => {
        return {
            emailIdx: index('users_email_idx').on(table.email),

            roleIdx: index('users_role_idx').on(table.role),

            phoneIdx: index('users_phone_idx').on(table.phone),

            cityIdx: index('users_city_idx').on(table.city),

            countryIdx: index('users_country_idx').on(table.country),

            isDeletedIdx: index('users_is_deleted_idx').on(table.isDeleted),

            deletedAtIdx: index('users_deleted_at_idx').on(table.deletedAt),

            recoveryExpiresAtIdx: index('users_recovery_expires_at_idx').on(
                table.recoveryExpiresAt,
            ),
        };
    },
);
