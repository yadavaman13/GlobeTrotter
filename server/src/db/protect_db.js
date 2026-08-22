import 'dotenv/config';
import { pool } from '../config/database.config.js';

export async function installProtectionTrigger() {
    console.log('🔒 Installing PostgreSQL level protection triggers...');
    
    // 1. Trigger for Users
    await pool.query(`
        CREATE OR REPLACE FUNCTION protect_seeded_users()
        RETURNS TRIGGER AS $$
        BEGIN
            IF OLD.email IN (
                'aryanpatel.me@gmail.com',
                'iteshofficial@gmail.com',
                'yadavaman1948@gmail.com',
                'asr24983@gmail.com',
                'leopatel967@gmail.com',
                'doomwiser@gmail.com',
                'priya@gmail.com',
                'work.yadavaman@gmail.com',
                'skyh53624@gmail.com',
                'rohan.sharma@gmail.com',
                'neha.verma@gmail.com'
            ) THEN
                RAISE EXCEPTION 'CANNOT_DELETE_PROTECTED_USER: User % is a core seeded user and cannot be deleted!', OLD.email;
            END IF;
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
        DROP TRIGGER IF EXISTS trg_protect_seeded_users ON users;
        CREATE TRIGGER trg_protect_seeded_users
        BEFORE DELETE ON users
        FOR EACH ROW
        EXECUTE FUNCTION protect_seeded_users();
    `);

    console.log('✅ PostgreSQL Database Trigger installed: 11 core users are physically locked against deletions.');
}

if (process.argv[1]?.endsWith('protect_db.js')) {
    installProtectionTrigger()
        .then(() => pool.end())
        .catch((err) => {
            console.error('Trigger installation error:', err);
            pool.end();
        });
}
