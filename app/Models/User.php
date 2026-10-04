<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * Tabla asociada al modelo en base de datos.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * Atributos asignables en masa.
     * Excluye id (PK), uuid (generado por app), timestamps y deleted_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'status',
        'email_verified_at',
    ];

    /**
     * Atributos ocultos en la serialización.
     * Nota: remember_token no se incluye porque dicha columna no existe en la migración 0012.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }

    /**
     * Boot del modelo para inicialización de UUID v4 de 36 caracteres al crear.
     */
    protected static function booted(): void
    {
        static::creating(function (User $user) {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Perfil individual del usuario (1:1).
     */
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class, 'user_id', 'id');
    }

    /**
     * Roles asignados mediante la tabla polimórfica model_has_roles.
     * Se enlaza explícitamente a la clase MorphPivot personalizada ModelHasRole.
     */
    public function roles(): MorphToMany
    {
        return $this->morphToMany(Role::class, 'model', 'model_has_roles', 'model_id', 'role_id')
            ->using(ModelHasRole::class);
    }

    /**
     * Permisos asignados directamente al usuario mediante model_has_permissions.
     * Se enlaza explícitamente a la clase MorphPivot personalizada ModelHasPermission.
     */
    public function permissions(): MorphToMany
    {
        return $this->morphToMany(Permission::class, 'model', 'model_has_permissions', 'model_id', 'permission_id')
            ->using(ModelHasPermission::class);
    }

    /**
     * Membresías en concesionarios (tabla pivote dealer_users).
     */
    public function dealerMemberships(): HasMany
    {
        return $this->hasMany(DealerUser::class, 'user_id', 'id');
    }

    /**
     * Concesionarios a los que pertenece el usuario.
     */
    public function dealers(): BelongsToMany
    {
        return $this->belongsToMany(Dealer::class, 'dealer_users', 'user_id', 'dealer_id')
            ->withPivot(['role_in_dealer', 'status'])
            ->withTimestamps();
    }

    /**
     * Vehículos registrados bajo titularidad de este usuario.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class, 'owner_user_id', 'id');
    }

    /**
     * Publicaciones comerciales publicadas por el usuario.
     */
    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class, 'seller_user_id', 'id');
    }

    /**
     * Prospectos (leads) donde el usuario es el vendedor que recibe el interés.
     */
    public function leadsAsSeller(): HasMany
    {
        return $this->hasMany(Lead::class, 'seller_user_id', 'id');
    }

    /**
     * Prospectos (leads) donde el usuario es el comprador interesado.
     */
    public function leadsAsBuyer(): HasMany
    {
        return $this->hasMany(Lead::class, 'buyer_user_id', 'id');
    }

    /**
     * Conversaciones de chat donde el usuario participa como comprador.
     */
    public function conversationsAsBuyer(): HasMany
    {
        return $this->hasMany(Conversation::class, 'buyer_user_id', 'id');
    }

    /**
     * Conversaciones de chat donde el usuario participa como vendedor.
     */
    public function conversationsAsSeller(): HasMany
    {
        return $this->hasMany(Conversation::class, 'seller_user_id', 'id');
    }

    /**
     * Mensajes de chat emitidos por el usuario.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_user_id', 'id');
    }

    /**
     * Notificaciones dirigidas al usuario.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id', 'id');
    }

    /**
     * Publicaciones agregadas a favoritos por el usuario.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class, 'user_id', 'id');
    }

    /**
     * Ítems agregados al comparador vehicular por el usuario.
     */
    public function comparisonItems(): HasMany
    {
        return $this->hasMany(UserComparisonItem::class, 'user_id', 'id');
    }

    /**
     * Trazas de auditoría provocadas por acciones del usuario.
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'user_id', 'id');
    }

    /**
     * Documentos KYC de verificación de identidad cargados por el usuario.
     */
    public function kycDocuments(): HasMany
    {
        return $this->hasMany(UserKycDocument::class, 'user_id', 'id');
    }

    /**
     * Casos de moderación asignados al usuario en su rol de moderador.
     */
    public function moderationCasesAssigned(): HasMany
    {
        return $this->hasMany(ModerationCase::class, 'assigned_moderator_user_id', 'id');
    }

    /**
     * Órdenes y transacciones de cobro realizadas por el usuario.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'user_id', 'id');
    }
}
