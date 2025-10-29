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
const toast = useToast()

// Table state
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

// Modal state
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const selectedMember = ref<Member | null>(null)
const isSubmitting = ref(false)
const memberFormRef = ref()

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
    format: (value: any) => new Date(value).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  },
  {
    key: 'actions' as any,
    label: 'จัดการ',
    width: 'w-32',
    pin: true,
    format: (_: any, member: Member) => {
      return h('div', { class: 'flex gap-1' }, [
        h('button', {
          class: 'btn btn-sm btn-ghost btn-square',
          title: 'แก้ไข',
          onClick: (e: Event) => {
            e.stopPropagation()
            openEditModal(member)
          },
        }, [
          h('svg', {
            class: 'w-4 h-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
          }, [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '2',
              'd': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
            }),
          ]),
        ]),
        h('button', {
          class: 'btn btn-sm btn-ghost btn-square text-error',
          title: 'ลบ',
          onClick: (e: Event) => {
            e.stopPropagation()
            openDeleteDialog(member)
          },
        }, [
          h('svg', {
            class: 'w-4 h-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
          }, [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '2',
              'd': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
            }),
          ]),
        ]),
      ])
    },
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
      toast.error('ไม่สามารถโหลดข้อมูลสมาชิกได้')
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
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  else {
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

// CRUD operations
function openCreateModal() {
  selectedMember.value = null
  isCreateModalOpen.value = true
}

function openEditModal(member: Member) {
  selectedMember.value = member
  isEditModalOpen.value = true
}

function openDeleteDialog(member: Member) {
  selectedMember.value = member
  isDeleteDialogOpen.value = true
}

async function handleCreateMember(memberData: Omit<Member, 'id'>) {
  isSubmitting.value = true

  try {
    const { data, error } = await $api.members.post(memberData)

    if (error) {
      const errorData = error as any
      if (errorData.value?.error?.includes('Email already exists')) {
        toast.error('อีเมลนี้มีอยู่ในระบบแล้ว')
      }
      else {
        toast.error('ไม่สามารถสร้างสมาชิกได้')
      }
      return
    }

    toast.success('เพิ่มสมาชิกสำเร็จ')
    isCreateModalOpen.value = false
    await fetchMembers()
  }
  finally {
    isSubmitting.value = false
  }
}

async function handleUpdateMember(memberData: Omit<Member, 'id'>) {
  if (!selectedMember.value)
    return

  isSubmitting.value = true

  try {
    const { data, error } = await $api.members({ id: selectedMember.value.id.toString() }).patch(memberData)

    if (error) {
      const errorData = error as any
      if (errorData.value?.error?.includes('Email already exists')) {
        toast.error('อีเมลนี้มีอยู่ในระบบแล้ว')
      }
      else {
        toast.error('ไม่สามารถแก้ไขสมาชิกได้')
      }
      return
    }

    toast.success('แก้ไขสมาชิกสำเร็จ')
    isEditModalOpen.value = false
    await fetchMembers()
  }
  finally {
    isSubmitting.value = false
  }
}

async function handleDeleteMember() {
  if (!selectedMember.value)
    return

  isSubmitting.value = true

  try {
    const { data, error } = await $api.members({ id: selectedMember.value.id.toString() }).delete()

    if (error) {
      toast.error('ไม่สามารถลบสมาชิกได้')
      return
    }

    toast.success('ลบสมาชิกสำเร็จ')
    isDeleteDialogOpen.value = false
    await fetchMembers()
  }
  finally {
    isSubmitting.value = false
  }
}

// Keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  // Cmd/Ctrl + K for search focus
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
    searchInput?.focus()
  }

  // Cmd/Ctrl + N for new member
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
    e.preventDefault()
    openCreateModal()
  }

  // ESC to close modals
  if (e.key === 'Escape') {
    isCreateModalOpen.value = false
    isEditModalOpen.value = false
    isDeleteDialogOpen.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchMembers()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="container mx-auto p-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 animate-fade-in">
      <div>
        <h1 class="text-3xl font-bold">
          รายชื่อสมาชิก
        </h1>
        <p class="text-sm opacity-70 mt-1">
          จัดการข้อมูลสมาชิกทั้งหมด
        </p>
      </div>
      <div class="flex gap-2">
        <div class="tooltip tooltip-left" data-tip="Cmd/Ctrl + N">
          <button
            class="btn btn-primary gap-2"
            @click="openCreateModal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            เพิ่มสมาชิก
          </button>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="flex gap-2 mb-5 animate-fade-in">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาสมาชิก (ชื่อ, อีเมล, เมือง)..."
          class="input input-bordered w-full pr-20"
          @keyup.enter="handleSearch"
        >
        <kbd class="kbd kbd-sm absolute right-3 top-1/2 -translate-y-1/2 opacity-50">⌘K</kbd>
      </div>
      <button
        class="btn btn-success"
        @click="handleSearch"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        ค้นหา
      </button>
      <button
        v-if="searchQuery"
        class="btn btn-neutral"
        @click="searchQuery = ''; handleSearch()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        ล้าง
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

    <!-- Empty State -->
    <EmptyState
      v-if="!isLoading && members.length === 0 && !searchQuery"
      title="ยังไม่มีสมาชิก"
      message="เริ่มต้นสร้างระบบสมาชิกของคุณโดยการเพิ่มสมาชิกใหม่"
      icon="users"
      action-text="เพิ่มสมาชิกแรก"
      @action="openCreateModal"
    />

    <!-- Search Empty State -->
    <EmptyState
      v-else-if="!isLoading && members.length === 0 && searchQuery"
      title="ไม่พบผลลัพธ์"
      :message="`ไม่พบสมาชิกที่ตรงกับคำค้นหา &quot;${searchQuery}&quot;`"
      icon="search"
    />

    <!-- Table -->
    <div v-else class="animate-fade-in">
      <Table
        :members="members"
        :columns="columns"
        :is-loading="isLoading"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        :sticky="false"
        @sort="handleSort"
      />
    </div>

    <!-- Pagination -->
    <Pagination
      :pagination="pagination"
      :current-page="currentPage"
      @prev="prevPage"
      @next="nextPage"
      @go-to-page="goToPage"
    />

    <!-- Create Modal -->
    <Modal
      :open="isCreateModalOpen"
      title="เพิ่มสมาชิกใหม่"
      :loading="isSubmitting"
      @close="isCreateModalOpen = false"
      @submit="memberFormRef?.handleSubmit()"
    >
      <MemberForm
        ref="memberFormRef"
        @submit="handleCreateMember"
      />
    </Modal>

    <!-- Edit Modal -->
    <Modal
      :open="isEditModalOpen"
      title="แก้ไขข้อมูลสมาชิก"
      :loading="isSubmitting"
      @close="isEditModalOpen = false"
      @submit="memberFormRef?.handleSubmit()"
    >
      <MemberForm
        ref="memberFormRef"
        :member="selectedMember"
        @submit="handleUpdateMember"
      />
    </Modal>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :open="isDeleteDialogOpen"
      title="ยืนยันการลบสมาชิก"
      :message="`คุณต้องการลบสมาชิก ${selectedMember?.firstName} ${selectedMember?.lastName} ใช่หรือไม่?`"
      confirm-text="ลบ"
      cancel-text="ยกเลิก"
      type="error"
      :loading="isSubmitting"
      @confirm="handleDeleteMember"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>
