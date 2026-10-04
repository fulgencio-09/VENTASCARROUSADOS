<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RoleHasPermission extends Pivot
{
    /**
     * Tabla pivote asociada.
     *
     * @var string
     */
    protected $table = 'role_has_permissions';

    /**
     * La tabla pivote no tiene una clave primaria autoincremental única simple.
     * La migración 0018 define PRIMARY KEY (permission_id, role_id).
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * La migración 0018 no define columnas timestamps.
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
        'role_id',
    ];

    /**
     * Sobrescritura para resolución determinística de operaciones de persistencia/eliminación
     * sobre la clave primaria compuesta (permission_id, role_id) sin invocar columna id.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery($query): Builder
    {
        return $query
            ->where('permission_id', '=', $this->getAttribute('permission_id'))
            ->where('role_id', '=', $this->getAttribute('role_id'));
    }

    /**
     * Permiso asociado a la asignación de rol.
     */
    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class, 'permission_id', 'id');
    }

    /**
     * Rol asociado a la asignación de permiso.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }
}
