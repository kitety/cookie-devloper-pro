<script setup lang="ts">
import { SAME_SITES } from '@/constants/index'
import { deleteCookie, getAllCookies, saveCookie } from '@/utils/cookies'
import { generateCookieKey } from '@/utils/generateKey'
import { getCurrentUrl } from '@/utils/getCurrentUrl'
import {
  decorateCookieName,
  isNameDecorated,
  getRealName,
} from '@/utils/decorateCookieName'
import getDomain from '@/utils/getDomain'

let allCookies: chrome.cookies.Cookie[] = []

const activeName = ref('first')
const transferDomain = ref('localhost')
const activeCollapse = ref('1')

const search = reactive({
  domain: '',
  name: '',
})
const filterCookies = reactive<{
  data: Array<chrome.cookies.Cookie & { key: string; checked: boolean }>
  selected: string[]
  selectedAll: boolean
}>({
  data: [],
  selected: [],
  selectedAll: false,
})
const fetchCookies = async () => {
  const data = await getAllCookies()
  allCookies = data
}
const reloadData = () => {
  const domain = getDomain(search.domain)
  console.log('domain', domain)
  const nameValue = String(search.name).toLowerCase()
  const domainValue = String(domain).toLowerCase()
  const data = allCookies.filter((item) => {
    const domainRight = String(item.domain).toLowerCase().includes(domainValue)
    const nameRight = String(item.name).toLowerCase().includes(nameValue)
    return domainRight && nameRight
  })
  console.log('data', data)
  filterCookies.data = data.map((cookie) => {
    const key = generateCookieKey(cookie)
    return {
      ...cookie,
      key,
      checked: false,
    }
  })
  filterCookies.selected = []
  activeCollapse.value = ''
}

onMounted(async () => {
  await fetchCookies()
  setTimeout(async () => {
    const url = await getCurrentUrl()
    search.domain = url
  }, 200)
})

watchDebounced(
  search,
  () => {
    reloadData()
  },
  { debounce: 100 }
)
watch([() => filterCookies.selectedAll], () => {
  filterCookies.data.forEach((item) => {
    item.checked = filterCookies.selectedAll
  })
})
watchEffect(() => {
  console.log('filterCookies.data', filterCookies.data)
})

const handleClick = () => {
  console.log(111)
}

const saveData = async (data: chrome.cookies.Cookie) => {
  console.log('进入data', data)
  await deleteCookie(data)
  await saveCookie(data)
  ElMessage({
    message: 'success',
    type: 'success',
  })
}
const reloadAllData = async () => {
  await fetchCookies()
  reloadData()
}
const deleteData = async (data: chrome.cookies.Cookie) => {
  const originCookie = { ...data }
  if (originCookie) {
    await deleteCookie(data)
    ElMessage({
      message: 'success',
      type: 'success',
    })
    reloadAllData()
  }
}

const handleTransferData = async () => {
  const domain = getDomain(transferDomain.value)
  const data = filterCookies.data.filter((item) => item.checked)
  const saveDataPromise = data.map((item) => {
    const cookie = {
      ...item,
      domain,
    }
    return saveCookie(cookie)
  })
  await Promise.all(saveDataPromise)
  ElMessage({
    message: 'success',
    type: 'success',
  })
  reloadAllData()
}
const handleBatchDeleteData = async () => {
  const data = filterCookies.data.filter((item) => item.checked)
  const saveDataPromise = data.map((item) => {
    return deleteCookie(item)
  })
  await Promise.all(saveDataPromise)
  ElMessage({
    message: 'success',
    type: 'success',
  })
  reloadAllData()
}
const handleExpireData = async () => {
  const data = filterCookies.data.filter((item) => {
    const { name, checked } = item
    const nameNotDecorated = !isNameDecorated(name)
    return checked && nameNotDecorated
  })
  const saveDataPromise = data.map((item) => {
    const name = decorateCookieName(item.name)
    const cookie = {
      ...item,
      name,
    }
    return saveCookie(cookie)
  })
  await Promise.all(saveDataPromise)
  ElMessage({
    message: 'success',
    type: 'success',
  })
  reloadAllData()
}
const handleRecoverData = async () => {
  const data = filterCookies.data.filter((item) => {
    const { name, checked } = item
    const nameNotDecorated = isNameDecorated(name)
    return checked && nameNotDecorated
  })
  const saveDataPromise = data.map((item) => {
    const name = getRealName(item.name)
    const cookie = {
      ...item,
      name,
    }
    return saveCookie(cookie)
  })
  await Promise.all(saveDataPromise)
  ElMessage({
    message: 'success',
    type: 'success',
  })
  reloadAllData()
}
</script>

