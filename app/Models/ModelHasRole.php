<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphPivot;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ModelHasRole extends MorphPivot
{
    /**
     * Tabla pivote polimórfica asociada.
     *
     * @var string
     */
    protected $table = 'model_has_roles';

    /**
     * La tabla pivote no tiene una clave primaria autoincremental única simple.
     * La migración 0016 define PRIMARY KEY (role_id, model_id, model_type).
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * La migración 0016 no define columnas timestamps.
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
        'role_id',
        'model_type',
        'model_id',
    ];

    /**
     * Sobrescritura para resolución determinística de operaciones de persistencia/eliminación
     * sobre la clave primaria compuesta (role_id, model_id, model_type) sin invocar columna id.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery($query): Builder
    {
        return $query
            ->where('role_id', '=', $this->getAttribute('role_id'))
            ->where('model_id', '=', $this->getAttribute('model_id'))
            ->where('model_type', '=', $this->getAttribute('model_type'));
    }

    /**
     * Rol asociado a la asignación.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }

    /**
     * Entidad polimórfica que recibe el rol (comúnmente User).
     */
    public function model(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'model_type', 'model_id');
    }
}
