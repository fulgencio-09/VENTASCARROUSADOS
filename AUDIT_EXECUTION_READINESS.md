# Auditoría de preparación para ejecución local — AutoMarket Pro

Fecha: 2026-10-09
Estado: BLOQUEOS P0 IDENTIFICADOS

## Resultado

El backend Laravel 12 levanta correctamente y `/up` responde. El `POST /api/auth/login` alcanza el controlador pero falla porque la estructura de base de datos todavía no está instalada en `automarket_pro`.

## P0 — Bloqueos para ejecución reproducible

1. No existen migraciones Laravel ejecutables para la estructura DDL.
2. La base local `automarket_pro` todavía no contiene la estructura necesaria.
3. La estructura DDL 0032–0037 estaba ausente del repositorio y fue restaurada desde la versión aprobada del dominio:
   - 0032 payments
   - 0033 payment_transactions
   - 0034 payment_webhook_logs
   - 0035 refunds
   - 0036 moderation_cases
   - 0037 moderation_history
4. El frontend actual es React/Vite, no Angular 20 SSR. No se debe reconciliar silenciosamente esta diferencia.
5. El frontend usa contratos/mock data que no coinciden todavía con el dominio backend aprobado (por ejemplo USD/es-CL frente a COP/Colombia).

## P1 — Integración pendiente

- Completar contrato HTTP de autenticación: login, registro controlado, logout y usuario actual.
- Crear seed controlado para usuario administrador/prueba.
- Integrar frontend con API real y retirar autenticación mock.
- Definir DTO/Resources entre modelos backend y contratos frontend.
- Completar endpoints de dominio por fases.
- Agregar lockfiles y configuración reproducible del proyecto.
- Completar `.env.example` Laravel.
- Revisar `.gitignore` para artefactos Laravel locales.

## Regla de implementación

No se modifican modelos existentes ni se crean Services adicionales hasta cerrar la instalación reproducible de la base y validar el flujo Auth HTTP real.

## Próxima fase autorizada

1. Traer los cambios DDL 0032–0037 al entorno local.
2. Auditar sintaxis y orden de dependencias 0001–0050.
3. Generar migraciones Laravel equivalentes únicamente después de esa auditoría.
4. Ejecutar migraciones en `automarket_pro`.
5. Crear usuario de prueba controlado.
6. Repetir prueba de `/api/auth/login`.

## Nota sobre documentación histórica

`database/ddl/RECOVERY_AUDIT_0001_0037.md` y `database/ddl/RECOVERY_STATUS.md` contienen estados históricos anteriores. Este documento registra el estado operativo más reciente y no elimina ni modifica la trazabilidad histórica.
