<script setup lang="ts">
interface Member {
  id?: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  city: string
  status: 'active' | 'inactive'
}

interface Props {
  member?: Member | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [member: Omit<Member, 'id'>]
}>()

// Form state
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: 18,
  city: '',
  status: 'active' as 'active' | 'inactive',
})

// Validation errors
const errors = ref<Record<string, string>>({})

// Watch for member prop changes (for edit mode)
watch(() => props.member, (newMember) => {
  if (newMember) {
    formData.value = {
      firstName: newMember.firstName,
      lastName: newMember.lastName,
      email: newMember.email,
      phone: newMember.phone,
      age: newMember.age,
      city: newMember.city,
      status: newMember.status,
    }
  }
  else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: 18,
    city: '',
    status: 'active',
  }
  errors.value = {}
}

function validateForm(): boolean {
  errors.value = {}

  if (!formData.value.firstName.trim()) {
    errors.value.firstName = 'กรุณากรอกชื่อ'
  }

  if (!formData.value.lastName.trim()) {
    errors.value.lastName = 'กรุณากรอกนามสกุล'
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'กรุณากรอกอีเมล'
  }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'รูปแบบอีเมลไม่ถูกต้อง'
  }

  if (!formData.value.phone.trim()) {
    errors.value.phone = 'กรุณากรอกเบอร์โทร'
  }
  else if (!/^[0-9-]+$/.test(formData.value.phone)) {
    errors.value.phone = 'รูปแบบเบอร์โทรไม่ถูกต้อง'
  }

  if (!formData.value.age || formData.value.age < 1 || formData.value.age > 150) {
    errors.value.age = 'กรุณากรอกอายุที่ถูกต้อง (1-150)'
  }

  if (!formData.value.city.trim()) {
    errors.value.city = 'กรุณากรอกเมือง'
  }

  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validateForm()) {
    emit('submit', { ...formData.value })
  }
}

defineExpose({
  resetForm,
  handleSubmit,
})
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- First Name -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">ชื่อ <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formData.firstName"
          type="text"
          placeholder="กรอกชื่อ"
          class="input input-bordered"
          :class="{ 'input-error': errors.firstName }"
        >
        <label v-if="errors.firstName" class="label">
          <span class="label-text-alt text-error">{{ errors.firstName }}</span>
        </label>
      </div>

      <!-- Last Name -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">นามสกุล <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formData.lastName"
          type="text"
          placeholder="กรอกนามสกุล"
          class="input input-bordered"
          :class="{ 'input-error': errors.lastName }"
        >
        <label v-if="errors.lastName" class="label">
          <span class="label-text-alt text-error">{{ errors.lastName }}</span>
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Email -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">อีเมล <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formData.email"
          type="email"
          placeholder="example@email.com"
          class="input input-bordered"
          :class="{ 'input-error': errors.email }"
        >
        <label v-if="errors.email" class="label">
          <span class="label-text-alt text-error">{{ errors.email }}</span>
        </label>
      </div>

      <!-- Phone -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">เบอร์โทร <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formData.phone"
          type="tel"
          placeholder="081-234-5678"
          class="input input-bordered"
          :class="{ 'input-error': errors.phone }"
        >
        <label v-if="errors.phone" class="label">
          <span class="label-text-alt text-error">{{ errors.phone }}</span>
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Age -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">อายุ <span class="text-error">*</span></span>
        </label>
        <input
          v-model.number="formData.age"
          type="number"
          min="1"
          max="150"
          placeholder="25"
          class="input input-bordered"
          :class="{ 'input-error': errors.age }"
        >
        <label v-if="errors.age" class="label">
          <span class="label-text-alt text-error">{{ errors.age }}</span>
        </label>
      </div>

      <!-- City -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">เมือง <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formData.city"
          type="text"
          placeholder="กรุงเทพ"
          class="input input-bordered"
          :class="{ 'input-error': errors.city }"
        >
        <label v-if="errors.city" class="label">
          <span class="label-text-alt text-error">{{ errors.city }}</span>
        </label>
      </div>

      <!-- Status -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">สถานะ <span class="text-error">*</span></span>
        </label>
        <select
          v-model="formData.status"
          class="select select-bordered"
        >
          <option value="active">
            ใช้งาน
          </option>
          <option value="inactive">
            ไม่ใช้งาน
          </option>
        </select>
      </div>
    </div>
  </form>
</template>
