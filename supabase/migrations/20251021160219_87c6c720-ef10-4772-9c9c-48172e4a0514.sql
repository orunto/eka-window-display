-- Grant admin role to alayofortune@gmail.com
UPDATE user_roles 
SET role = 'admin'::app_role 
WHERE user_id = '7032b444-9086-4163-a873-774b5967f1a2';