<?php

namespace App\Http\Controllers;

use App\Models\BodyType;
use App\Models\City;
use App\Models\Color;
use App\Models\Department;
use App\Models\FuelType;
use App\Models\Plan;
use App\Models\Publication;
use App\Models\Transmission;
use App\Models\TractionType;
use App\Models\Vehicle;
use App\Models\VehicleMake;
use App\Models\VehicleModel;
use App\Models\VehicleVersion;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VehicleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $isMine = $request->boolean('mine');

        $query = Vehicle::query()
            ->with([
                'make:id,name',
                'model:id,name',
                'version:id,name',
                'fuelType:id,name',
                'transmission:id,name',
                'bodyType:id,name',
                'color:id,name',
                'tractionType:id,name',
                'city:id,name',
                'publications' => function ($q) use ($isMine): void {
                    $q->with('plan:id,code')
                        ->when(!$isMine, fn ($publicationQuery) => $publicationQuery->where('status', 'publicado'))
                        ->latest('id');
                },
            ])
            ->whereNull('vehicles.deleted_at');

        if ($isMine) {
            abort_unless($request->user(), 401);
            $query->where('owner_user_id', $request->user()->id);
        } else {
            $query->whereHas('publications', fn (Builder $q) => $q->where('status', 'publicado'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function (Builder $q) use ($search): void {
                $q->where('year', 'like', "%{$search}%")
                    ->orWhereHas('make', fn (Builder $q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('model', fn (Builder $q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        $perPage = min(max((int) $request->input('per_page', 12), 1), 48);
        $vehicles = $query->latest('vehicles.id')->paginate($perPage);

        return response()->json([
            'data' => collect($vehicles->items())
                ->map(fn (Vehicle $vehicle) => $this->vehicleDto($vehicle))
                ->values(),
            'meta' => [
                'current_page' => $vehicles->currentPage(),
                'last_page' => $vehicles->lastPage(),
                'per_page' => $vehicles->perPage(),
                'total' => $vehicles->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user, 401);

        $role = $user->roles()->whereIn('name', ['vendedor_particular', 'concesionario'])->first();
        abort_unless($role, 403, 'Solo un vendedor particular o concesionario puede registrar vehículos.');

        $validated = $request->validate([
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'version' => ['nullable', 'string', 'max:150'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . ((int) date('Y') + 1)],
            'mileage_km' => ['required', 'integer', 'min:0'],
            'fuel_type' => ['required', 'string', 'max:80'],
            'transmission' => ['required', 'string', 'max:80'],
            'body_type' => ['required', 'string', 'max:80'],
            'color' => ['required', 'string', 'max:80'],
            'traction' => ['nullable', 'string', 'max:40'],
            'doors' => ['nullable', 'integer', 'min:2', 'max:8'],
            'passengers' => ['nullable', 'integer', 'min:1', 'max:20'],
            'engine' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'price_cop' => ['required', 'numeric', 'min:0', 'max:999999999999.99'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:10000'],
            'plan' => ['nullable', 'string', 'max:50'],
            'is_negotiable' => ['nullable', 'boolean'],
            'plate_snippet' => ['nullable', 'string', 'max:20'],
            'vin_snippet' => ['nullable', 'string', 'max:20'],
        ]);

        $result = DB::transaction(function () use ($validated, $user): array {
            $bodyType = BodyType::firstOrCreate(
                ['slug' => Str::slug($validated['body_type'])],
                ['name' => $validated['body_type'], 'is_active' => true]
            );

            $make = VehicleMake::firstOrCreate(
                ['slug' => Str::slug($validated['make'])],
                ['name' => $validated['make'], 'is_active' => true]
            );

            $model = VehicleModel::firstOrCreate(
                ['make_id' => $make->id, 'slug' => Str::slug($validated['model'])],
                ['body_type_id' => $bodyType->id, 'name' => $validated['model'], 'is_active' => true]
            );
            $model->body_type_id = $bodyType->id;
            $model->save();

            $version = null;
            if (!empty($validated['version'])) {
                $version = VehicleVersion::firstOrCreate(
                    ['model_id' => $model->id, 'slug' => Str::slug($validated['version'])],
                    ['name' => $validated['version'], 'is_active' => true]
                );
            }

            $fuel = FuelType::firstOrCreate(
                ['slug' => Str::slug($validated['fuel_type'])],
                ['name' => $validated['fuel_type'], 'is_active' => true]
            );
            $transmission = Transmission::firstOrCreate(
                ['slug' => Str::slug($validated['transmission'])],
                ['name' => $validated['transmission'], 'is_active' => true]
            );
            $color = Color::firstOrCreate(
                ['slug' => Str::slug($validated['color'])],
                ['name' => $validated['color'], 'is_active' => true]
            );

            $traction = null;
            if (!empty($validated['traction'])) {
                $traction = TractionType::firstOrCreate(
                    ['slug' => Str::slug($validated['traction'])],
                    ['name' => $validated['traction'], 'is_active' => true]
                );
            }

            $city = City::query()
                ->whereRaw('LOWER(name) = ?', [mb_strtolower($validated['city'])])
                ->first();

            if (!$city) {
                $department = Department::firstOrCreate(
                    ['code' => '99'],
                    ['name' => 'Pendiente de clasificar', 'is_active' => true]
                );
                $city = City::create([
                    'department_id' => $department->id,
                    'code' => 'AUTO-' . strtoupper(Str::random(8)),
                    'name' => $validated['city'],
                    'is_active' => true,
                ]);
            }

            $dealerId = $user->dealers()->wherePivot('status', 'active')->value('dealers.id');

            $vehicle = Vehicle::create([
                'owner_user_id' => $user->id,
                'dealer_id' => $dealerId,
                'make_id' => $make->id,
                'model_id' => $model->id,
                'version_id' => $version?->id,
                'year' => $validated['year'],
                'mileage_km' => $validated['mileage_km'],
                'vin_snippet' => $validated['vin_snippet'] ?? null,
                'plate_snippet' => $validated['plate_snippet'] ?? null,
                'engine_spec' => $validated['engine'] ?? null,
                'fuel_type_id' => $fuel->id,
                'transmission_id' => $transmission->id,
                'body_type_id' => $bodyType->id,
                'color_id' => $color->id,
                'traction_id' => $traction?->id,
                'doors' => $validated['doors'] ?? null,
                'passengers' => $validated['passengers'] ?? null,
                'city_id' => $city->id,
                'condition_status' => 'usado',
            ]);

            $planCode = $validated['plan'] ?? 'destacado';
            $planDefaults = [
                'free' => ['name' => 'Básico', 'price_amount' => 0, 'duration_days' => 30, 'max_photos' => 8, 'is_featured' => false],
                'destacado' => ['name' => 'Destacado', 'price_amount' => 29000, 'duration_days' => 45, 'max_photos' => 18, 'is_featured' => true],
                'premium' => ['name' => 'Premium Oro', 'price_amount' => 59000, 'duration_days' => 45, 'max_photos' => 30, 'is_featured' => true],
            ];
            $planConfig = $planDefaults[$planCode] ?? $planDefaults['destacado'];

            $plan = Plan::firstOrCreate(
                ['code' => $planCode],
                array_merge($planConfig, [
                    'description' => 'Plan de publicación AutoMarket Pro',
                    'target' => 'publication',
                    'price_currency' => 'COP',
                    'max_listings' => null,
                    'is_active' => true,
                ])
            );

            $title = $validated['title'] ?? trim($validated['make'] . ' ' . $validated['model'] . ' ' . ($validated['version'] ?? ''));
            $publication = Publication::create([
                'vehicle_id' => $vehicle->id,
                'seller_user_id' => $user->id,
                'dealer_id' => $dealerId,
                'plan_id' => $plan->id,
                'title' => $title,
                'slug' => Str::slug($title) . '-' . $vehicle->uuid,
                'description' => $validated['description'] ?? null,
                'price_amount' => $validated['price_cop'],
                'is_negotiable' => (bool) ($validated['is_negotiable'] ?? false),
                'is_featured' => (bool) $plan->is_featured,
                'status' => 'pendiente',
                'expires_at' => now()->addDays((int) $plan->duration_days),
            ]);

            $vehicle->load([
                'make:id,name', 'model:id,name', 'version:id,name', 'fuelType:id,name',
                'transmission:id,name', 'bodyType:id,name', 'color:id,name', 'tractionType:id,name',
                'city:id,name', 'publications' => fn ($q) => $q->with('plan:id,code')->whereKey($publication->id),
            ]);

            return [$vehicle, $publication];
        });

        return response()->json([
            'message' => 'Vehículo registrado correctamente y enviado a aprobación.',
            'data' => $this->vehicleDto($result[0]),
        ], 201);
    }

    private function vehicleDto(Vehicle $vehicle): array
    {
        $publication = $vehicle->publications->first();

        return [
            'id' => (string) $vehicle->id,
            'uuid' => $vehicle->uuid,
            'title' => $publication?->title ?? trim(($vehicle->make?->name ?? '') . ' ' . ($vehicle->model?->name ?? '')),
            'make' => $vehicle->make?->name,
            'model' => $vehicle->model?->name,
            'version' => $vehicle->version?->name,
            'year' => $vehicle->year,
            'priceCop' => $publication ? (float) $publication->price_amount : null,
            'mileageKm' => $vehicle->mileage_km,
            'fuelType' => $vehicle->fuelType?->name,
            'transmission' => $vehicle->transmission?->name,
            'bodyType' => $vehicle->bodyType?->name,
            'doors' => $vehicle->doors,
            'passengers' => $vehicle->passengers,
            'engine' => $vehicle->engine_spec,
            'traction' => $vehicle->tractionType?->name,
            'color' => $vehicle->color?->name,
            'city' => $vehicle->city?->name,
            'region' => null,
            'images' => [],
            'features' => [],
            'description' => $publication?->description ?? '',
            'status' => $publication?->status === 'pendiente' ? 'pendiente_aprobacion' : ($publication?->status ?? 'publicado'),
            'plan' => $publication?->plan?->code,
            'planExpiresAt' => $publication?->expires_at?->toDateString(),
            'viewsCount' => $publication?->views_count ?? 0,
            'leadsCount' => $publication?->leads_count ?? 0,
            'publishedAt' => $publication?->published_at?->toDateString(),
            'isFeatured' => (bool) ($publication?->is_featured ?? false),
            'vinSnippet' => $vehicle->vin_snippet,
            'plateSnippet' => $vehicle->plate_snippet,
        ];
    }
}
