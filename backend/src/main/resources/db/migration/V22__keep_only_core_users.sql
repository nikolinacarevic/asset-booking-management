-- Keep only role accounts + Nikolina Carevic; point her manager to user_manager
UPDATE asset_user
SET manager_email = 'mark.jones@example.com',
    last_modified_at = NOW()
WHERE username = 'nCarevic';

DELETE FROM asset_user
WHERE username NOT IN (
    'user_admin',
    'user_employee',
    'user_manager',
    'nCarevic'
);
