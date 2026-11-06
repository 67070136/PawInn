-- Three room types, FIVE physical rooms each. Prices are THB/night.
BEGIN;
INSERT INTO room_types (room_type_id, name, description, species, price_per_night) VALUES
    (1, 'Cozy Den', 'Comfortable bedding and a cozy space for dogs.', 'Dog', 650.00),
    (2, 'Garden Suite', 'A larger dog room with a private patio.', 'Dog', 950.00),
    (3, 'Cat Loft', 'A quiet cat room with climbing shelves and a window perch.', 'Cat', 750.00)
ON CONFLICT (room_type_id) DO NOTHING;

INSERT INTO rooms (room_id, room_type_id, room_number, is_active) VALUES
    (101, 1, 'C101', TRUE), (102, 1, 'C102', TRUE), (103, 1, 'C103', TRUE),
    (104, 1, 'C104', TRUE), (105, 1, 'C105', TRUE),
    (201, 2, 'G101', TRUE), (202, 2, 'G102', TRUE), (203, 2, 'G103', TRUE),
    (204, 2, 'G104', TRUE), (205, 2, 'G105', TRUE),
    (301, 3, 'L101', TRUE), (302, 3, 'L102', TRUE), (303, 3, 'L103', TRUE),
    (304, 3, 'L104', TRUE), (305, 3, 'L105', TRUE)
ON CONFLICT (room_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('room_types', 'room_type_id'),
    GREATEST((SELECT last_value FROM room_types_room_type_id_seq), (SELECT max(room_type_id) FROM room_types)), true);
SELECT setval(pg_get_serial_sequence('rooms', 'room_id'),
    GREATEST((SELECT last_value FROM rooms_room_id_seq), (SELECT max(room_id) FROM rooms)), true);
COMMIT;
