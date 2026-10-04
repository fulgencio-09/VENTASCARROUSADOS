<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'vehicles';

    /**
     * Clave primaria id autoincremental estándar (el UUID no reemplaza la PK).
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Timestamps activos (created_at, updated_at).
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Atributos asignables en masa.
     * Excluye id, uuid (generado por aplicación), timestamps y deleted_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'owner_user_id',
        'dealer_id',
        'make_id',
        'model_id',
        'version_id',
        'year',
        'mileage_km',
        'vin_encrypted',
        'vin_hash',
        'vin_snippet',
        'plate_snippet',
        'engine_spec',
        'fuel_type_id',
        'transmission_id',
        'body_type_id',
        'color_id',
        'traction_id',
        'doors',
        'passengers',
        'city_id',
        'inspection_score',
        'condition_status',
    ];

    /**
     * Atributos ocultos en la serialización.
     * Protección absoluta de datos sensibles: el VIN cifrado y su hash nunca se exponen públicamente.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'vin_encrypted',
        'vin_hash',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'mileage_km' => 'integer',
            'doors' => 'integer',
            'passengers' => 'integer',
            'inspection_score' => 'integer',
        ];
    }

    /**
     * Boot del modelo para generación automática de UUID v4 de 36 caracteres al crear.
     */
    protected static function booted(): void
    {
        static::creating(function (Vehicle $vehicle) {
            if (empty($vehicle->uuid)) {
                $vehicle->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Propietario o vendedor particular titular del activo físico.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id', 'id');
    }

    /**
     * Concesionario al que pertenece el vehículo si forma parte de un inventario corporativo.
     */
    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class, 'dealer_id', 'id');
    }

    /**
     * Marca fabricante del vehículo.
     */
    public function make(): BelongsTo
    {
        return $this->belongsTo(VehicleMake::class, 'make_id', 'id');
    }

    /**
     * Modelo del vehículo.
     */
    public function model(): BelongsTo
    {
        return $this->belongsTo(VehicleModel::class, 'model_id', 'id');
    }

    /**
     * Versión comercial del vehículo.
     */
    public function version(): BelongsTo
    {
        return $this->belongsTo(VehicleVersion::class, 'version_id', 'id');
    }

    /**
     * Tipo de carrocería (Sedán, SUV, Hatchback, etc.).
     */
    public function bodyType(): BelongsTo
    {
        return $this->belongsTo(BodyType::class, 'body_type_id', 'id');
    }

    /**
     * Tipo de combustible (Gasolina, Diésel, Híbrido, Eléctrico, etc.).
     */
    public function fuelType(): BelongsTo
    {
        return $this->belongsTo(FuelType::class, 'fuel_type_id', 'id');
    }

    /**
     * Tipo de transmisión (Mecánica, Automática, etc.).
     */
    public function transmission(): BelongsTo
    {
        return $this->belongsTo(Transmission::class, 'transmission_id', 'id');
    }

    /**
     * Tipo de tracción (4x2, 4x4, AWD, etc.).
     */
    public function tractionType(): BelongsTo
    {
        return $this->belongsTo(TractionType::class, 'traction_id', 'id');
    }

    /**
     * Color de carrocería.
     */
    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class, 'color_id', 'id');
    }

    /**
     * Ciudad o municipio de radicación del vehículo.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }

    /**
     * Características y equipamiento con el que cuenta el vehículo.
     */
    public function features(): BelongsToMany
    {
        return $this->belongsToMany(
            Feature::class,
            'vehicle_features',
            'vehicle_id',
            'feature_id'
        )->using(VehicleFeature::class);
    }

    /**
     * Peritajes e inspecciones mecánicas realizadas al activo físico.
     */
    public function inspections(): HasMany
    {
        return $this->hasMany(VehicleInspection::class, 'vehicle_id', 'id');
    }

    /**
     * Publicaciones comerciales (actuales e históricas) asociadas a este vehículo.
     */
    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class, 'vehicle_id', 'id');
    }
}
