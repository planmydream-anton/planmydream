<script setup lang="ts">
interface Option {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  items: Option[]
  modelValue: string | string[]
  placeholder?: string
  multiple?: boolean
}>(), {
  placeholder: 'Поиск...',
  multiple: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const search = ref('')
const isOpen = ref(false)
const inputRef = ref<HTMLInputElement>()

const filteredItems = computed(() => {
  if (!search.value) return props.items
  const q = search.value.toLowerCase()
  return props.items.filter(item =>
    item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q),
  )
})

const selectedLabels = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue
      .map(v => props.items.find(i => i.value === v)?.label || v)
  }
  if (!props.multiple && typeof props.modelValue === 'string' && props.modelValue) {
    return [props.items.find(i => i.value === props.modelValue)?.label || props.modelValue]
  }
  return []
})

function selectItem(item: Option) {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = current.indexOf(item.value)
    if (idx >= 0) {
      current.splice(idx, 1)
    }
    else {
      current.push(item.value)
    }
    emit('update:modelValue', current)
  }
  else {
    emit('update:modelValue', item.value)
    isOpen.value = false
    search.value = ''
  }
}

function removeItem(value: string) {
  if (props.multiple && Array.isArray(props.modelValue)) {
    emit('update:modelValue', props.modelValue.filter(v => v !== value))
  }
  else {
    emit('update:modelValue', '')
  }
}

function isSelected(value: string) {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(value)
  }
  return props.modelValue === value
}

function onFocus() {
  isOpen.value = true
}

function onBlur() {
  setTimeout(() => {
    isOpen.value = false
  }, 200)
}
</script>

<template>
  <div class="relative">
    <!-- Selected tags (multiple mode) -->
    <div v-if="multiple && selectedLabels.length" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="(label, idx) in selectedLabels"
        :key="idx"
        class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 text-sm rounded-md dark:bg-primary-900 dark:text-primary-300"
      >
        {{ label }}
        <button
          type="button"
          class="hover:text-red-500"
          @click="removeItem(Array.isArray(modelValue) ? modelValue[idx] : modelValue)"
        >
          <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
        </button>
      </span>
    </div>

    <!-- Search input -->
    <UInput
      ref="inputRef"
      v-model="search"
      :placeholder="!multiple && selectedLabels.length ? selectedLabels[0] : placeholder"
      icon="i-heroicons-magnifying-glass"
      @focus="onFocus"
      @blur="onBlur"
    />

    <!-- Dropdown -->
    <div
      v-if="isOpen && filteredItems.length"
      class="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        v-for="item in filteredItems"
        :key="item.value"
        type="button"
        class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{ 'bg-primary-50 dark:bg-primary-900/30': isSelected(item.value) }"
        @mousedown.prevent="selectItem(item)"
      >
        <UIcon
          v-if="multiple"
          :name="isSelected(item.value) ? 'i-heroicons-check-circle-solid' : 'i-heroicons-stop'"
          class="w-4 h-4 shrink-0"
          :class="isSelected(item.value) ? 'text-primary-500' : 'text-gray-300'"
        />
        <span>{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>
