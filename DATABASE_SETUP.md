🔧 DATABASE SETUP REQUIRED

The following columns need to be added to the "packages" table in Supabase:

1. **rating** - NUMERIC(3,1) - for storing package ratings (0.0 to 5.0)
2. **reviewCount** - INTEGER - for storing number of reviews

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW TO ADD COLUMNS TO SUPABASE:

1. Go to https://app.supabase.com
2. Select your project (araku-valley)
3. Click "SQL Editor" in the left sidebar
4. Click "+ New Query"
5. Copy and paste this SQL:

```sql
ALTER TABLE packages ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT NULL;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER DEFAULT 0;
```

6. Click "Run" (or Ctrl+Enter)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ WHAT'S BEEN FIXED:

1. ✅ Admin can now edit rating and review count in PackageEditor form
2. ✅ Itinerary JSON parsing improved with better error handling
3. ✅ Footer "Terms of Service" link now opens the modal
4. ✅ PackageDetail "Terms & Conditions" link now opens the global modal
5. ✅ Modal positioned globally in AppRouter (accessible from anywhere)
6. ✅ Cleaned up duplicate modal code from PackageDetail

📋 FEATURES WORKING:

- Admin dashboard → Edit Package → Add/Edit Rating and Review Count
- Package detail page → Shows rating and review count if available
- Click "Terms & Conditions" anywhere → Beautiful modal opens
- Footer "Terms of Service" link → Opens the same modal
- Itinerary saved as JSON → Properly parsed and displayed

🚀 NEXT STEPS:

1. Add the database columns using the SQL above
2. Reload the app
3. Admin can now edit review ratings in package editor
4. Terms & Conditions modal works from all pages
