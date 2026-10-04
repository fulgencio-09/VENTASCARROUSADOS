<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class VehicleVersion extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'vehicle_versions';

    /**
     * Clave primaria id autoincremental estándar (el UUID no reemplaza la PK).
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Timestamps activos (created_at, updated_at).
     * No posee SoftDeletes.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Atributos asignables en masa.
     * Excluye id, uuid (generado por aplicación) y timestamps.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'model_id',
        'name',
        'slug',
        'is_active',
    ];

    /**
     * Casteo estricto de atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Boot del modelo para generación automática de UUID v4 de 36 caracteres al crear.
     */
    protected static function booted(): void
    {
        static::creating(function (VehicleVersion $version) {
            if (empty($version->uuid)) {
                $version->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Modelo de vehículo al que pertenece esta versión específica.
     */
    public function model(): BelongsTo
    {
        return $this->belongsTo(VehicleModel::class, 'model_id', 'id');
    }

    /**
     * Vehículos físicos registrados asociados a esta versión comercial.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class, 'version_id', 'id');
    }
}
