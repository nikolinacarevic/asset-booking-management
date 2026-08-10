-- Keep only role accounts + Nikolina Carevic; point her manager to user_manager
UPDATE asset_user
SET manager_email = 'mark.jones@example.com',
    last_modified_at = NOW()
WHERE username = 'nCarevic';

-- Remove bookings (and department manager links) for users about to be deleted
DELETE FROM booking
WHERE user_id IN (
    SELECT id
    FROM asset_user
    WHERE username NOT IN (
        'user_admin',
        'user_employee',
        'user_manager',
        'nCarevic'
    )
);

UPDATE department
SET manager_id = NULL
WHERE manager_id IN (
    SELECT id
    FROM asset_user
    WHERE username NOT IN (
        'user_admin',
        'user_employee',
        'user_manager',
        'nCarevic'
    )
);

DELETE FROM asset_user
WHERE username NOT IN (
    'user_admin',
    'user_employee',
    'user_manager',
    'nCarevic'
);
