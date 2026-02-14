# 🚀 MongoDB Deployment Instructions for Coolify

## ✅ Migration Complete!

Your application has been successfully migrated from PostgreSQL to MongoDB.

## 📋 Required: Update Coolify Environment Variable

### Step 1: Get Your MongoDB Password
You need to replace `<db_password>` in your connection string with your actual MongoDB password.

**Your MongoDB Connection String:**
```
mongodb+srv://my_sassarwa:<db_password>@cluster0.vrwfofd.mongodb.net/arwaeduc?retryWrites=true&w=majority&appName=Cluster0
```

### Step 2: Update DATABASE_URL in Coolify

1. **Go to Coolify Dashboard**
2. **Navigate to:** `Projects → sassarwa-backend → Configuration`
3. **Find Environment Variables section**
4. **Update or Add:**
   ```
   DATABASE_URL=mongodb+srv://my_sassarwa:YOUR_ACTUAL_PASSWORD@cluster0.vrwfofd.mongodb.net/arwaeduc?retryWrites=true&w=majority&appName=Cluster0
   ```
   
   ⚠️ **Replace `YOUR_ACTUAL_PASSWORD` with your real MongoDB password**

5. **Save the changes**

### Step 3: Redeploy

Click the **"Redeploy"** button in Coolify

## 📊 Expected Deployment Logs

You should see:

```
🚀 Starting MongoDB deployment process...
📦 Pushing Prisma schema to MongoDB...
✅ Schema pushed to MongoDB
🌱 Running database seed...
🚀 Starting MongoDB database seed...
✅ MongoDB connected successfully
✅ Admin account created: { email: 'enovazone@arwaeduc.com', ... }
✅ Secretary account created: { email: 'secretary@arwaeduc.com', ... }
✅ MongoDB database seed completed successfully!
📋 Login Credentials:
Admin: enovazone@arwaeduc.com / admin123
Secretary: secretary@arwaeduc.com / secretary123
✅ Seeding completed
🚀 Starting server...
🚀 Server is running on port 3001
```

## 🔐 Login Credentials

After successful deployment:

**Admin Account:**
- Email: `enovazone@arwaeduc.com`
- Password: `admin123`

**Secretary Account:**
- Email: `secretary@arwaeduc.com`
- Password: `secretary123`

## ❓ Where to Find MongoDB Password

### If you forgot your MongoDB password:

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Login to your account**
3. **Navigate to:** Database Access (left sidebar)
4. **Find user:** `my_sassarwa`
5. **Click:** "Edit" → "Edit Password"
6. **Set a new password** or copy existing one
7. **Update the password in Coolify**

## 🔧 MongoDB Atlas Setup (If needed)

1. **Whitelist IP Addresses:**
   - Go to: Network Access
   - Add IP: `0.0.0.0/0` (Allow from anywhere)
   - Or add your Coolify server IP

2. **Verify Database User:**
   - Database Access → Users
   - User: `my_sassarwa` should have "Read and write" permissions
   - Database: `arwaeduc`

## 🔍 Troubleshooting

### Error: "Authentication failed"
- Verify your password in the DATABASE_URL
- Check if special characters in password are URL-encoded
- Example: `p@ssw0rd!` becomes `p%40ssw0rd%21`

### Error: "Can't reach database server"
- Check Network Access in MongoDB Atlas
- Add `0.0.0.0/0` to IP whitelist
- Verify connection string format

### Error: "Database does not exist"
- MongoDB will create `arwaeduc` database automatically
- No action needed - just redeploy

### Still Getting "User not found" Error?
Run in Coolify Terminal:
```bash
node seed.js
```

## 📝 What Changed

✅ **Database:** PostgreSQL → MongoDB Atlas
✅ **Schema:** Converted to MongoDB format
✅ **IDs:** UUID → MongoDB ObjectId
✅ **Enums:** Converted to String types
✅ **Migrations:** Removed (MongoDB uses `db push`)
✅ **Seeding:** Updated for MongoDB

## 🎯 Next Steps

1. ✅ Committed and pushed to GitHub
2. 🔄 Update DATABASE_URL in Coolify
3. 🚀 Redeploy in Coolify
4. ✅ Login and test!

## Need Help?

Check the detailed migration guide: `MONGODB_MIGRATION.md`
