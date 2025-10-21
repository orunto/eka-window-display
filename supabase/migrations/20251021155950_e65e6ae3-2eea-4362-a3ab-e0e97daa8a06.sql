-- Update the handle_new_user trigger to assign roles automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  
  -- Assign role based on email
  -- Super admin gets admin role, everyone else gets customer role
  IF new.email = 'alayofortune@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin'::app_role);
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'customer'::app_role);
  END IF;
  
  RETURN new;
END;
$$;