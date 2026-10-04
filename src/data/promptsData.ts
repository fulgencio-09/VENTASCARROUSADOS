/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PROMPTS MAESTROS: MARKETPLACE DE VEHÍCULOS USADOS (17 PROMPTS ENCADENADOS)
 * Cada prompt contiene la cláusula explícita de continuidad acumulativa y respeto del trabajo previo.
 */

import { SystemPromptSpec } from '../types/marketplace';

export const SYSTEM_PROMPTS: SystemPromptSpec[] = [
  {
    id: 'prompt-01',
    number: '01',
    title: 'Contexto General y Definición de Negocio',
    phase: 'Fase de Descubrimiento & Estrategia',
    scopeSummary: 'Definición de visión del marketplace, propuesta de valor, objetivos estratégicos, actores del ecosistema y reglas de negocio fundacionales.',
    strictContinuityClause: 'ESTABLECIMIENTO BASE: Este prompt define los cimientos del proyecto. Ningún componente futuro podrá contradecir los objetivos de negocio aquí formalizados.',
    promptContent: `Actúa como Arquitecto de Software y Product Manager Senior especializado en plataformas transaccionales y comercio electrónico automotriz.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS (AutoMarket Pro)

OBJETIVO GENERAL:
Diseñar y construir una plataforma web de marketplace automotriz moderna, robusta, altamente escalable y segura para la compra, venta, certificación y financiamiento de vehículos usados (seminuevos), conectando a vendedores particulares y concesionarias verificadas con compradores finales.

ALCANCE Y ACTORES DEL NEGOCIO:
1. Comprador (Buyer): Explora el catálogo mediante filtros avanzados, compara vehículos lado a lado, agenda pruebas de manejo (test drives), calcula financiamiento y envía solicitudes de contacto o WhatsApp.
2. Vendedor Particular (Private Seller): Publica hasta 1 vehículo gratuito con opciones de pago para destacar su aviso, gestiona leads y coordina visitas.
3. Vendedor Concesionaria (Dealer): Dispone de inventario masivo, cuenta con insignia de verificación KYC, múltiples asesores y reportes analíticos de rendimiento de avisos.
4. Administrador / Moderador: Modera avisos antes o después de publicación, valida documentación legal y técnica, gestiona reportes de fraude y analiza métricas de negocio.

REGLAS DE NEGOCIO CRÍTICAS:
- Todo vehículo debe estar asociado a una marca, modelo, versión, año y kilometraje válidos.
- Las publicaciones cuentan con planes de visibilidad: Gratuito (30 días), Destacado (45 días) y Premium (60 días con inspección certificada).
- Transparencia total: cada vehículo publicado puede adjuntar un informe de inspección mecánica de hasta 150 puntos.
- Los datos de contacto se entregan protegiendo la privacidad y evitando spam mediante validaciones estrictas.

ENTREGABLE REQUERIDO:
Documento de especificación funcional inicial que detalle el alcance, propuesta de valor, matriz de actores, métricas clave de éxito (KPIs: tasa de conversión de leads, tiempo promedio de venta, ingresos por planes) y roadmap técnico para las siguientes fases.`,
    codeArtifactName: '01_business_scope_spec.md',
    codeArtifactLang: 'markdown',
    codeArtifactSnippet: `# AutoMarket Pro - Especificación Funcional
## KPIs Principales
- Tasa de conversión de leads a ventas: Meta >= 8.5%
- Tiempo medio de publicación activa hasta venta: <= 24 días
- Nivel de satisfacción de inspección mecánica certificada: >= 95%`,
    dependencies: [],
  },
  {
    id: 'prompt-02',
    number: '02',
    title: 'Arquitectura del Sistema y Stack Tecnológico',
    phase: 'Arquitectura de Software',
    scopeSummary: 'Definición de la arquitectura desacoplada: Laravel 11 REST API, Angular 18 SPA, PostgreSQL, Redis, S3 y Docker.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes respetar y mantener estrictamente el contexto y alcance de negocio definidos en el PROMPT 01. No alteres los actores ni las reglas comerciales.',
    promptContent: `Actúa como Arquitecto de Software Principal.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar y mantener estrictamente todos los requerimientos y objetivos definidos en el PROMPT 01 (Contexto General). Nada de lo definido previamente debe ser modificado ni omitido.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS (AutoMarket Pro) - FASE 02: ARQUITECTURA

STACK TECNOLÓGICO OBLIGATORIO:
1. Backend: Laravel 11 (PHP 8.3+) configurado exclusivamente como API RESTful sin renderizado Blade, utilizando Laravel Sanctum para autenticación stateless, Eloquent ORM con repositorios y servicios desacoplados.
2. Frontend: Angular 18+ (o arquitectura reactiva equivalente en TypeScript) como Single Page Application (SPA) con componentes Standalone, Signals para reactividad de alto rendimiento, lazy loading modular y Tailwind CSS.
3. Base de Datos: PostgreSQL 16 (o MySQL 8) con esquema relacional indexado para búsquedas rápidas geoespaciales y de texto completo.
4. Almacenamiento & Caché: Redis 7 para colas de trabajos asíncronos (notificaciones por email/SMS, procesamiento de imágenes WebP) y caché de catálogo.
5. Almacenamiento de Medios: Compatible con AWS S3 / MinIO para fotografías y reportes PDF de inspección.
6. Infraestructura: Docker y Docker Compose para reproducibilidad exacta en desarrollo y producción.

PATRONES ARQUITECTÓNICOS:
- Clean Architecture / Capas: Controllers -> FormRequests -> Application Services -> Repositories -> Eloquent Models -> ApiResources.
- Event-Driven Architecture: Eventos y Listeners para registro de leads, confirmación de pagos de planes y alertas de moderación.
- API RESTful: Códigos HTTP semánticos (200, 201, 204, 400, 401, 403, 404, 422, 500) y formato unificado ApiResponse con payload JSON estandarizado.

ENTREGABLE REQUERIDO:
Diagrama de arquitectura en texto/C4, diagrama de contenedores Docker, definición de convenciones de código y estructura de carpetas tanto para el backend Laravel como para el frontend SPA.`,
    codeArtifactName: 'docker-compose.yml',
    codeArtifactLang: 'yaml',
    codeArtifactSnippet: `version: '3.8'
services:
  api:
    build: { context: ./backend, dockerfile: Dockerfile }
    ports: ["8000:8000"]
    environment:
      DB_CONNECTION: pgsql
      REDIS_HOST: redis
    depends_on: [db, redis]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: automarket_db
      POSTGRES_USER: automarket_user
  redis:
    image: redis:7-alpine`,
    dependencies: ['prompt-01'],
  },
  {
    id: 'prompt-03',
    number: '03',
    title: 'Roles, Permisos y Matriz de Control de Acceso (RBAC)',
    phase: 'Seguridad & Permisos',
    scopeSummary: 'Modelado del control de acceso basado en roles (Spatie Permission), guardias de rutas y capacidades específicas.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes respetar y mantener estrictamente el contexto del PROMPT 01 y la arquitectura desacoplada Laravel API / Frontend SPA definida en el PROMPT 02.',
    promptContent: `Actúa como Ingeniero de Seguridad y Especialista en Laravel/Spatie Permission.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar y mantener estrictamente los actores del negocio del PROMPT 01 y la arquitectura de API desacoplada del PROMPT 02. Las restricciones de permisos deben aplicarse en el backend como fuente de verdad y reflejarse en los Guards del frontend.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 03: ROLES Y PERMISOS (RBAC)

MATRIZ DE ROLES Y CAPACIDADES:
1. super_admin: Acceso irrestricto, configuración del sistema, auditoría financiera, gestión de administradores y moderadores.
2. moderator: Revisión y aprobación/rechazo de publicaciones de vehículos, verificación de identidad KYC de concesionarias, resolución de denuncias.
3. dealer (Concesionaria): Gestión ilimitada de vehículos bajo suscripción, asignación de asesores de ventas, métricas avanzadas de catálogo, descarga de reportes de leads.
4. private_seller (Particular): Publicación de vehículos (gratis o pagados), edición de sus propios avisos, visualización y respuesta a leads de sus autos.
5. buyer (Comprador Registrado): Guardar vehículos favoritos, agendar test-drives, enviar ofertas formales, gestionar su historial de consultas.
6. guest (Visitante): Exploración pública del catálogo, filtrado, visualización de fichas técnicas e iniciación de contacto.

IMPLEMENTACIÓN REQUERIDA:
- Paquete spatie/laravel-permission con migraciones para roles, permissions, model_has_roles.
- Seeders con roles y permisos específicos (vehicles.create, vehicles.update.own, vehicles.moderate, leads.view.own, users.verify_kyc).
- Middlewares personalizados de Laravel (RoleMiddleware, PermissionMiddleware) que retornen JSON 403 Forbidden estandarizado en caso de violación.
- Interfaces TypeScript y Guards equivalentes para el frontend SPA para control condicional de vistas.`,
    codeArtifactName: 'RolesAndPermissionsSeeder.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `use Spatie\\Permission\\Models\\Role;
use Spatie\\Permission\\Models\\Permission;

public function run(): void {
    $permissions = [
        'vehicles.view', 'vehicles.create', 'vehicles.update.own',
        'vehicles.delete.own', 'vehicles.moderate', 'leads.read.own',
        'dealers.verify_kyc', 'plans.purchase'
    ];
    foreach ($permissions as $p) Permission::firstOrCreate(['name' => $p]);
    
    $dealer = Role::firstOrCreate(['name' => 'dealer']);
    $dealer->givePermissionTo(['vehicles.create', 'vehicles.update.own', 'leads.read.own', 'plans.purchase']);
}`,
    dependencies: ['prompt-01', 'prompt-02'],
  },
  {
    id: 'prompt-04',
    number: '04',
    title: 'Modelo de Datos Relacional y Migraciones',
    phase: 'Base de Datos & Persistencia',
    scopeSummary: 'Definición de tablas, llaves foráneas, índices de alta velocidad, migraciones Laravel y relaciones Eloquent completas.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes respetar rigurosamente el contexto del PROMPT 01, la arquitectura PostgreSQL/Laravel del PROMPT 02 y los roles y permisos del PROMPT 03.',
    promptContent: `Actúa como Administrador de Base de Datos (DBA) y Desarrollador Senior de Laravel.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar y mantener estrictamente las definiciones del PROMPT 01, PROMPT 02 y PROMPT 03. Las entidades de base de datos deben soportar todos los requerimientos de los roles y el ciclo de vida del vehículo sin excepciones.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 04: MODELO DE DATOS

TABLAS Y ENTIDADES REQUERIDAS:
1. users: id (UUID/bigint), name, email, password, phone, role_id, is_kyc_verified, city, avatar_url, timestamps.
2. dealers: id, user_id (FK), business_name, tax_id (RUT/CUIT/RFC), address, city, logo_url, website, rating, verified_at.
3. makes (marcas): id, name, slug, logo_url, is_active.
4. vehicle_models: id, make_id (FK), name, slug.
5. vehicle_versions: id, vehicle_model_id (FK), name, body_type, fuel_type, transmission, engine_displacement.
6. vehicles: id, seller_id (FK users), make_id (FK), model_id (FK), version_id (FK), year, price_usd, mileage_km, fuel_type, transmission, body_type, engine, horsepower, traction, color, city, description, status (publicado, pendiente, en_pausa, vendido, rechazado), plan_id (FK), plan_expires_at, inspection_score, vin, plate, views_count, published_at, timestamps, softDeletes.
7. vehicle_media: id, vehicle_id (FK), media_url, media_type (image, inspection_pdf, 360), is_primary, sort_order.
8. inspection_reports: id, vehicle_id (FK), overall_score, inspector_name, certified_at, check_items (JSONB), report_pdf_url.
9. publication_plans: id, code (free, destacado, premium), name, price_usd, duration_days, photo_limit, boost_priority.
10. leads: id, vehicle_id (FK), seller_id (FK), buyer_name, buyer_email, buyer_phone, type (consulta, test_drive, oferta), message, preferred_date, offered_price_usd, status (nuevo, contactado, en_negociacion, concretado), created_at.
11. payments: id, user_id (FK), vehicle_id (FK), plan_id (FK), gateway (stripe, mercadopago), amount_usd, transaction_reference, status (completed, pending, failed), timestamps.

REQUERIMIENTOS TÉCNICOS:
- Definir migraciones de Laravel con índices compuestos en: [make_id, model_id, year, price_usd], [status, plan_id, published_at].
- Definir modelos Eloquent con relaciones tipadas (hasMany, belongsTo, belongsToMany).`,
    codeArtifactName: '2026_10_01_000001_create_vehicles_table.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `Schema::create('vehicles', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('make_id')->constrained();
    $table->foreignId('model_id')->constrained('vehicle_models');
    $table->unsignedSmallInteger('year');
    $table->decimal('price_usd', 12, 2);
    $table->unsignedInteger('mileage_km');
    $table->string('fuel_type', 30);
    $table->string('transmission', 30);
    $table->string('body_type', 30);
    $table->enum('status', ['publicado', 'pendiente', 'en_pausa', 'vendido', 'rechazado'])->default('pendiente');
    $table->unsignedTinyInteger('inspection_score')->default(0);
    $table->timestamps();
    $table->softDeletes();
    $table->index(['status', 'price_usd', 'year']);
});`,
    dependencies: ['prompt-01', 'prompt-02', 'prompt-03'],
  },
  {
    id: 'prompt-05',
    number: '05',
    title: 'Diseño UX/UI y Sistema de Componentes',
    phase: 'Diseño de Experiencia de Usuario',
    scopeSummary: 'Lineamientos visuales automotrices, paleta 60-30-10, tipografía con Syne y Plus Jakarta Sans, componentes de alta fidelidad sin anti-patrones.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes respetar la definición funcional del PROMPT 01, la arquitectura del PROMPT 02, los roles del PROMPT 03 y las entidades del PROMPT 04.',
    promptContent: `Actúa como Diseñador de Producto Digital (UI/UX) y Desarrollador Frontend Senior.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar estrictamente todas las decisiones previas de los PROMPTS 01 al 04. La interfaz de usuario debe traducir directamente las entidades y roles del modelo de datos sin inventar campos discordantes.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 05: UX/UI

REGLAS DE DISEÑO OBLIGATORIAS (Universal Frontend Design Constitution):
1. Cero Píldoras Estáticas: No encerrar metadatos en cajas redondeadas de colores. Mostrar año, kilometraje y combustible como texto limpio con separadores tipográficos ('·').
2. Paleta 60-30-10 Automotriz: 60% lienzo neutro refinado (slate/stone sobrio), 30% superficies de tarjeta y bordes hairline de 1px, 10% acento primario amigable de alta conversión (ámbar cálido o cobalto automotriz).
3. Tipografía con Jerarquía: Fuente display con carácter (Syne / Cabinet Grotesk) para títulos y números de precio, combinada con Plus Jakarta Sans para lectura óptima. Números tabulares obligatorios en precios, kilometraje y años.
4. Top Bar Contract: Exactamente 3 zonas (Wordmark único, 4-6 enlaces limpios, 1-2 botones de acción).
5. Cards de Vehículos: Proporción de imagen 4:3 con fotos reales en estudio automotriz, precio destacado en USD con cuota mensual calculada, y ficha técnica condensada.
6. Módulo de Compra Contiguo (PDP): Ficha técnica detallada con selector de fotos, calculador de cuotas de crédito automotriz, checklist de inspección de 150 puntos, y CTA directo a WhatsApp y agendamiento de test-drive.

ENTREGABLE REQUERIDO:
Guía de estilos CSS en Tailwind v4, especificación de componentes clave reutilizables y estructura de layouts responsivos para desktop (1440px) y mobile.`,
    codeArtifactName: 'theme_tailwind_spec.css',
    codeArtifactLang: 'css',
    codeArtifactSnippet: `/* Paleta y Contratos de Diseño AutoMarket */
--color-brand-primary: #f59e0b; /* Amber 500 */
--color-brand-navy: #0f172a;    /* Slate 900 */
--font-display: 'Syne', sans-serif;
--font-body: 'Plus Jakarta Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;`,
    dependencies: ['prompt-01', 'prompt-02', 'prompt-03', 'prompt-04'],
  },
  {
    id: 'prompt-06',
    number: '06',
    title: 'Frontend Angular: Arquitectura y Componentes',
    phase: 'Desarrollo Frontend SPA',
    scopeSummary: 'Arquitectura de frontend en Angular 18+ (o TypeScript reactivo): Standalone components, Signals, interceptores HTTP con JWT y state management.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes implementar fielmente el diseño del PROMPT 05, consumiendo los modelos del PROMPT 04, respetando los roles del PROMPT 03 y la arquitectura del PROMPT 02.',
    promptContent: `Actúa como Desarrollador Frontend Angular Senior (Angular 18+ Standalone & Signals).

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar y basarte estrictamente en los PROMPTS 01 al 05. Los componentes deben coincidir exactamente con los tipos del modelo de datos de Laravel (PROMPT 04), los roles de usuario (PROMPT 03) y los estándares de diseño anti-slop (PROMPT 05).

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 06: ANGULAR FRONTEND

ESTRUCTURA DE APLICACIÓN FRONTEND:
1. Arquitectura Standalone: Sin NgModules, importando componentes, directivas y pipes directamente.
2. Reactividad con Signals: Utilizar signal(), computed() y effect() para el estado de los filtros del catálogo, carrito de comparación y sesión de usuario.
3. Servicios de Estado (Store): VehicleStateService para el catálogo facetado y leads, AuthService con signals para el usuario actual y token JWT.
4. Interceptor HTTP: AuthInterceptor para inyectar automáticamente el Bearer token en cabeceras y gestionar el refresco transparente ante errores 401.
5. Guards de Rutas: AuthGuard y RoleGuard (dealer, admin) implementando CanActivateFn.
6. Formularios Reactivos: ReactiveFormsModule con validaciones robustas en el wizard de publicación de vehículos y cotizador financiero.

ENTREGABLE REQUERIDO:
Código completo de los servicios base (AuthService, VehicleService), interceptor HTTP, interfaces TypeScript de vehículos y el componente principal del catálogo con filtrado reactivo.`,
    codeArtifactName: 'vehicle.service.ts',
    codeArtifactLang: 'typescript',
    codeArtifactSnippet: `import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle, VehicleFilters } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private vehiclesSignal = signal<Vehicle[]>([]);
  public vehicles = computed(() => this.vehiclesSignal());

  getVehicles(filters: VehicleFilters) {
    return this.http.get<{ data: Vehicle[] }>('/api/v1/vehicles', { params: filters as any })
      .subscribe(res => this.vehiclesSignal.set(res.data));
  }
}`,
    dependencies: ['prompt-01', 'prompt-02', 'prompt-03', 'prompt-04', 'prompt-05'],
  },
  {
    id: 'prompt-07',
    number: '07',
    title: 'Laravel API: Controladores, Recursos y FormRequests',
    phase: 'Desarrollo Backend API',
    scopeSummary: 'Endpoints RESTful estandarizados, ApiResources para serialización, FormRequests con validaciones estrictas y ApiResponse trait.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes mantener rigurosamente la arquitectura del PROMPT 02, el RBAC del PROMPT 03 y el modelo de datos del PROMPT 04 para servir al frontend definido en el PROMPT 06.',
    promptContent: `Actúa como Desarrollador Backend Laravel Senior.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar y mantener estrictamente las tablas y modelos del PROMPT 04, los roles del PROMPT 03 y las necesidades del frontend del PROMPT 06. Los contratos JSON de la API deben ser semánticos, predecibles y seguros.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 07: LARAVEL API

ESPECIFICACIÓN DE ENDPOINTS RESTful (Prefijo /api/v1/):
- GET /vehicles: Catálogo público con paginación, filtros de marca, modelo, precio, año y ordenamiento.
- GET /vehicles/{id}: Detalle completo del vehículo, fotos, vendedor e informe de inspección.
- POST /vehicles: Creación de vehículo (Auth: dealer, private_seller) validado con StoreVehicleRequest.
- PUT /vehicles/{id}: Edición de vehículo propio (Policy: VehiclePolicy::update).
- DELETE /vehicles/{id}: Eliminación lógica (soft delete).
- POST /vehicles/{id}/leads: Registro de consulta o test-drive.
- GET /seller/vehicles: Inventario del vendedor autenticado con conteo de métricas y leads.
- GET /admin/moderation/queue: Lista de avisos pendientes para moderadores.
- PATCH /admin/moderation/{id}: Aprobar o rechazar aviso con motivo.

REQUERIMIENTOS TÉCNICOS:
- FormRequests dedicados con reglas de validación en español y sanitización de datos.
- JsonResources (VehicleResource, VehicleDetailResource, LeadResource) para desacoplar el esquema de base de datos de la respuesta JSON.
- Trait ApiResponse para respuestas consistentes: success($data, $message, $code), error($message, $code, $errors).
- Manejo global de excepciones en bootstrap/app.php (ModelNotFoundException -> 404, ValidationException -> 422).`,
    codeArtifactName: 'VehicleController.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\StoreVehicleRequest;
use App\\Http\\Resources\\VehicleResource;
use App\\Services\\VehicleService;
use Illuminate\\Http\\JsonResponse;

class VehicleController extends Controller {
    public function __construct(protected VehicleService $service) {}

    public function store(StoreVehicleRequest $request): JsonResponse {
        $vehicle = $this->service->createVehicle($request->validated(), auth()->id());
        return $this->apiSuccess(new VehicleResource($vehicle), 'Vehículo creado exitosamente', 201);
    }
}`,
    dependencies: ['prompt-02', 'prompt-03', 'prompt-04', 'prompt-06'],
  },
  {
    id: 'prompt-08',
    number: '08',
    title: 'Autenticación, Seguridad de Sesión y Verificación KYC',
    phase: 'Autenticación & Identidad',
    scopeSummary: 'Autenticación vía Laravel Sanctum, tokens revocables, protección contra fuerza bruta, verificación de email y carga de documentos de identidad.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes basarte en el sistema de roles del PROMPT 03, los endpoints del PROMPT 07 y el interceptor frontend del PROMPT 06 sin alterar el flujo establecido.',
    promptContent: `Actúa como Ingeniero de Seguridad Especializado en Autenticación Laravel y Angular.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar estrictamente el RBAC del PROMPT 03, el modelo de datos del PROMPT 04 y los contratos de API del PROMPT 07.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 08: AUTENTICACIÓN Y SEGURIDAD

REQUERIMIENTOS FUNCIONALES:
1. Registro de Usuarios: Con selección explícita de perfil (Comprador, Vendedor Particular, Concesionaria). Para concesionarias se exige Razón Social y RUT/Identificación Fiscal.
2. Login con Throttling: Máximo 5 intentos fallidos por minuto por IP con bloqueo temporal (RateLimiter de Laravel).
3. Emisión de Tokens Sanctum: Tokens personales de acceso con expiración configurable (abilities delimitadas por rol).
4. Refresh Token Flow / Revocación: Endpoint POST /logout para revocación de token actual y logout en todos los dispositivos.
5. Verificación KYC de Vendedores: Flujo de subida de documento de identidad o constitución de empresa para obtener la insignia "Vendedor Verificado".
6. Restablecimiento Seguro de Contraseña: Envío de enlace con token firmado temporal a través de correo electrónico con plantilla responsiva.

ENTREGABLE REQUERIDO:
Controlador AuthController completo, reglas de validación en LoginRequest y RegisterRequest, y servicio Angular AuthService con gestión de sesión y storage seguro.`,
    codeArtifactName: 'AuthController.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `public function login(LoginRequest $request): JsonResponse {
    if (!Auth::attempt($request->only('email', 'password'))) {
        return $this->apiError('Credenciales incorrectas', 401);
    }
    $user = Auth::user();
    $token = $user->createToken('auth-token', $user->getAllPermissions()->pluck('name')->toArray())->plainTextToken;
    return $this->apiSuccess(['user' => new UserResource($user), 'token' => $token], 'Sesión iniciada');
}`,
    dependencies: ['prompt-02', 'prompt-03', 'prompt-06', 'prompt-07'],
  },
  {
    id: 'prompt-09',
    number: '09',
    title: 'Módulo de Inventario de Vehículos y Reporte de Inspección',
    phase: 'Gestión de Inventario & Inspección',
    scopeSummary: 'Catálogo de marcas/modelos normalizados, subida y compresión WebP de imágenes, y checklist de inspección mecánica de 150 puntos.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes respetar el modelo vehicles y vehicle_media del PROMPT 04 y los endpoints del PROMPT 07.',
    promptContent: `Actúa como Desarrollador Full-Stack Automotriz.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar estrictamente la estructura del vehículo creada en el PROMPT 04 y las validaciones del PROMPT 07. La inspección mecánica debe nutrir el campo inspection_score y inspection_items sin duplicar estructuras.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 09: VEHÍCULOS E INSPECCIÓN

REQUERIMIENTOS:
1. Normalización de Catálogo Vehicular: Endpoints de marcas dependientes: GET /makes -> GET /makes/{id}/models -> GET /models/{id}/versions.
2. Procesamiento de Fotografías: Subida multipart de imágenes con validación de tipo MIME (jpg, png, webp) y peso máximo (10MB), redimensionamiento automático en cola Redis a versiones thumbnail (400px), card (800px) y full-hd (1600px) en formato WebP optimizado con marca de agua discreta de protección.
3. Checklist de Inspección Certificada (150 Puntos):
   - Categorías: Motor, Transmisión, Frenos, Suspensión, Chasis/Carrocería, Neumáticos, Sistema Eléctrico y Documentación.
   - Puntuación automática de 0 a 100 ponderada.
   - Generación de informe en PDF descargable y sello "Inspección Certificada" si la puntuación supera 90 puntos.
4. Historial Legal y Verificación de VIN: Consulta de multas de tránsito, prendas vehiculares y kilometraje histórico en base a revisiones técnicas previas.

ENTREGABLE REQUERIDO:
Job de procesamiento de imágenes con Intervention Image / Spatie Medialibrary, clase InspectionCalculatorService y componente frontend para visualizar la ficha de inspección interactiva.`,
    codeArtifactName: 'InspectionCalculatorService.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `class InspectionCalculatorService {
    public function calculateScore(array $items): int {
        $totalWeight = 0; $passedWeight = 0;
        foreach ($items as $item) {
            $weight = $this->getCategoryWeight($item['category']);
            $totalWeight += $weight;
            if ($item['status'] === 'passed') $passedWeight += $weight;
            elseif ($item['status'] === 'warning') $passedWeight += ($weight * 0.6);
        }
        return (int) round(($passedWeight / max($totalWeight, 1)) * 100);
    }
}`,
    dependencies: ['prompt-04', 'prompt-07', 'prompt-08'],
  },
  {
    id: 'prompt-10',
    number: '10',
    title: 'Publicaciones, Planes de Visibilidad y Pagos',
    phase: 'Monetización & Pasarela de Pagos',
    scopeSummary: 'Lógica de planes (Free, Destacado, Premium), integración de pasarela de pago (Stripe/MercadoPago), webhooks con idempotencia y expiración automática.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes mantener las especificaciones de planes y pagos modeladas en el PROMPT 04 y las reglas de negocio del PROMPT 01.',
    promptContent: `Actúa como Desarrollador Senior de Integraciones Financieras y Pasarelas de Pago.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar los modelos publication_plans y payments del PROMPT 04 y las reglas de visibilidad del PROMPT 01 y 07.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 10: PUBLICACIONES Y PAGOS

REQUERIMIENTOS:
1. Definición de Planes de Publicación:
   - Free (Gratuito): 1 auto, 30 días, hasta 8 fotos, posición estándar.
   - Destacado ($29 USD): 45 días, hasta 18 fotos, botón directo a WhatsApp, posición prioritaria.
   - Premium ($59 USD): 60 días, hasta 30 fotos, carrusel de portada, informe de inspección completo, alertas a compradores.
2. Integración de Pasarela de Pagos: Checkout seguro con Stripe y MercadoPago mediante redirección o SDK embebido.
3. Webhook Idempotente: Endpoint POST /webhooks/payments que verifique la firma criptográfica del proveedor, registre la transacción y actualice el plan y fecha de caducidad del vehículo en una transacción de base de datos segura.
4. Comando Programado de Expiración (Scheduler): Comando diario de Artisan (vehicles:check-expiration) que verifique avisos vencidos, cambie su estado a 'en_pausa' y notifique al vendedor por email ofreciendo renovación con descuento.

ENTREGABLE REQUERIDO:
PaymentService, WebhookController con verificación de firmas idempotentes y vista frontend del selector de planes con confirmación de pago.`,
    codeArtifactName: 'PaymentWebhookHandler.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `public function handleStripeWebhook(Request $request): JsonResponse {
    $payload = $request->getContent();
    $sigHeader = $request->header('Stripe-Signature');
    $event = \\Stripe\\Webhook::constructEvent($payload, $sigHeader, config('services.stripe.webhook_secret'));

    if ($event->type === 'checkout.session.completed') {
        $session = $event->data->object;
        $this->paymentService->activateVehiclePlan($session->metadata->vehicle_id, $session->metadata->plan_id, $session->id);
    }
    return response()->json(['received' => true]);
}`,
    dependencies: ['prompt-01', 'prompt-04', 'prompt-07'],
  },
  {
    id: 'prompt-11',
    number: '11',
    title: 'Catálogo Público, Búsqueda Facetada y Algoritmo de Relevancia',
    phase: 'Búsqueda & Catálogo',
    scopeSummary: 'Motor de búsqueda facetada con filtros combinables (precio, año, kilometraje, combustible, transmisión, carrocería, ciudad) y ordenamiento ponderado.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes respetar las interfaces del PROMPT 06, los endpoints del PROMPT 07 y las entidades del PROMPT 04.',
    promptContent: `Actúa como Ingeniero de Búsqueda y Optimización de Consultas SQL.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar el diseño del catálogo del PROMPT 05, las llamadas API del PROMPT 07 y la estructura de índices del PROMPT 04.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 11: CATÁLOGO Y FILTROS

REQUERIMIENTOS:
1. Filtros Facetados Combinables:
   - Marca, Modelo y Versión en cascada reactiva.
   - Rango de Precio (Mín / Máx con slider interactivo).
   - Rango de Año y Kilometraje máximo.
   - Tipo de Carrocería (SUV, Sedán, Pick-up, Hatchback, etc.).
   - Combustible (Gasolina, Diésel, Híbrido, Eléctrico).
   - Transmisión (Automática, Manual, CVT, etc.).
   - Región o Ciudad de ubicación.
2. Algoritmo de Relevancia y Ponderación de Avisos:
   - Los avisos con plan 'premium' aparecen primero, seguidos por 'destacado' y 'free'.
   - Puntuación de calidad de publicación: autos con inspección certificada (+20 pts) y más de 10 fotos (+10 pts).
3. Opciones de Ordenamiento: Relevancia, Menor Precio, Mayor Precio, Año más reciente, Menor Kilometraje.
4. Sincronización con la URL (Query Params): Los filtros activos deben reflejarse en la URL del navegador permitiendo compartir búsquedas exactas sin recarga.

ENTREGABLE REQUERIDO:
Scope de búsqueda en el modelo Vehicle (VehicleFilterScope o paquete Laravel Pipeline/QueryBuilder) y componente frontend de filtros facetados con debouncing de 300ms.`,
    codeArtifactName: 'VehicleQueryPipeline.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `class VehicleQueryPipeline {
    public function apply(Request $request): Builder {
        return Vehicle::query()
            ->where('status', 'publicado')
            ->when($request->make_id, fn($q, $v) => $q->where('make_id', $v))
            ->when($request->min_price, fn($q, $v) => $q->where('price_usd', '>=', $v))
            ->when($request->max_price, fn($q, $v) => $q->where('price_usd', '<=', $v))
            ->orderByRaw("CASE WHEN plan_id = 'premium' THEN 1 WHEN plan_id = 'destacado' THEN 2 ELSE 3 END")
            ->orderBy('created_at', 'desc');
    }
}`,
    dependencies: ['prompt-04', 'prompt-05', 'prompt-06', 'prompt-07', 'prompt-10'],
  },
  {
    id: 'prompt-12',
    number: '12',
    title: 'Módulo de Leads, Agendamiento de Test-Drive y WhatsApp',
    phase: 'Captura y Gestión de Prospectos',
    scopeSummary: 'Captura de consultas, agendamiento de pruebas de manejo con calendario, integración directa con WhatsApp y tracking de leads.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes respetar el modelo de leads del PROMPT 04, el sistema de mensajería del PROMPT 07 y las vistas de detalle del PROMPT 05.',
    promptContent: `Actúa como Desarrollador Full-Stack Especializado en Embudo de Ventas Automotriz.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar el modelo de leads del PROMPT 04, la arquitectura de eventos del PROMPT 02 y el PDP de vehículos del PROMPT 05.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 12: LEADS Y CONTACTO

REQUERIMIENTOS:
1. Modal de Consulta Rápida: Formulario con nombre, email, teléfono y mensaje personalizable con protección anti-bot (Honeypot o Turnstile).
2. Agendamiento de Test-Drive: Selección de fecha y turno preferente (mañana/tarde), validando que no se solape con reservas previas del vendedor.
3. Botón de WhatsApp Directo con UTM Tracking: Generación de enlace wa.me/{telefono}?text={mensaje} con texto formateado que incluye el modelo, precio y enlace al vehículo publicado.
4. Notificaciones en Tiempo Real: Disparo del evento NewLeadReceivedEvent para enviar correo inmediato al vendedor y notificación interna en su panel.
5. Cotizador y Solicitud de Financiamiento: Cálculo de cuotas mensuales estimadas y envío conjunto de los parámetros crediticios seleccionados como parte del lead.

ENTREGABLE REQUERIDO:
LeadController, LeadNotificationListener con correo Markdown y componente modal interactivo en frontend para envío de consulta y test-drive.`,
    codeArtifactName: 'LeadController.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `public function store(StoreLeadRequest $request, Vehicle $vehicle): JsonResponse {
    $lead = $this->leadService->createLead($request->validated(), $vehicle);
    event(new NewLeadReceivedEvent($lead));
    return $this->apiSuccess(new LeadResource($lead), 'Consulta enviada con éxito', 201);
}`,
    dependencies: ['prompt-04', 'prompt-05', 'prompt-07', 'prompt-11'],
  },
  {
    id: 'prompt-13',
    number: '13',
    title: 'Panel de Control del Vendedor (Particular y Concesionaria)',
    phase: 'Portal de Vendedores & CRM',
    scopeSummary: 'Dashboard con KPIs de ventas, gestión de inventario, pipeline de leads (Kanban), métricas de visitas y wizard de publicación.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes integrar los roles de vendedor del PROMPT 03, el inventario del PROMPT 09, los planes del PROMPT 10 y los leads del PROMPT 12.',
    promptContent: `Actúa como Desarrollador Frontend y Diseñador de Dashboards SaaS.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar los permisos del rol dealer y private_seller del PROMPT 03, las tablas de inventario del PROMPT 04 y los leads del PROMPT 12.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 13: PANEL DEL VENDEDOR

REQUERIMIENTOS:
1. Vista General con Métricas Clave (KPIs):
   - Avisos activos, en pausa y vendidos.
   - Total de visualizaciones del mes con porcentaje de variación (+18%).
   - Leads recibidos agrupados por tipo (consulta, test-drive, oferta).
2. Tabla de Inventario de Vehículos:
   - Búsqueda interna por patente, marca o modelo.
   - Acciones rápidas: pausar/activar, marcar como vendido, editar ficha, subir fotos adicionales, mejorar plan a Destacado/Premium.
3. Bandeja y Pipeline de Leads (CRM Básico):
   - Estados de gestión: Nuevo -> Contactado -> En Negociación -> Concretado -> Descartado.
   - Cambio de estado en un clic y registro de notas de seguimiento.
4. Wizard de Publicación en 5 Pasos:
   - Paso 1: Datos básicos y ubicación.
   - Paso 2: Especificaciones técnicas y kilometraje.
   - Paso 3: Equipamiento de seguridad y confort.
   - Paso 4: Carga y ordenamiento de fotos.
   - Paso 5: Precio y selección del plan de publicación.

ENTREGABLE REQUERIDO:
Componente SellerDashboardComponent con sub-rutas para /dashboard/inventory, /dashboard/leads y /dashboard/publish, con sincronización de estado reactivo.`,
    codeArtifactName: 'seller-dashboard.component.ts',
    codeArtifactLang: 'typescript',
    codeArtifactSnippet: `export class SellerDashboardComponent {
  metrics = signal({ activeVehicles: 12, totalViews: 4520, leadsCount: 38, conversionRate: '4.8%' });
  leads = signal<Lead[]>([]);
  
  updateLeadStatus(leadId: string, status: LeadStatus) {
    this.leadService.updateStatus(leadId, status).subscribe();
  }
}`,
    dependencies: ['prompt-03', 'prompt-04', 'prompt-06', 'prompt-09', 'prompt-10', 'prompt-12'],
  },
  {
    id: 'prompt-14',
    number: '14',
    title: 'Panel de Control del Administrador y Cola de Moderación',
    phase: 'Backoffice Administrativo',
    scopeSummary: 'Moderación de avisos con aprobación/rechazo y motivos, verificación KYC de concesionarias, auditoría de pagos y gestión de usuarios.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes basarte en los roles super_admin y moderator del PROMPT 03, el modelo de datos del PROMPT 04 y las transacciones del PROMPT 10.',
    promptContent: `Actúa como Desarrollador Senior de Sistemas Administrativos y Backoffice.

REGLA DE CONTINUIDAD CRÍTICA:
Debes respetar las facultades exclusivas de los roles super_admin y moderator definidas en el PROMPT 03, interactuando con los modelos del PROMPT 04 y 10.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 14: PANEL ADMINISTRADOR

REQUERIMIENTOS:
1. Cola de Moderación de Avisos:
   - Filtro de publicaciones en estado 'pendiente_aprobacion'.
   - Visor comparativo con foto principal, datos de patente, precio respecto a la media de mercado y reporte de inspección.
   - Acciones: 'Aprobar publicación' o 'Rechazar aviso' especificando el motivo (datos falsos, fotos de baja calidad, precio inconsistente, documentación incompleta).
2. Verificación KYC de Concesionarias y Vendedores:
   - Revisión de comprobantes de domicilio y certificados fiscales de empresas.
   - Asignación de insignia oficial 'Concesionaria Verificada' y configuración de límite de publicaciones.
3. Auditoría Financiera y Reportes:
   - Desglose de ingresos por planes Destacado y Premium.
   - Tasa de aprobación de avisos y tiempos de respuesta de los moderadores.
4. Gestión de Usuarios y Denuncias de Publicaciones:
   - Búsqueda de usuarios, suspensión de cuentas fraudulentas y logs de auditoría de cada acción administrativa.

ENTREGABLE REQUERIDO:
Controlador AdminModerationController, políticas de acceso y componente frontend AdminDashboardComponent con interfaz densa y eficiente para revisión de alto volumen.`,
    codeArtifactName: 'AdminModerationController.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `public function reviewListing(Request $request, Vehicle $vehicle): JsonResponse {
    $request->validate(['action' => 'required|in:approve,reject', 'reason' => 'required_if:action,reject']);
    if ($request->action === 'approve') {
        $vehicle->update(['status' => 'publicado', 'published_at' => now()]);
    } else {
        $vehicle->update(['status' => 'rechazado']);
    }
    AuditLog::record(auth()->user(), "listing.{$request->action}", $vehicle);
    return $this->apiSuccess(null, 'Estado de publicación actualizado');
}`,
    dependencies: ['prompt-03', 'prompt-04', 'prompt-07', 'prompt-10', 'prompt-13'],
  },
  {
    id: 'prompt-15',
    number: '15',
    title: 'Seguridad, Hardening, Protección de Datos y Headers',
    phase: 'Seguridad Integral',
    scopeSummary: 'Protección contra inyecciones SQL, XSS, CSRF, validación de uploads, rate limiting granular, headers de seguridad y encriptación.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes auditar y reforzar todos los módulos construidos en los PROMPTS 02 al 14 sin alterar la funcionalidad existente.',
    promptContent: `Actúa como Consultor en Ciberseguridad de Aplicaciones Web (OWASP Top 10) y DevSecOps.

REGLA DE CONTINUIDAD CRÍTICA:
Debes blindar toda la solución creada desde el PROMPT 01 al PROMPT 14, garantizando que ninguna optimización de seguridad rompa los contratos de la API ni la experiencia de usuario.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 15: SEGURIDAD Y HARDENING

REQUERIMIENTOS:
1. Protección contra Inyecciones y Manipulación:
   - Consultas estrictamente preparadas mediante Eloquent ORM sin raw queries desprotegidas.
   - Sanitización de entradas con HTMLPurifier en descripciones de vehículos para evitar XSS almacenado.
2. Validación Rigurosa de Subida de Archivos:
   - Validación estricta de Magic Bytes en imágenes y PDFs (no confiar únicamente en la extensión del archivo).
   - Bloqueo total de ejecución de scripts en el directorio de almacenamiento.
3. Rate Limiting Granular en Rutas Críticas:
   - /api/v1/auth/login: 5 req/min.
   - /api/v1/vehicles/*/leads: 3 req/min por IP para evitar spam a vendedores.
   - /api/v1/vehicles: 60 req/min para scraping malicioso.
4. Cabeceras de Seguridad HTTP:
   - Content-Security-Policy (CSP), X-Frame-Options: DENY, Strict-Transport-Security (HSTS), X-Content-Type-Options: nosniff.
5. Protección de Datos Personales (GDPR / Leyes Locales):
   - Enmascaramiento de números de teléfono en la interfaz hasta que el comprador inicie la acción de contacto explícitamente.
   - Cifrado en reposo para identificadores fiscales (RUT/DNI).

ENTREGABLE REQUERIDO:
Middleware SecurityHeadersMiddleware, configuración de RateLimiting en AppServiceProvider y checklist de auditoría de seguridad OWASP.`,
    codeArtifactName: 'SecurityHeadersMiddleware.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `public function handle(Request $request, Closure $next): Response {
    $response = $next($request);
    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-Frame-Options', 'DENY');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
    $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
    $response->headers->set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
    return $response;
}`,
    dependencies: ['prompt-02', 'prompt-07', 'prompt-08', 'prompt-12', 'prompt-14'],
  },
  {
    id: 'prompt-16',
    number: '16',
    title: 'Estrategia de Pruebas: Unitarias, Feature y E2E',
    phase: 'Aseguramiento de Calidad (QA) & Testing',
    scopeSummary: 'Suite de pruebas con Pest/PHPUnit para lógica de negocio de backend, y Playwright/Cypress para flujos críticos en frontend.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes diseñar las pruebas basadas fielmente en los requerimientos del PROMPT 01, la arquitectura del PROMPT 02 y los modelos del PROMPT 04.',
    promptContent: `Actúa como Ingeniero de QA y Testing Automation.

REGLA DE CONTINUIDAD CRÍTICA:
Debes diseñar casos de prueba que cubran rigurosamente las reglas de negocio de los PROMPTS 01 al 15, garantizando que el sistema sea inmune a regresiones.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 16: PRUEBAS AUTOMATIZADAS

COBERTURA REQUERIDA:
1. Pruebas Unitarias (Backend PHPUnit / Pest):
   - Cálculo del score de inspección (InspectionCalculatorServiceTest) con ponderaciones exactas.
   - Lógica de asignación de expiración de planes de visibilidad (Free = 30 días, Destacado = 45 días, Premium = 60 días).
   - Cálculo de cuotas y tablas de amortización de financiamiento automotriz.
2. Pruebas de Integración / Feature (Endpoints API):
   - Creación de vehículo con usuario autenticado (retorno 201 Created y campos esperados).
   - Intento de creación con datos faltantes (retorno 422 Unprocessable Entity con mensajes de error).
   - Intento de edición de un vehículo ajeno por otro vendedor (retorno 403 Forbidden).
   - Procesamiento de webhook de pago y cambio de estado a publicado.
3. Pruebas E2E (Playwright / Cypress):
   - Flujo 1: Comprador filtra catálogo por 'BMW', selecciona vehículo, abre calculadora de crédito y envía lead de consulta.
   - Flujo 2: Vendedor completa el wizard de publicación de 5 pasos y selecciona plan Destacado.
   - Flujo 3: Moderador inicia sesión, visualiza aviso pendiente y lo aprueba con éxito.

ENTREGABLE REQUERIDO:
Archivos de prueba ejecutables en Pest/PHPUnit, fixtures de prueba y script de CI para correr la suite completa en cada pull request.`,
    codeArtifactName: 'VehicleApiFeatureTest.php',
    codeArtifactLang: 'php',
    codeArtifactSnippet: `test('vendedor autenticado puede publicar un vehiculo con datos validos', function () {
    $dealer = User::factory()->create(['role' => 'dealer']);
    Sanctum::actingAs($dealer);

    $payload = [
        'make_id' => 1, 'model_id' => 1, 'year' => 2022,
        'price_usd' => 28000, 'mileage_km' => 35000,
        'fuel_type' => 'Gasolina', 'transmission' => 'Automática',
        'body_type' => 'SUV'
    ];

    $response = $this->postJson('/api/v1/vehicles', $payload);
    $response->assertStatus(201)->assertJsonPath('data.price_usd', 28000);
    $this->assertDatabaseHas('vehicles', ['price_usd' => 28000]);
});`,
    dependencies: ['prompt-04', 'prompt-07', 'prompt-08', 'prompt-09', 'prompt-10', 'prompt-12'],
  },
  {
    id: 'prompt-17',
    number: '17',
    title: 'Despliegue, Contenerización, CI/CD y Monitoreo',
    phase: 'DevOps & Producción',
    scopeSummary: 'Dockerfiles multi-etapa para Laravel y SPA, pipeline en GitHub Actions, Nginx con SSL y configuración de producción.',
    strictContinuityClause: 'REGLA DE CONTINUIDAD CRÍTICA: Debes garantizar el despliegue del sistema completo respetando todos los requerimientos y servicios definidos desde el PROMPT 01 hasta el PROMPT 16.',
    promptContent: `Actúa como Ingeniero DevOps y Cloud Architect Senior.

REGLA DE CONTINUIDAD CRÍTICA:
Debes garantizar el despliegue íntegro y optimizado de la plataforma completa construida a lo largo de los PROMPTS 01 al 16, asegurando cero discrepancias entre entornos.

PROYECTO: MARKETPLACE DE VEHÍCULOS USADOS - FASE 17: DESPLIEGUE Y PRODUCCIÓN

REQUERIMIENTOS:
1. Dockerfile Multi-Etapa de Producción:
   - Backend Laravel: Imagen PHP 8.3-FPM ligera con Opcache activado, extensiones pdo_pgsql/pdo_mysql, redis, gd y composer optimizado.
   - Frontend SPA: Compilación con Vite/Angular CLI y servidor Nginx alpine para entrega estática ultrarrápida con compresión Brotli/Gzip y caché de activos con hash.
2. Nginx Reverse Proxy & SSL:
   - Configuración de proxy inverso que enrute /api y /sanctum hacia el contenedor Laravel y el resto hacia la SPA.
   - Configuración de certificados automáticos Let's Encrypt / Certbot.
3. Pipeline CI/CD en GitHub Actions:
   - Pasos automatizados: Linting de código (PHP Pint + ESLint), Ejecución de pruebas unitarias y de integración (Pest), Construcción y escaneo de vulnerabilidades en imágenes Docker, y Despliegue continuo con Zero-Downtime a Kubernetes o VPS Cloud.
4. Monitoreo y Salud del Sistema:
   - Endpoint /healthz de chequeo de conectividad a PostgreSQL, Redis y almacenamiento S3.
   - Rotación y centralización de logs con Laravel Logstash/Papertrail.

ENTREGABLE REQUERIDO:
Dockerfile de backend y frontend de producción, nginx.conf optimizado, workflow completo .github/workflows/deploy.yml y script de despliegue con migraciones automáticas.`,
    codeArtifactName: 'deploy.yml',
    codeArtifactLang: 'yaml',
    codeArtifactSnippet: `name: CI/CD Production Pipeline
on: { push: { branches: [main] } }
jobs:
  test_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with: { php-version: '8.3', extensions: [pdo_pgsql, redis] }
      - run: composer install --no-progress --prefer-dist
      - run: ./vendor/bin/pest
      - name: Build and Push Docker Images
        run: docker compose -f docker-compose.prod.yml build`,
    dependencies: ['prompt-02', 'prompt-15', 'prompt-16'],
  },
];
