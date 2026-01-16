# Deployment Guide for GrowGreen

This guide provides instructions for deploying the GrowGreen application to Vercel and setting up the Supabase production environment.

## 1. Environment Variables

Configure the following environment variables in your Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Supabase Setup

### Database Migrations
Push your local database schema to the production Supabase instance:

```bash
npx supabase db push
```

### Edge Functions
Deploy the `detect-no-shows` edge function:

```bash
npx supabase functions deploy detect-no-shows --no-verify-jwt
```
*Note: We disable JWT verification if this is triggered by a cron job or system key.*

### Storage
Ensure the `chat-images` bucket is public and has the correct policies applied (already handled in migrations).

## 3. Cron Jobs (Automated Penalties)
To schedule the penalty system, you can use `pg_cron` in Supabase or an external scheduler triggering the Edge Function.

**Using pg_cron (SQL):**
```sql
select
  cron.schedule(
    'detect-no-shows-hourly',
    '0 * * * *', -- Run every hour
    $$
    select
      net.http_post(
          url:='https://<project-ref>.supabase.co/functions/v1/detect-no-shows',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer <service-role-key>"}'::jsonb
      ) as request_id;
    $$
  );
```

## 4. Vercel Deployment
1. Connect your GitHub repository to Vercel.
2. The build command `npm run build` will be detected automatically.
3. Deploy!
