# MongoDB Migration Guide

## Overview
This guide explains how to migrate the ArwaEduc application from PostgreSQL to MongoDB.

## Key Changes

### 1. Database Provider
- **Before:** PostgreSQL
- **After:** MongoDB

### 2. Schema Changes
- **ID Fields:** Changed from `uuid()` to MongoDB `ObjectId`
- **Enums:** Converted to String types (MongoDB doesn't support enums in Prisma)
- **Migrations:** Removed - MongoDB uses `prisma db push` instead
- **Relations:** Updated to use `@db.ObjectId` for foreign keys

### 3. Environment Variables

Update your `.env` file or deployment environment variables:

```bash
# From PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# To MongoDB Atlas (Recommended for production)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/arwaeduc?retryWrites=true&w=majority"

# Or local MongoDB
DATABASE_URL="mongodb://localhost:27017/arwaeduc"
```

## MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended for Production)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP or use `0.0.0.0/0` for all IPs (less secure)
6. Get your connection string
7. Update `DATABASE_URL` in your deployment environment

**Atlas Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### Option 2: Local MongoDB

Install MongoDB locally:

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Connection String:**
```
DATABASE_URL="mongodb://localhost:27017/arwaeduc"
```

## Deployment Steps

### For Coolify/Railway/Render

1. **Update Environment Variable**
   - Go to your deployment dashboard
   - Update `DATABASE_URL` to your MongoDB connection string
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/arwaeduc`

2. **Clean Up Old Migrations**
   ```bash
   rm -rf prisma/migrations
   ```

3. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Migrate from PostgreSQL to MongoDB"
   git push
   ```

4. **Redeploy**
   - The deployment will automatically:
     - Generate Prisma Client for MongoDB
     - Push schema to MongoDB (no migrations needed)
     - Run seed script to create admin user
     - Start the server

## Verification

After deployment, check logs for:

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
```

## Testing Login

Try logging in with:
- **Email:** `enovazone@arwaeduc.com`
- **Password:** `admin123`

## Important Notes

### Enum Handling
Since MongoDB doesn't support enums in Prisma, values are now stored as strings:

- **UserRole:** `"ADMIN"`, `"SECRETARY"`, `"SUPER_ADMIN"`
- **InscriptionType:** `"SOUTIEN"`, `"FORMATION"`
- **TransactionType:** `"INCOME"`, `"EXPENSE"`

Make sure your application code uses string comparisons instead of enum values.

### Data Migration
⚠️ **Important:** This migration creates a **new empty MongoDB database**. If you need to migrate existing PostgreSQL data:

1. Export data from PostgreSQL
2. Transform UUIDs to ObjectIds
3. Transform enum values to strings
4. Import data to MongoDB

Contact your developer for data migration scripts if needed.

## Troubleshooting

### Error: "Can't reach database server"
- Check your MongoDB connection string
- Verify MongoDB is running (if local)
- Check network/firewall settings
- For Atlas: Whitelist your IP address

### Error: "Authentication failed"
- Verify username and password in connection string
- Ensure database user has proper permissions

### Error: "Database does not exist"
- MongoDB will create the database automatically
- Ensure database name is in connection string

### Schema Push Fails
```bash
# Manually push schema
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

## Rollback to PostgreSQL

If you need to rollback:

1. Restore the PostgreSQL schema:
   ```bash
   cp prisma/schema.prisma.postgresql.backup prisma/schema.prisma
   ```

2. Update `DATABASE_URL` back to PostgreSQL

3. Commit and redeploy

## Files Modified

- ✅ `prisma/schema.prisma` - Converted to MongoDB
- ✅ `seed.js` - Updated for MongoDB ObjectIds
- ✅ `package.json` - Changed migrate to db push
- ✅ `Procfile` - Updated deployment command
- ✅ `start.sh` - Updated startup script
- ✅ `.env.mongodb.example` - MongoDB connection string example

## Support

For additional help:
- [Prisma MongoDB Documentation](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
