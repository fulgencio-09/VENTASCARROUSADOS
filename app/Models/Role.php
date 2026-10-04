<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Role extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'roles';

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
     * Permisos asignados al rol mediante tabla intermedia role_has_permissions.
     * Se enlaza explícitamente a la clase Pivot personalizada RoleHasPermission.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class,
            'role_has_permissions',
            'role_id',
            'permission_id'
        )->using(RoleHasPermission::class);
    }

    /**
     * Usuarios asignados al rol mediante la tabla polimórfica model_has_roles.
     * Se enlaza explícitamente a la clase MorphPivot personalizada ModelHasRole.
     */
    public function users(): MorphToMany
    {
        return $this->morphedByMany(
            User::class,
            'model',
            'model_has_roles',
            'role_id',
            'model_id'
        )->using(ModelHasRole::class);
    }
}
