<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleMake extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'vehicle_makes';

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
        'logo_media_id',
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
     * Modelos de vehículos pertenecientes a esta marca fabricante.
     */
    public function models(): HasMany
    {
        return $this->hasMany(VehicleModel::class, 'make_id', 'id');
    }

    /**
     * Vehículos físicos registrados bajo esta marca fabricante.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class, 'make_id', 'id');
    }

    /**
     * Archivo multimedia asignado como logotipo oficial de la marca.
     */
    public function logoMedia(): BelongsTo
    {
        return $this->belongsTo(MediaFile::class, 'logo_media_id', 'id');
    }
}
