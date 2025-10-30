<script setup lang="ts">
const currentYear = new Date().getFullYear()

interface SocialLink {
  name: string
  icon: string
  link: string
}

const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    link: '#',
  },
  {
    name: 'Twitter',
    icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
    link: '#',
  },
  {
    name: 'GitHub',
    icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
    link: '#',
  },
]
</script>

<template>
  <footer class="bg-base-200 text-base-content">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        <!-- Company Info -->
        <div class="col-span-1 sm:col-span-2 lg:col-span-1">
          <div class="flex flex-col space-y-3">
            <div class="text-2xl font-bold">
              logo
            </div>
            <p class="font-bold text-lg">
              Member System
            </p>
            <p class="text-sm opacity-70 max-w-xs">
              ระบบจัดการสมาชิกที่ทันสมัย
              มีประสิทธิภาพ และใช้งานง่าย
            </p>
          </div>
        </div>

        <!-- Services -->
        <nav class="flex flex-col space-y-3">
          <h6 class="footer-title text-base font-semibold opacity-90">
            บริการ
          </h6>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">จัดการสมาชิก</a>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">สร้างรายงาน</a>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">วิเคราะห์ข้อมูล</a>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">นำเข้าข้อมูล</a>
        </nav>

        <!-- Company -->
        <nav class="flex flex-col space-y-3">
          <h6 class="footer-title text-base font-semibold opacity-90">
            บริษัท
          </h6>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">เกี่ยวกับเรา</a>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">ติดต่อ</a>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">อาชีพ</a>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">ข่าวสาร</a>
        </nav>

        <!-- Legal -->
        <nav class="flex flex-col space-y-3">
          <h6 class="footer-title text-base font-semibold opacity-90">
            กฎหมาย
          </h6>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">เงื่อนไขการใช้งาน</a>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">นโยบายความเป็นส่วนตัว</a>
          <a class="link link-hover text-sm opacity-70 hover:opacity-100 transition-opacity">นโยบายคุกกี้</a>
        </nav>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-base-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm text-center md:text-left opacity-70">
            © {{ currentYear }} Member System. สงวนลิขสิทธิ์.
          </p>
          <div class="flex items-center gap-2">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.link"
              :aria-label="social.name"
              class="btn btn-ghost btn-circle btn-sm hover:bg-base-300 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="social.icon"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
