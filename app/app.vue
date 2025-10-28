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
const itemsPerPage = ref(10)
const sortBy = ref<keyof Member | ''>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
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

// Define table columns
const columns = [
  { key: 'id' as keyof Member, label: 'ID', width: 'w-16', pin: true },
  { key: 'firstName' as keyof Member, label: 'ชื่อ', width: 'min-w-32' },
  { key: 'lastName' as keyof Member, label: 'นามสกุล', width: 'min-w-32' },
  { key: 'email' as keyof Member, label: 'อีเมล', width: 'min-w-48' },
  { key: 'phone' as keyof Member, label: 'เบอร์โทร', width: 'min-w-32' },
  { key: 'age' as keyof Member, label: 'อายุ', width: 'w-20' },
  { key: 'city' as keyof Member, label: 'เมือง', width: 'min-w-32' },
  {
    key: 'status' as keyof Member,
    label: 'สถานะ',
    width: 'w-24',

    format: (value: any) => {
      return h('span', {
        class: ['badge', value === 'active' ? 'badge-success' : 'badge-error'],
      }, value === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน')
    },
  },
  {
    key: 'joinDate' as keyof Member,
    label: 'วันที่สมัคร',
    width: 'min-w-32',
    pin: true,
    format: (value: any) => new Date(value).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  },
]

async function fetchMembers() {
  isLoading.value = true

  try {
    const queryParams: any = {
      page: currentPage.value.toString(),
      limit: itemsPerPage.value.toString(),
      search: searchQuery.value,
    }

    if (sortBy.value) {
      queryParams.sortBy = sortBy.value
      queryParams.sortOrder = sortOrder.value
    }

    const { data, error } = await $api.members.get({
      query: queryParams,
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

function handleSort(column: keyof Member) {
  if (sortBy.value === column) {
    // Toggle sort order if same column
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  else {
    // Set new column with ascending order
    sortBy.value = column
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
  fetchMembers()
}

function handleItemsPerPageChange() {
  currentPage.value = 1
  fetchMembers()
}

// Initial fetch
onMounted(() => {
  fetchMembers()
})
</script>

<template>
  <main class="container mx-auto p-5">
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

    <!-- Summary and Items Per Page -->
    <div class="mb-4 flex items-center justify-between">
      <div class="text-sm opacity-70">
        แสดง {{ (pagination.page - 1) * pagination.limit + 1 }} - {{ Math.min(pagination.page * pagination.limit, pagination.total) }} จาก {{ pagination.total }} รายการ
      </div>
      <div class="flex items-center gap-2">
        <label for="items-per-page" class="text-sm opacity-70">แสดงผลต่อหน้า:</label>
        <select
          id="items-per-page"
          v-model="itemsPerPage"
          class="select select-bordered select-sm w-20"
          @change="handleItemsPerPageChange"
        >
          <option :value="10">
            10
          </option>
          <option :value="25">
            25
          </option>
          <option :value="50">
            50
          </option>
          <option :value="100">
            100
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <Table
      :members="members"
      :columns="columns"
      :is-loading="isLoading"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @sort="handleSort"
    />

    <!-- Pagination -->
    <Pagination
      :pagination="pagination"
      :current-page="currentPage"
      @prev="prevPage"
      @next="nextPage"
      @go-to-page="goToPage"
    />
  </main>
</template>
