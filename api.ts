import { Elysia } from 'elysia'

// จำลองข้อมูลสมาชิก 100 รายการ
interface Member {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  city: string
  status: 'active' | 'inactive'
  joinDate: string
}

function generateMembers(): Member[] {
  const firstNames = ['สมชาย', 'สมหญิง', 'วิชัย', 'สุดา', 'ประยุทธ', 'อรุณ', 'นภา', 'ชัยวัฒน์', 'กนกวรรณ', 'ธนากร']
  const lastNames = ['ใจดี', 'รักสงบ', 'มั่นคง', 'ซื่อสัตย์', 'เจริญสุข', 'สว่างไสว', 'ทองดี', 'บุญมี', 'สุขใจ', 'เพียรพยายาม']
  const cities = ['กรุงเทพฯ', 'เชียงใหม่', 'ภูเก็ต', 'ขอนแก่น', 'นครราชสีมา', 'หาดใหญ่', 'อุดรธานี', 'สุราษฎร์ธานี', 'ระยอง', 'ชลบุรี']

  const members: Member[] = []

  for (let i = 1; i <= 100; i++) {
    members.push({
      id: i,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)]!,
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)]!,
      email: `member${i}@example.com`,
      phone: `08${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      age: Math.floor(Math.random() * 50) + 20,
      city: cities[Math.floor(Math.random() * cities.length)]!,
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      joinDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]!,
    })
  }

  return members
}

const allMembers = generateMembers()

export default () => new Elysia()
  .get('/hello', () => ({ message: 'Hello world!' }))
  .get('/members', ({ query }) => {
    const page = Number.parseInt(query.page as string) || 1
    const limit = Number.parseInt(query.limit as string) || 10
    const search = (query.search as string) || ''

    // Filter members by search
    let filteredMembers = allMembers
    if (search) {
      filteredMembers = allMembers.filter(member =>
        member.firstName.includes(search)
        || member.lastName.includes(search)
        || member.email.includes(search)
        || member.city.includes(search),
      )
    }

    const total = filteredMembers.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit

    const members = filteredMembers.slice(start, end)

    return {
      data: members,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  })
