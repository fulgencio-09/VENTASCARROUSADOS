<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Permission extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'permissions';

    /**
     * Atributos asignables en masa.
     * Excluye id y timestamps.
     * No posee SoftDeletes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'guard_name',
        'description',
    ];

    /**
     * Roles que tienen asignado este permiso mediante la tabla role_has_permissions.
     * Se enlaza explícitamente a la clase Pivot personalizada RoleHasPermission.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            Role::class,
            'role_has_permissions',
            'permission_id',
            'role_id'
        )->using(RoleHasPermission::class);
    }

    /**
     * Usuarios que tienen asignado directamente este permiso mediante model_has_permissions.
     * Se enlaza explícitamente a la clase MorphPivot personalizada ModelHasPermission.
     */
    public function users(): MorphToMany
    {
        return $this->morphedByMany(
            User::class,
            'model',
            'model_has_permissions',
            'permission_id',
            'model_id'
        )->using(ModelHasPermission::class);
    }
}
