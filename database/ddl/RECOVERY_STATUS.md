# Reconstrucción DDL — AutoMarket Pro

Estado: recuperación parcial basada exclusivamente en DDL aprobados/corregidos.

## Restaurados en database/ddl

- 0022_plans.sql
- 0038_leads.sql
- 0039_lead_interactions.sql
- 0040_test_drive_appointments.sql
- 0041_conversations.sql
- 0042_messages.sql
- 0043_notifications.sql
- 0044_user_favorites.sql
- 0045_user_comparison_items.sql
- 0046_publication_analytics_daily.sql
- 0047_dealer_reviews.sql
- 0048_user_saved_searches.sql
- 0049_audit_logs.sql
- 0050_personal_access_tokens.sql (ya existente, no modificado)

## Pendientes de recuperación documental

0012–0021, 0023–0031 y 0032–0037 no se reconstruyen todavía desde memoria ni por inferencia. Existen especificaciones históricas, pero algunas fueron posteriormente corregidas; por la regla de no invención deben recuperarse y auditarse contra la versión final aprobada antes de escribirlas en GitHub.

## Regla

No modificar modelos ni generar migraciones Laravel a partir de estos archivos hasta completar la auditoría DDL.
