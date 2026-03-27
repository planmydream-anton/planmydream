<template>
  <UBadge :color="statusColor" variant="soft" size="sm">
    {{ statusLabel }}
  </UBadge>
</template>

<script setup lang="ts">
const props = defineProps<{ status: string }>()

const statusMap: Record<string, { label: string; color: string }> = {
  draft: { label: 'Черновик', color: 'neutral' },
  pending_review: { label: 'На модерации', color: 'amber' },
  published: { label: 'Опубликован', color: 'emerald' },
  rejected: { label: 'Отклонён', color: 'red' },
  archived: { label: 'В архиве', color: 'neutral' },
}

const statusLabel = computed(() => statusMap[props.status]?.label || props.status)
const statusColor = computed(() => (statusMap[props.status]?.color || 'neutral') as any)
</script>
