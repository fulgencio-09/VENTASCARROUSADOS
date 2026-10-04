<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class VehicleFeature extends Pivot
{
    /**
     * Tabla pivote asociada.
     *
     * @var string
     */
    protected $table = 'vehicle_features';

    /**
     * La tabla pivote no tiene una clave primaria autoincremental única simple.
     * La migración 0026 define PRIMARY KEY (vehicle_id, feature_id).
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * La migración 0026 no define columnas timestamps.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Atributos asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vehicle_id',
        'feature_id',
    ];

    /**
     * Sobrescritura para resolución determinística de operaciones de persistencia/eliminación
     * sobre la clave primaria compuesta (vehicle_id, feature_id) sin invocar columna id.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery($query): Builder
    {
        return $query
            ->where('vehicle_id', '=', $this->getAttribute('vehicle_id'))
            ->where('feature_id', '=', $this->getAttribute('feature_id'));
    }

    /**
     * Vehículo físico al que se asocia la característica.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'id');
    }

    /**
     * Característica o equipamiento asignado.
     */
    public function feature(): BelongsTo
    {
        return $this->belongsTo(Feature::class, 'feature_id', 'id');
    }
}
