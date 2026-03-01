import { auditLog } from '@planmydream/database/schema'

interface AuditParams {
  entityType: string
  entityId: string
  action: 'create' | 'update' | 'delete' | 'publish'
  changes?: Record<string, { old: unknown; new: unknown }>
  userId: string
}

export async function logAudit(params: AuditParams) {
  try {
    const db = useDB()
    await db.insert(auditLog).values({
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      changes: params.changes || null,
      userId: params.userId,
    })
  } catch (error) {
    // Не блокируем основной запрос если аудит упал
    console.error('Audit log error:', error)
  }
}
