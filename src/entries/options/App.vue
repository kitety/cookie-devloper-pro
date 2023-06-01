<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import { SAME_SITES } from '@/constants/index'
import getAllCookies from '@/utils/getAllCookies'
import getDomain from '@/utils/getDomain'

let allCookies: chrome.cookies.Cookie[] = []

const activeName = ref('first')
const activeCollapse = ref('1')

const search = reactive({
  domain: '',
  name: '',
})
const filterCookies = reactive<{ data: chrome.cookies.Cookie[] }>({
  data: [],
})
const fetchCookies = async () => {
  const data = await getAllCookies()
  allCookies = data
}

onMounted(async () => {
  await fetchCookies()
  setTimeout(() => {
    search.domain = 'https://github.com/antfu/unplugin-auto-import'
  }, 300)
})
const domain = computed(() => getDomain(search.domain))
console.log('domain', domain.value)

watchEffect(() => {
  const domain = getDomain(search.domain)
  const data = allCookies.filter((item) => {
    const domainRight = item.domain.includes(domain)
    let nameRight = search.name ? item.name.includes(search.name) : true
    return domainRight && nameRight
  })
  console.log('data', data)
  filterCookies.data = data
  activeCollapse.value = ''
})
watchEffect(() => {
  console.log('filterCookies.data', filterCookies.data)
})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const saveData = (data: chrome.cookies.Cookie) => {
  console.log('进入data', data)
}
</script>

<template>
  <h1>Cookie Developer Pro</h1>
  {{ filterCookies.data.length }}
  <el-form
    :inline="true"
    :model="true"
    class="demo-form-inline"
    size="small"
  >
    <el-form-item label="Domain">
      <el-input
        v-model="search.domain"
        placeholder="Domain"
      />
    </el-form-item>
    <el-form-item label="Name">
      <el-input
        v-model="search.name"
        placeholder="Name"
        clearable
      />
    </el-form-item>
  </el-form>
  <el-tabs
    v-model="activeName"
    type="border-card"
    class="demo-tabs"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="编辑"
      name="first"
    >
      <el-collapse
        v-model="activeCollapse"
        accordion
      >
        <el-collapse-item
          v-for="data in filterCookies.data"
          :key="data.storeId"
          :title="data.name"
          ><div>
            <div>Value</div>
            <div><el-input v-model="data.value"></el-input></div>
            <div>Domain</div>
            <div><el-input v-model="data.domain"></el-input></div>
            <div>Path</div>
            <div><el-input v-model="data.path"></el-input></div>
            <div>expirationDate</div>
            <div><el-input v-model="data.expirationDate"></el-input></div>
            <div>SameSite</div>
            <div>
              <el-select
                v-model="data.sameSite"
                class="m-2"
                placeholder="Select"
                size="small"
              >
                <el-option
                  v-for="item in SAME_SITES"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
            <div>
              <el-checkbox
                v-model="data.hostOnly"
                label="hostOnly"
                size="small"
              />
              <el-checkbox
                v-model="data.session"
                label="session"
                size="small"
              />
              <el-checkbox
                v-model="data.secure"
                label="安全"
                size="small"
              />
              <el-checkbox
                v-model="data.httpOnly"
                label="httpOnly"
                size="small"
              />
            </div>
            <el-button
              type="primary"
              @click="saveData(data)"
              >保存</el-button
            >
          </div></el-collapse-item
        >
      </el-collapse></el-tab-pane
    >
    <el-tab-pane
      label="Config"
      name="second"
      >Config</el-tab-pane
    >
    <el-tab-pane
      label="Role"
      name="third"
      >Role</el-tab-pane
    >
    <el-tab-pane
      label="Task"
      name="fourth"
      >Task</el-tab-pane
    >
  </el-tabs>
  <HelloWorld msg="Vite + Vue + Options" />
</template>

<style scoped></style>
