-- Apply this migration once to an existing D1 database created from the
-- previous schema. New databases receive the final table name from schema.sql.
ALTER TABLE music_users RENAME TO "user";
ALTER TABLE "user" ADD COLUMN last_login_at INTEGER;
