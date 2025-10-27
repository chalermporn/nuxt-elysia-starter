<script setup lang="ts">
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

interface MembersResponse {
  data: Member[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const { $api } = useNuxtApp()

const currentPage = ref(1)
const searchQuery = ref('')
const members = ref<Member[]>([])
const isLoading = ref(false)
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
})

async function fetchMembers() {
  isLoading.value = true

  try {
    const { data, error } = await $api.members.get({
      query: {
        page: currentPage.value.toString(),
        limit: '10',
        search: searchQuery.value,
      },
    })

    if (error) {
      console.error('Failed to fetch members:', error)
      return
    }

    const response = data as MembersResponse
    members.value = response.data
    pagination.value = response.pagination
  }
  finally {
    isLoading.value = false
  }
}

function nextPage() {
  if (pagination.value.hasNext) {
    currentPage.value++
    fetchMembers()
  }
}

function prevPage() {
  if (pagination.value.hasPrev) {
    currentPage.value--
    fetchMembers()
  }
}

function goToPage(page: number) {
  currentPage.value = page
  fetchMembers()
}

function handleSearch() {
  currentPage.value = 1
  fetchMembers()
}

// Initial fetch
onMounted(() => {
  fetchMembers()
})
</script>

<template>
  <div style="max-width: 1400px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <h1 style="color: #333; margin-bottom: 20px;">
      รายชื่อสมาชิก
    </h1>

    <!-- Search Bar -->
    <div style="margin-bottom: 20px;">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาสมาชิก (ชื่อ, อีเมล, เมือง)..."
        style="padding: 10px; width: 300px; border: 1px solid #ddd; border-radius: 4px;"
        @keyup.enter="handleSearch"
      >
      <button
        style="padding: 10px 20px; margin-left: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
        @click="handleSearch"
      >
        ค้นหา
      </button>
      <button
        v-if="searchQuery"
        style="padding: 10px 20px; margin-left: 10px; background-color: #888; color: white; border: none; border-radius: 4px; cursor: pointer;"
        @click="searchQuery = ''; handleSearch()"
      >
        ล้างการค้นหา
      </button>
    </div>

    <!-- Summary -->
    <div style="margin-bottom: 15px; color: #666;">
      แสดง {{ (pagination.page - 1) * pagination.limit + 1 }} - {{ Math.min(pagination.page * pagination.limit, pagination.total) }} จาก {{ pagination.total }} รายการ
    </div>

    <!-- Table -->
    <div style="overflow-x: auto; border: 1px solid #ddd; border-radius: 8px;">
      <table style="width: 100%; border-collapse: collapse; background: white;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">
              ID
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">
              ชื่อ
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">
              นามสกุล
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">
              อีเมล
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">
              เบอร์โทร
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">
              อายุ
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">
              เมือง
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">
              สถานะ
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">
              วันที่สมัคร
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Skeleton Loading -->
          <template v-if="isLoading">
            <tr
              v-for="i in 10"
              :key="`skeleton-${i}`"
              style="border-bottom: 1px solid #eee;"
            >
              <td
                v-for="col in 9"
                :key="`skeleton-${i}-${col}`"
                style="padding: 12px;"
              >
                <div
                  class="skeleton"
                  :style="{
                    height: '22px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    width: col === 4 ? '200px' : col === 1 ? '40px' : '100px',
                  }"
                />
              </td>
            </tr>
          </template>

          <!-- Actual Data -->
          <template v-else>
            <tr
              v-for="member in members"
              :key="member.id"
              style="border-bottom: 1px solid #eee;"
            >
              <td style="padding: 12px;">
                {{ member.id }}
              </td>
              <td style="padding: 12px;">
                {{ member.firstName }}
              </td>
              <td style="padding: 12px;">
                {{ member.lastName }}
              </td>
              <td style="padding: 12px;">
                {{ member.email }}
              </td>
              <td style="padding: 12px;">
                {{ member.phone }}
              </td>
              <td style="padding: 12px;">
                {{ member.age }}
              </td>
              <td style="padding: 12px;">
                {{ member.city }}
              </td>
              <td style="padding: 12px;">
                <span
                  :style="{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: member.status === 'active' ? '#4CAF50' : '#f44336',
                    color: 'white',
                  }"
                >
                  {{ member.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
                </span>
              </td>
              <td style="padding: 12px;">
                {{ member.joinDate }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div style="margin-top: 20px; display: flex; justify-content: center; align-items: center; gap: 10px;">
      <button
        :disabled="!pagination.hasPrev"
        style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background-color: white; cursor: pointer;"
        :style="{ opacity: pagination.hasPrev ? 1 : 0.5, cursor: pagination.hasPrev ? 'pointer' : 'not-allowed' }"
        @click="prevPage"
      >
        ก่อนหน้า
      </button>

      <div style="display: flex; gap: 5px;">
        <button
          v-for="page in pagination.totalPages"
          :key="page"
          :style="{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: currentPage === page ? '#4CAF50' : 'white',
            color: currentPage === page ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: currentPage === page ? 'bold' : 'normal',
          }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        :disabled="!pagination.hasNext"
        style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background-color: white; cursor: pointer;"
        :style="{ opacity: pagination.hasNext ? 1 : 0.5, cursor: pagination.hasNext ? 'pointer' : 'not-allowed' }"
        @click="nextPage"
      >
        ถัดไป
      </button>
    </div>

    <div style="margin-top: 10px; text-align: center; color: #666;">
      หน้า {{ pagination.page }} จาก {{ pagination.totalPages }}
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(to right, #e0e0e0 0%, #f0f0f0 20%, #e0e0e0 40%, #e0e0e0 100%);
  background-size: 1000px 100%;
}
</style>
