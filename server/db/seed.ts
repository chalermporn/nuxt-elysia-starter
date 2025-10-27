import process from 'node:process'
import { db } from './index'
import { members } from './schema'

function generateMembers() {
  const firstNames = ['สมชาย', 'สมหญิง', 'วิชัย', 'สุดา', 'ประยุทธ', 'อรุณ', 'นภา', 'ชัยวัฒน์', 'กนกวรรณ', 'ธนากร']
  const lastNames = ['ใจดี', 'รักสงบ', 'มั่นคง', 'ซื่อสัตย์', 'เจริญสุข', 'สว่างไสว', 'ทองดี', 'บุญมี', 'สุขใจ', 'เพียรพยายาม']
  const cities = ['กรุงเทพฯ', 'เชียงใหม่', 'ภูเก็ต', 'ขอนแก่น', 'นครราชสีมา', 'หาดใหญ่', 'อุดรธานี', 'สุราษฎร์ธานี', 'ระยอง', 'ชลบุรี']

  const membersData = []

  for (let i = 1; i <= 100; i++) {
    membersData.push({
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)]!,
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)]!,
      email: `member${i}@example.com`,
      phone: `08${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      age: Math.floor(Math.random() * 50) + 20,
      city: cities[Math.floor(Math.random() * cities.length)]!,
      status: Math.random() > 0.3 ? 'active' : 'inactive' as 'active' | 'inactive',
      joinDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]!,
    })
  }

  return membersData
}

async function seed() {
  console.warn('🌱 Seeding database...')

  // Clear existing data
  await db.delete(members)

  // Insert new data
  const membersData = generateMembers()
  await db.insert(members).values(membersData)

  console.warn('✅ Database seeded successfully!')
  console.warn(`📊 Inserted ${membersData.length} members`)
}

seed()
  .catch((error) => {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  })
