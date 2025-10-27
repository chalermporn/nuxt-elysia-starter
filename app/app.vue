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
  <div class="max-w-7xl mx-auto p-5 font-sans">
    <h1 class="text-gray-800 mb-5 text-3xl font-bold">
      รายชื่อสมาชิก
    </h1>

    <!-- Search Bar -->
    <div class="mb-5">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาสมาชิก (ชื่อ, อีเมล, เมือง)..."
        class="p-2.5 w-80 border border-gray-300 rounded"
        @keyup.enter="handleSearch"
      >
      <button
        class="py-2.5 px-5 ml-2.5 bg-green-600 text-white border-none rounded cursor-pointer hover:bg-green-700"
        @click="handleSearch"
      >
        ค้นหา
      </button>
      <button
        v-if="searchQuery"
        class="py-2.5 px-5 ml-2.5 bg-gray-600 text-white border-none rounded cursor-pointer hover:bg-gray-700"
        @click="searchQuery = ''; handleSearch()"
      >
        ล้างการค้นหา
      </button>
    </div>

    <!-- Summary -->
    <div class="mb-4 text-gray-600">
      แสดง {{ (pagination.page - 1) * pagination.limit + 1 }} - {{ Math.min(pagination.page * pagination.limit, pagination.total) }} จาก {{ pagination.total }} รายการ
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border border-gray-300 rounded-lg">
      <table class="w-full border-collapse bg-white">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3 text-left border-b-2 border-gray-300">
              ID
            </th>
            <th class="p-3 text-left border-b-2 border-gray-300">
              ชื่อ
            </th>
            <th class="p-3 text-left border-b-2 border-gray-300">
              นามสกุล
            </th>
            <th class="p-3 text-left border-b-2 border-gray-300">
              อีเมล
            </th>
            <th class="p-3 text-left border-b-2 border-gray-300">
              เบอร์โทร
            </th>
            <th class="p-3 text-left border-b-2 border-gray-300">
              อายุ
            </th>
            <th class="p-3 text-left border-b-2 border-gray-300">
              เมือง
            </th>
            <th class="p-3 text-left border-b-2 border-gray-300">
              สถานะ
            </th>
            <th class="p-3 text-left border-b-2 border-gray-300">
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
              class="border-b border-gray-200"
            >
              <td
                v-for="col in 9"
                :key="`skeleton-${i}-${col}`"
                class="p-3"
              >
                <div
                  class="skeleton h-5.5 bg-gray-300 rounded"
                  :class="{
                    'w-10': col === 1,
                    'w-50': col === 4,
                    'w-25': col !== 1 && col !== 4,
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
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="p-3">
                {{ member.id }}
              </td>
              <td class="p-3">
                {{ member.firstName }}
              </td>
              <td class="p-3">
                {{ member.lastName }}
              </td>
              <td class="p-3">
                {{ member.email }}
              </td>
              <td class="p-3">
                {{ member.phone }}
              </td>
              <td class="p-3">
                {{ member.age }}
              </td>
              <td class="p-3">
                {{ member.city }}
              </td>
              <td class="p-3">
                <span
                  class="py-1 px-3 rounded-xl text-xs font-bold text-white"
                  :class="member.status === 'active' ? 'bg-green-600' : 'bg-red-600'"
                >
                  {{ member.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
                </span>
              </td>
              <td class="p-3">
                {{ member.joinDate }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-5 flex justify-center items-center gap-2.5">
      <button
        :disabled="!pagination.hasPrev"
        class="py-2 px-4 border border-gray-300 rounded bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        @click="prevPage"
      >
        ก่อนหน้า
      </button>

      <div class="flex gap-1.5">
        <button
          v-for="page in pagination.totalPages"
          :key="page"
          class="py-2 px-3 border border-gray-300 rounded cursor-pointer transition-colors"
          :class="currentPage === page ? 'bg-green-600 text-white font-bold' : 'bg-white text-gray-800 hover:bg-gray-50'"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        :disabled="!pagination.hasNext"
        class="py-2 px-4 border border-gray-300 rounded bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        @click="nextPage"
      >
        ถัดไป
      </button>
    </div>

    <div class="mt-2.5 text-center text-gray-600">
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
