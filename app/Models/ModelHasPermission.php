<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphPivot;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ModelHasPermission extends MorphPivot
{
    /**
     * Tabla pivote polimórfica asociada.
     *
     * @var string
     */
    protected $table = 'model_has_permissions';

    /**
     * La tabla pivote no tiene una clave primaria autoincremental única simple.
     * La migración 0017 define PRIMARY KEY (permission_id, model_id, model_type).
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * La migración 0017 no define columnas timestamps.
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
        'permission_id',
        'model_type',
        'model_id',
    ];

    /**
     * Sobrescritura para resolución determinística de operaciones de persistencia/eliminación
     * sobre la clave primaria compuesta (permission_id, model_id, model_type) sin invocar columna id.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery($query): Builder
    {
        return $query
            ->where('permission_id', '=', $this->getAttribute('permission_id'))
            ->where('model_id', '=', $this->getAttribute('model_id'))
            ->where('model_type', '=', $this->getAttribute('model_type'));
    }

    /**
     * Permiso asociado a la asignación.
     */
    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class, 'permission_id', 'id');
    }

    /**
     * Entidad polimórfica que recibe el permiso (comúnmente User).
     */
    public function model(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'model_type', 'model_id');
    }
}
