# Database (Drizzle ORM + SQLite)

โปรเจคนี้ใช้ Drizzle ORM กับ SQLite (bun:sqlite) สำหรับการจัดการข้อมูล

## คำสั่งที่มีให้ใช้

### สร้าง Migration
```bash
bun run db:generate
```
สร้าง migration files จาก schema ที่กำหนดใน `server/db/schema.ts`

### Push Schema ไปยัง Database
```bash
bun run db:push
```
อัพเดท database schema โดยตรงโดยไม่ต้องสร้าง migration (เหมาะสำหรับ development)

### เติมข้อมูลเริ่มต้น (Seed)
```bash
bun run db:seed
```
เติมข้อมูลตัวอย่าง 100 รายการเข้าสู่ database

### เปิด Drizzle Studio
```bash
bun run db:studio
```
เปิด GUI สำหรับดูและแก้ไขข้อมูลใน database

## โครงสร้างไฟล์

```
server/
  db/
    index.ts          # Database connection
    schema.ts         # Database schema definitions
    seed.ts           # Seed script
    migrations/       # Migration files
drizzle.config.ts     # Drizzle configuration
sqlite.db             # SQLite database file (gitignored)
```

## Schema

ตาราง `members` มีฟิลด์ดังนี้:
- `id` - Primary key (auto increment)
- `firstName` - ชื่อ
- `lastName` - นามสกุล
- `email` - อีเมล (unique)
- `phone` - เบอร์โทรศัพท์
- `age` - อายุ
- `city` - เมือง
- `status` - สถานะ ('active' | 'inactive')
- `joinDate` - วันที่สมัคร
- `createdAt` - วันที่สร้างข้อมูล

## การใช้งานใน API

ดูตัวอย่างการใช้งานใน `api.ts`:
- การ query ข้อมูลแบบมี pagination
- การค้นหาด้วย `like`
- การใช้ `count` สำหรับนับจำนวนรายการ
