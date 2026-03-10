

## Plan: Restore Supabase Integration via Consolidated Migration

The new Supabase project is empty (no tables, no storage buckets, no functions). All 13 original migrations and 2 edge functions are preserved in the codebase. I'll create a single consolidated migration that sets up everything cleanly, then update the types file to match.

### Step 1: Create consolidated migration

A single new migration combining all 13 files into one, in correct dependency order, avoiding duplicate inserts and conflicts from the incremental approach:

1. **Enum**: `app_role` (admin, customer)
2. **Tables** (in order):
   - `categories`
   - `collections` (with `features` column)
   - `products` (with `price_ngn`, `price_usd`, `price_gbp` columns)
   - `product_variants`
   - `profiles` (with `tier`, `delivery_address`, `phone_number`)
   - `user_roles`
   - `orders` (with `currency`, status constraint for initiated/paid/processing/shipped/delivered/cancelled)
   - `order_items` (with `variant_id`, `variant_name`, `variant_type`)
   - `client_applications` (with `about_yourself`)
   - `site_settings`
3. **Functions**: `is_admin()`, `has_role()`, `handle_new_user()`, `update_updated_at_column()`
4. **Triggers**: auto-create profile + assign role on signup, updated_at triggers
5. **RLS policies**: all policies for every table
6. **Storage**: `product-images` bucket with public read / admin write policies
7. **Seed data**: sample categories, collections, products, variants, default site settings, payment key placeholders

### Step 2: Update `supabase/config.toml`

Add edge function declarations for `register-user` and `verify-paystack-payment` with `verify_jwt = false`.

### Step 3: Update types file

After the migration runs, the types file will be auto-regenerated to reflect all the new tables. This will fix all the build errors (the `'never'` type errors are caused by the empty types file having no table definitions).

### Step 4: Deploy edge functions

The two existing edge functions (`register-user`, `verify-paystack-payment`) will be deployed automatically.

### What you'll need to do manually after
- Re-enter Paystack public/secret keys in admin Site Settings
- Re-upload product images via admin dashboard
- Sign up with `alayofortune@gmail.com` to get the auto-assigned admin role
- Re-approve any client applications

