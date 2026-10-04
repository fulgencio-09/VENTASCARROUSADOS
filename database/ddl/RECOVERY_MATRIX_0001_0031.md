# Matriz de recuperación DDL 0001–0031

Estado: AUDITORÍA DE RECUPERACIÓN — no se marca como ejecutable hasta resolver contradicciones.

## CONFIRMADO POR ESPECIFICACIÓN DE MIGRACIONES APROBADA

- 0001 departments
- 0002 cities
- 0003 body_types
- 0004 fuel_types
- 0005 transmissions
- 0006 traction_types
- 0007 colors
- 0008 features
- 0009 vehicle_makes
- 0010 vehicle_models
- 0011 vehicle_versions
- 0014 roles
- 0015 permissions
- 0016 model_has_roles
- 0017 model_has_permissions
- 0018 role_has_permissions
- 0021 dealer_branches (versión corregida con softDeletes)
- 0025 vehicles (versión corregida con VARBINARY(512))
- 0026 vehicle_features
- 0027 vehicle_inspections
- 0029 publication_status_history
- 0030 publication_plans_snapshot
- 0031 media_files

## NO CERRADOS COMO DDL FINAL EJECUTABLE

### 0012 users
La especificación de migración aprobada localizada usa `password_hash`, `mfa_secret`, `mfa_enabled_at`, `last_login_at`, `last_login_ip` y estados `pending_verification/active/suspended/banned`.
El modelo/AuthService actualmente aprobado usa `password` y maneja `active/inactive/suspended`. No se debe elegir una versión por inferencia.

### 0013 profiles
La migración localizada usa `national_id_type`, `national_id_number`, `whatsapp_number` y no contiene `avatar_media_id`.
El modelo actual usa `document_type`, `document_number`, `whatsapp` y `avatar_media_id`.

### 0019 dealers
La migración localizada usa `trade_name`, `tax_id`, `website_url`, `verification_status`, `max_inventory_quota`.
El modelo actual usa `commercial_name`, `nit`, `website`, `status`, `logo_media_id`, `banner_media_id`, además de `whatsapp` y `verified_at`.

### 0020 dealer_users
La migración localizada usa `is_active`; el modelo actual usa `status`.

### 0023 dealer_subscriptions
La migración localizada usa `expires_at`, `auto_renew`, `allocated_quota`.
El modelo actual usa `ends_at` y `cancelled_at`.
Además, la migración localizada depende de `plans.id` como SMALLINT, mientras el DDL 0022 actualmente aprobado define `plans.id` como BIGINT UNSIGNED.

### 0024 user_kyc_documents
La migración localizada guarda S3 directamente (`s3_bucket`, `s3_key`, metadata), tiene `dealer_id` y `reviewed_at`.
El modelo actual usa `media_file_id`, `verified_at`, `verified_by_user_id` y no contiene `dealer_id`.

### 0028 publications
La especificación localizada depende de `plans.id` SMALLINT y contiene estados históricos adicionales (`borrador`, `pendiente_pago`, `pago_aprobado`, `pendiente_aprobacion`, `suspendido`, `expirado`, `cancelado`).
La capa DDL/modelo posterior de Publications ya fue auditada con estados distintos. No se debe reintroducir la versión histórica sin cierre explícito.

## CONCLUSIÓN

No existe todavía una única fuente documental que permita afirmar que 0001–0031 forman un conjunto DDL final, coherente y ejecutable contra el DDL 0022 actualmente aprobado.

Por regla de no invención, este archivo documenta la recuperación y los bloqueos, pero no genera ni sube SQL conflictivo como si fuera definitivo.

Siguiente acción necesaria: cerrar las discrepancias 0012, 0013, 0019, 0020, 0023, 0024 y 0028; después generar el DDL definitivo completo y auditar dependencias contra 0022 y 0032–0037.