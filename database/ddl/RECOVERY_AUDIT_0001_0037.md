# Auditoría de recuperación DDL 0001–0037

Estado: NO COMPLETADO — no se escriben DDL cuando la evidencia final presenta contradicciones.

## Evidencia recuperada

Se localizaron especificaciones de migración para 0001–0031 y documentación consolidada del modelo. Estas fuentes contienen suficiente información histórica para reconstruir SQL, pero no todas representan la versión final actualmente aprobada de los modelos.

## Contradicciones detectadas que bloquean una reconstrucción automática

- 0012 users: la especificación histórica usa `password_hash` y estados `pending_verification/active/suspended/banned`; el modelo Laravel actualmente aprobado usa `password` y la documentación de AuthService utiliza estados `active/inactive/suspended`, cuyos valores no quedaron formalmente confirmados en DDL.
- 0013 profiles: la documentación histórica usa `national_id_type` y `national_id_number`; el modelo actual usa `document_type` y `document_number`.
- 0019 dealers: la especificación histórica usa `legal_name`, `trade_name`, `tax_id`, etc.; el modelo actual aprobado usa `legal_name`, `commercial_name`, `nit`, `whatsapp`, `website`, `logo_media_id`, `banner_media_id`, `status`.
- 0020 dealer_users: documentación histórica usa `is_active`; el modelo actual documentado usa `status` en el pivot.
- 0024 user_kyc_documents: especificación histórica contiene `dealer_id`, S3 metadata y `reviewed_by_user_id`; el modelo actual aprobado contiene `media_file_id`, `verified_at` y `verified_by_user_id`, sin `dealer_id`.
- 0025 vehicles: existen especificaciones históricas con columnas que no coinciden exactamente con la capa Eloquent final; no se debe escoger una versión por inferencia.
- 0007 colors: documentación histórica omite `hex_code/is_active`, mientras el modelo actual los utiliza.
- 0008 features: documentación histórica tiene una restricción UNIQUE(category,name); el modelo actual incluye además `is_active`.
- 0009 vehicle_makes: el modelo actual contiene `logo_media_id`, ausente en la especificación histórica localizada.
- 0031 media_files y 0032–0037: existen documentos históricos adicionales, pero 0032–0037 ya tienen DDL final aprobado independiente y no deben ser reemplazados por las versiones históricas.

## Regla aplicada

No se genera ni se sube SQL por inferencia cuando una columna, FK, ENUM, índice o política de borrado difiere entre la especificación histórica y el modelo/DDL final aprobado.

## Estado actual

Restaurados previamente y conservados:
- 0022
- 0038–0049
- 0050

Pendientes de recuperación final:
- 0001–0021
- 0023–0031

## Próximo paso

Recuperar la fuente documental que corresponda a la versión final de cada DDL pendiente y auditarla contra los modelos actuales antes de subirla a GitHub.