<template>
  <h1>Cookie Developer Pro</h1>
  {{ filterCookies.data.length }}
  <el-form
    :inline="true"
    :model="search"
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
      <el-collapse accordion>
        <el-collapse-item
          v-for="data in filterCookies.data"
          :key="data.storeId"
          :title="data.name"
        >
          <div>
            <div>Value</div>
            <div><el-input v-model="data.value"></el-input></div>
            <div>Domain</div>
            <div><el-input v-model="data.domain"></el-input></div>
            <div>Path</div>
            <div><el-input v-model="data.path"></el-input></div>
            <div v-if="data.expirationDate">
              <div>expirationDate</div>
              <div>
                <el-date-picker
                  v-model="data.expirationDate"
                  editable
                  type="datetime"
                  size="small"
                  format="YYYY/MM/DD hh:mm:ss"
                  value-format="X"
                />
              </div>
            </div>
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
                disabled
                label="hostOnly"
                size="small"
              />
              <el-checkbox
                v-model="data.session"
                disabled
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
            <el-button
              type="danger"
              @click="deleteData(data)"
              >删除</el-button
            >
          </div>
        </el-collapse-item>
      </el-collapse></el-tab-pane
    >
    <el-tab-pane
      label="转移"
      name="second"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-checkbox
            v-model="filterCookies.selectedAll"
            label="全部选择"
            size="large" />
          <el-input
            v-model="transferDomain"
            placeholder="Domain"
        /></el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            @click="handleTransferData"
            >转移</el-button
          ></el-col
        >
      </el-row>

      <el-collapse accordion>
        <el-collapse-item
          v-for="data in filterCookies.data"
          :key="data.key"
          :title="data.name"
        >
          <template #title>
            {{ data.name }}
            <el-checkbox
              v-model="data.checked"
              size="large"
              @click.stop
            />
          </template>
          <div>
            <div>Value</div>
            <div>
              <el-input
                v-model="data.value"
                disabled
              ></el-input>
            </div>
            <div>Domain</div>
            <div>
              <el-input
                v-model="data.domain"
                disabled
              ></el-input>
            </div>
            <div>Path</div>
            <div>
              <el-input
                v-model="data.path"
                disabled
              ></el-input>
            </div>
            <div v-if="data.expirationDate">
              <div>expirationDate</div>
              <div>
                <el-date-picker
                  v-model="data.expirationDate"
                  disabled
                  editable
                  type="datetime"
                  size="small"
                  format="YYYY/MM/DD hh:mm:ss"
                  value-format="X"
                />
              </div>
            </div>
            <div>SameSite</div>
            <div>
              <el-select
                v-model="data.sameSite"
                disabled
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
                disabled
                label="hostOnly"
                size="small"
              />
              <el-checkbox
                v-model="data.session"
                disabled
                label="session"
                size="small"
              />
              <el-checkbox
                v-model="data.secure"
                disabled
                label="安全"
                size="small"
              />
              <el-checkbox
                v-model="data.httpOnly"
                disabled
                label="httpOnly"
                size="small"
              />
            </div>
            <!-- <el-button
              type="primary"
              @click="saveData(data)"
              >保存</el-button
            >
            <el-button
              type="danger"
              @click="deleteData(data)"
              >删除</el-button
            > -->
          </div>
        </el-collapse-item>
      </el-collapse></el-tab-pane
    >
    <el-tab-pane
      label="过期"
      name="third"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-checkbox
            v-model="filterCookies.selectedAll"
            label="全部选择"
            size="large"
          />
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            @click="handleBatchDeleteData"
            >删除</el-button
          ><el-button
            type="primary"
            @click="handleExpireData"
            >过期</el-button
          ></el-col
        >
      </el-row>

      <el-collapse accordion>
        <el-collapse-item
          v-for="data in filterCookies.data"
          :key="data.key"
          :title="data.name"
        >
          <template #title>
            {{ data.name }}
            <el-checkbox
              v-model="data.checked"
              size="large"
              @click.stop
            />
          </template>
          <div>
            <div>Value</div>
            <div>
              <el-input
                v-model="data.value"
                disabled
              ></el-input>
            </div>
            <div>Domain</div>
            <div>
              <el-input
                v-model="data.domain"
                disabled
              ></el-input>
            </div>
            <div>Path</div>
            <div>
              <el-input
                v-model="data.path"
                disabled
              ></el-input>
            </div>
            <div v-if="data.expirationDate">
              <div>expirationDate</div>
              <div>
                <el-date-picker
                  v-model="data.expirationDate"
                  disabled
                  editable
                  type="datetime"
                  size="small"
                  format="YYYY/MM/DD hh:mm:ss"
                  value-format="X"
                />
              </div>
            </div>
            <div>SameSite</div>
            <div>
              <el-select
                v-model="data.sameSite"
                disabled
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
                disabled
                label="hostOnly"
                size="small"
              />
              <el-checkbox
                v-model="data.session"
                disabled
                label="session"
                size="small"
              />
              <el-checkbox
                v-model="data.secure"
                disabled
                label="安全"
                size="small"
              />
              <el-checkbox
                v-model="data.httpOnly"
                disabled
                label="httpOnly"
                size="small"
              />
            </div>
            <!-- <el-button
              type="primary"
              @click="saveData(data)"
              >保存</el-button
            >
            <el-button
              type="danger"
              @click="deleteData(data)"
              >删除</el-button
            > -->
          </div>
        </el-collapse-item>
      </el-collapse></el-tab-pane
    >
    <el-tab-pane
      label="恢复"
      name="fourth"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-checkbox
            v-model="filterCookies.selectedAll"
            label="全部选择"
            size="large"
          />
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            @click="handleRecoverData"
            >恢复</el-button
          ></el-col
        >
      </el-row>

      <el-collapse accordion>
        <el-collapse-item
          v-for="data in filterCookies.data"
          :key="data.key"
          :title="data.name"
        >
          <template #title>
            {{ data.name }}
            <el-checkbox
              v-model="data.checked"
              size="large"
              @click.stop
            />
          </template>
          <div>
            <div>Value</div>
            <div>
              <el-input
                v-model="data.value"
                disabled
              ></el-input>
            </div>
            <div>Domain</div>
            <div>
              <el-input
                v-model="data.domain"
                disabled
              ></el-input>
            </div>
            <div>Path</div>
            <div>
              <el-input
                v-model="data.path"
                disabled
              ></el-input>
            </div>
            <div v-if="data.expirationDate">
              <div>expirationDate</div>
              <div>
                <el-date-picker
                  v-model="data.expirationDate"
                  disabled
                  editable
                  type="datetime"
                  size="small"
                  format="YYYY/MM/DD hh:mm:ss"
                  value-format="X"
                />
              </div>
            </div>
            <div>SameSite</div>
            <div>
              <el-select
                v-model="data.sameSite"
                disabled
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
                disabled
                label="hostOnly"
                size="small"
              />
              <el-checkbox
                v-model="data.session"
                disabled
                label="session"
                size="small"
              />
              <el-checkbox
                v-model="data.secure"
                disabled
                label="安全"
                size="small"
              />
              <el-checkbox
                v-model="data.httpOnly"
                disabled
                label="httpOnly"
                size="small"
              />
            </div>
            <!-- <el-button
              type="primary"
              @click="saveData(data)"
              >保存</el-button
            >
            <el-button
              type="danger"
              @click="deleteData(data)"
              >删除</el-button
            > -->
          </div>
        </el-collapse-item>
      </el-collapse></el-tab-pane
    >
  </el-tabs>
</template>

<style scoped></style>
