<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleModel extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'vehicle_models';

    /**
     * Clave primaria id autoincremental estándar.
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
     * Excluye id y timestamps.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'make_id',
        'body_type_id',
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
     * Marca fabricante a la que pertenece el modelo.
     */
    public function make(): BelongsTo
    {
        return $this->belongsTo(VehicleMake::class, 'make_id', 'id');
    }

    /**
     * Tipo de carrocería base asignado a este modelo.
     */
    public function bodyType(): BelongsTo
    {
        return $this->belongsTo(BodyType::class, 'body_type_id', 'id');
    }

    /**
     * Versiones comerciales y niveles de equipamiento asociadas a este modelo.
     */
    public function versions(): HasMany
    {
        return $this->hasMany(VehicleVersion::class, 'model_id', 'id');
    }

    /**
     * Vehículos físicos registrados correspondientes a este modelo.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class, 'model_id', 'id');
    }
}
