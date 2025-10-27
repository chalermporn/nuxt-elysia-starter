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
  <div class="container mx-auto p-5">
    <h1 class="text-3xl font-bold mb-5">
      รายชื่อสมาชิก
    </h1>

    <!-- Search Bar -->
    <div class="flex gap-2 mb-5">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาสมาชิก (ชื่อ, อีเมล, เมือง)..."
        class="input input-bordered w-full max-w-xs"
        @keyup.enter="handleSearch"
      >
      <button
        class="btn btn-success"
        @click="handleSearch"
      >
        ค้นหา
      </button>
      <button
        v-if="searchQuery"
        class="btn btn-neutral"
        @click="searchQuery = ''; handleSearch()"
      >
        ล้างการค้นหา
      </button>
    </div>

    <!-- Summary -->
    <div class="mb-4 text-sm opacity-70">
      แสดง {{ (pagination.page - 1) * pagination.limit + 1 }} - {{ Math.min(pagination.page * pagination.limit, pagination.total) }} จาก {{ pagination.total }} รายการ
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table class="table table-zebra table-pin-rows table-pin-cols whitespace-nowrap">
        <thead>
          <tr>
            <th class="w-16">
              ID
            </th>
            <td class="min-w-32">
              ชื่อ
            </td>
            <td class="min-w-32">
              นามสกุล
            </td>
            <td class="min-w-48">
              อีเมล
            </td>
            <td class="min-w-32">
              เบอร์โทร
            </td>
            <td class="w-20">
              อายุ
            </td>
            <td class="min-w-32">
              เมือง
            </td>
            <td class="w-24">
              สถานะ
            </td>
            <td class="min-w-32">
              วันที่สมัคร
            </td>
          </tr>
        </thead>
        <tbody>
          <!-- Skeleton Loading -->
          <template v-if="isLoading">
            <tr v-for="i in 10" :key="`skeleton-${i}`">
              <td v-for="col in 9" :key="`skeleton-${i}-${col}`" class="whitespace-nowrap">
                <div class="skeleton h-4 w-20" />
              </td>
            </tr>
          </template>

          <!-- Actual Data -->
          <template v-else>
            <tr
              v-for="member in members"
              :key="member.id"
              class="hover"
            >
              <th class="whitespace-nowrap">
                {{ member.id }}
              </th>
              <td class="whitespace-nowrap">
                {{ member.firstName }}
              </td>
              <td class="whitespace-nowrap">
                {{ member.lastName }}
              </td>
              <td class="whitespace-nowrap">
                {{ member.email }}
              </td>
              <td class="whitespace-nowrap">
                {{ member.phone }}
              </td>
              <td class="whitespace-nowrap">
                {{ member.age }}
              </td>
              <td class="whitespace-nowrap">
                {{ member.city }}
              </td>
              <td class="whitespace-nowrap">
                <span
                  class="badge"
                  :class="member.status === 'active' ? 'badge-success' : 'badge-error'"
                >
                  {{ member.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
                </span>
              </td>
              <td class="whitespace-nowrap">
                {{ new Date(member.joinDate).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-5">
      <div class="join">
        <button
          class="join-item btn"
          :disabled="!pagination.hasPrev"
          @click="prevPage"
        >
          «
        </button>
        <button
          v-for="page in pagination.totalPages"
          :key="page"
          class="join-item btn"
          :class="{ 'btn-active': currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="join-item btn"
          :disabled="!pagination.hasNext"
          @click="nextPage"
        >
          »
        </button>
      </div>
    </div>

    <div class="mt-2 text-center text-sm opacity-70">
      หน้า {{ pagination.page }} จาก {{ pagination.totalPages }}
    </div>
  </div>
</template>
