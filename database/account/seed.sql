-- Invented college-demo accounts. Shared password: PawInnDemo123!
-- Use only in your local demo/test database. Existing IDs are never overwritten.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (user_id, full_name, email, password_hash, phone, role) VALUES
    (1001, 'Jamie Parker', 'jamie@pawinn.demo', crypt('PawInnDemo123!', gen_salt('bf', 10)), '0800000001', 'CUSTOMER'),
    (1002, 'Alex Morgan', 'alex@pawinn.demo', crypt('PawInnDemo123!', gen_salt('bf', 10)), '0800000002', 'CUSTOMER'),
    (1003, 'PawInn Team', 'team@pawinn.demo', crypt('PawInnDemo123!', gen_salt('bf', 10)), '0800000003', 'STAFF')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO pets (pet_id, owner_id, name, species, breed, birth_date, care_notes) VALUES
    (2001, 1001, 'Mochi', 'Dog', 'Golden Retriever', DATE '2022-04-12', 'Feed twice daily. Loves tennis balls.'),
    (2002, 1001, 'Miso', 'Cat', 'Domestic Shorthair', DATE '2021-08-20', 'Quiet room preferred. Wet food in the evening.'),
    (2003, 1002, 'Buddy', 'Dog', 'Beagle', DATE '2023-01-15', 'Daily walks. Keep treats small.'),
    (2004, 1002, 'Luna', 'Cat', 'British Shorthair', DATE '2022-11-05', 'Enjoys a window perch. Brush gently.')
ON CONFLICT (pet_id) DO NOTHING;

-- Explicit fixture IDs must not collide with later generated IDs.
SELECT setval(pg_get_serial_sequence('users', 'user_id'),
    GREATEST((SELECT last_value FROM users_user_id_seq), (SELECT max(user_id) FROM users)), true);
SELECT setval(pg_get_serial_sequence('pets', 'pet_id'),
    GREATEST((SELECT last_value FROM pets_pet_id_seq), (SELECT max(pet_id) FROM pets)), true);
COMMIT;
