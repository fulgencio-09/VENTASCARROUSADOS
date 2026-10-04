# Recuperación controlada DDL 0012–0028

Estado: AUDITORÍA DE RECONSTRUCCIÓN — NO ES DDL EJECUTABLE

Regla: no convertir una especificación histórica incompatible en "final aprobada" por inferencia silenciosa.

## 0012 — users

**Fuente histórica:** users tenía `password_hash`, estados `pending_verification/active/suspended/banned`, MFA y datos de último acceso.

**Fuente actual:** `User.php` usa `password`, `status`, `email`, `email_verified_at`; `AuthService` registra `status=active` y rechaza `inactive`/`suspended`; el modelo conserva UUID y SoftDeletes.

**Decisión de recuperación:**
- CONFIRMADO: id BIGINT UNSIGNED PK, uuid UNIQUE, email UNIQUE, timestamps, deleted_at, email_verified_at.
- CONFIRMADO por código actual: columna `password` en lugar de `password_hash`.
- CONFIRMADO por código actual: status debe soportar `active`, `inactive`, `suspended`.
- NO RECUPERAR: mfa_secret, mfa_enabled_at, last_login_at, last_login_ip, pending_verification, banned; no existe evidencia actual en el modelo/AuthService que los requiera.

## 0013 — profiles

**Fuente histórica:** first_name, last_name, national_id_type, national_id_number, phone, whatsapp_number, city_id, address.

**Fuente actual:** first_name, last_name, document_type, document_number, phone, whatsapp, city_id, address, avatar_media_id.

**Decisión:** conservar estructura base histórica y adaptar únicamente nombres demostrados por el modelo actual: `national_id_type -> document_type`, `national_id_number -> document_number`, `whatsapp_number -> whatsapp`; incorporar `avatar_media_id` porque el modelo actual lo requiere.

**Punto pendiente:** FK de `avatar_media_id` hacia `media_files` requiere resolver dependencia posterior a 0031. No inventar FK dentro de 0013 sin estrategia de orden de migración.

## 0019 — dealers

**Fuente histórica:** legal_name, trade_name, tax_id, phone, email, website_url, city_id, address, verification_status, verified_at, max_inventory_quota, uuid, softDeletes.

**Fuente actual:** legal_name, commercial_name, nit, email, phone, whatsapp, website, logo_media_id, banner_media_id, city_id, address, status, verified_at; uuid + SoftDeletes.

**Decisión:** adaptar nombres demostrados por el modelo: `trade_name -> commercial_name`, `tax_id -> nit`, `website_url -> website`, `verification_status -> status`; agregar whatsapp/logo_media_id/banner_media_id porque el modelo actual los requiere.

**Punto pendiente:** FKs de logo_media_id/banner_media_id a media_files requieren resolver dependencia posterior a 0031.

## 0020 — dealer_users

**Fuente histórica:** dealer_id, user_id, role_in_dealer, is_active.

**Fuente actual:** dealer_id, user_id, role_in_dealer, status.

**Decisión:** sustituir `is_active` por `status`. Los valores exactos del ENUM de status NO se consideran confirmados únicamente por el modelo; no inventar valores hasta encontrar evidencia específica.

## 0023 — dealer_subscriptions

**Fuente actual:** dealer_id, plan_id, status, starts_at, ends_at, cancelled_at; timestamps; sin SoftDeletes; relación BelongsTo Plan y HasMany Payment.

**Decisión:** `plan_id` debe ser BIGINT UNSIGNED porque el DDL final aprobado de `plans` usa BIGINT UNSIGNED. No conservar el antiguo SMALLINT si contradice 0022.

**Estados:** la evidencia documental identifica `active, past_due, cancelled, expired`. Se consideran CONFIRMADOS por la auditoría funcional existente.

## 0024 — user_kyc_documents

**Fuente actual:** user_id, document_type, media_file_id, status, rejection_reason, verified_at, verified_by_user_id; timestamps; sin SoftDeletes.

**Decisión:** no conservar referencias históricas a S3 directo, dealer_id o reviewed_at cuando contradicen el modelo actual. `media_file_id` es la referencia vigente al archivo multimedia privado.

**Estados:** existe evidencia documental para `pending, verified, rejected`; usar esos valores solamente si la recuperación DDL correspondiente no presenta otra versión posterior.

## 0028 — publications

**Fuente actual:** vehicle_id, seller_user_id, dealer_id, plan_id, title, slug, description, price_amount, price_currency, is_negotiable, is_featured, featured_until, status, published_at, paused_at, expires_at, rejection_reason, rejection_internal_notes, views_count, leads_count, favorites_count; UUID; SoftDeletes; active_status_flag generado.

**Decisión:** la recuperación debe partir del modelo actual y no del bloque histórico de publicaciones que utilizaba estados/columnas diferentes.

**Estados físicos confirmados por auditoría:** `pendiente`, `publicado`, `en_pausa`, `vendido`, `rechazado`.

**Vencimiento:** se maneja mediante `expires_at`; no inventar estado `expired`.

**Punto pendiente:** determinar desde la especificación final histórica los CHECK, UNIQUE e índices exactos antes de escribir el SQL ejecutable.

## Resultado

No se escriben todavía los siete SQL como "final aprobada" porque 0013/0019 tienen FKs hacia media_files posterior, 0020 requiere confirmar los valores exactos de status y 0028 requiere recuperar sus restricciones físicas exactas.

La capa de modelos actuales es la referencia de compatibilidad estructural; las restricciones físicas que no están demostradas se mantienen como PENDIENTES.
