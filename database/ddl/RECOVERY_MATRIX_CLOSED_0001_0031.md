# Cierre de recuperación DDL 0001–0031 — AutoMarket Pro

Estado: **RECUPERADO / RECONSTRUIDO**.

| DDL | Tabla | Estado |
|---|---|---|
| 0001 | departments | RECUPERADO |
| 0002 | cities | RECUPERADO |
| 0003 | body_types | RECUPERADO |
| 0004 | fuel_types | RECUPERADO |
| 0005 | transmissions | RECUPERADO |
| 0006 | traction_types | RECUPERADO |
| 0007 | colors | RECUPERADO |
| 0008 | features | RECUPERADO |
| 0009 | vehicle_makes | RECUPERADO; FK media diferida |
| 0010 | vehicle_models | RECUPERADO |
| 0011 | vehicle_versions | RECUPERADO |
| 0012 | users | RECONSTRUIDO contra User.php/AuthService |
| 0013 | profiles | RECONSTRUIDO contra Profile.php |
| 0014 | roles | RECUPERADO contra Role.php |
| 0015 | permissions | RECUPERADO contra Permission.php |
| 0016 | model_has_roles | RECUPERADO contra ModelHasRole.php |
| 0017 | model_has_permissions | RECUPERADO contra ModelHasPermission.php |
| 0018 | role_has_permissions | RECUPERADO contra RoleHasPermission.php |
| 0019 | dealers | RECONSTRUIDO contra Dealer.php |
| 0020 | dealer_users | RECONSTRUIDO contra DealerUser.php |
| 0021 | dealer_branches | RECUPERADO contra DealerBranch.php |
| 0022 | plans | APROBADO |
| 0023 | dealer_subscriptions | RECONSTRUIDO contra DealerSubscription.php |
| 0024 | user_kyc_documents | RECONSTRUIDO contra UserKycDocument.php |
| 0025 | vehicles | RECONSTRUIDO contra Vehicle.php; VIN VARBINARY(512) |
| 0026 | vehicle_features | RECUPERADO contra VehicleFeature.php |
| 0027 | vehicle_inspections | RECUPERADO contra VehicleInspection.php |
| 0028 | publications | RECONSTRUIDO contra Publication.php |
| 0029 | publication_status_history | RECUPERADO contra PublicationStatusHistory.php |
| 0030 | publication_plans_snapshot | RECUPERADO contra PublicationPlanSnapshot.php |
| 0031 | media_files | RECONSTRUIDO contra MediaFile.php |

## Criterios de cierre

- Se eliminan de la reconstrucción los nombres históricos que contradicen los modelos actuales.
- `plans.id` y las referencias a planes usan BIGINT UNSIGNED.
- `vehicles.vin_encrypted` usa VARBINARY(512).
- `dealer_users.status` queda VARCHAR(30), no ENUM, porque no existe evidencia suficiente para fijar valores cerrados.
- `publications.status` usa únicamente `pendiente`, `publicado`, `en_pausa`, `vendido`, `rechazado`.
- `expires_at` es el mecanismo de vencimiento de publicaciones; no se crea `expired`.
- Las dependencias de `media_files` que aparecen en tablas anteriores quedan identificadas como FKs diferidas y deberán incorporarse al conjunto de migraciones ordenadas.

## Alcance

Este cierre significa que los archivos DDL 0001–0031 fueron recuperados/reconstruidos en GitHub. **Todavía no significa ejecución en MySQL ni aprobación de migraciones Laravel.**

Siguiente etapa: auditoría integral de dependencias 0001–0050 y generación posterior de migraciones Laravel.
