<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BodyType extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'body_types';

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
     * Modelos de vehículos asociados a este tipo de carrocería (Sedán, SUV, Hatchback, etc.).
     */
    public function vehicleModels(): HasMany
    {
        return $this->hasMany(VehicleModel::class, 'body_type_id', 'id');
    }

    /**
     * Vehículos físicos registrados con esta tipología de carrocería.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class, 'body_type_id', 'id');
    }
}
