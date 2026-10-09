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

    protected $table = 'users';

    protected $fillable = [
        'email',
        'password',
        'status',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (User $user) {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class, 'user_id', 'id');
    }

    /**
     * Roles asignados mediante la tabla polimórfica model_has_roles.
     */
    public function roles(): MorphToMany
    {
        return $this->morphToMany(Role::class, 'model', 'model_has_roles', 'model_id', 'role_id')
            ->using(ModelHasRole::class);
    }

    /**
     * Permisos asignados directamente al usuario mediante model_has_permissions.
     */
    public function permissions(): MorphToMany
    {
        return $this->morphToMany(Permission::class, 'model', 'model_has_permissions', 'model_id', 'permission_id')
            ->using(ModelHasPermission::class);
    }

    public function dealerMemberships(): HasMany
    {
        return $this->hasMany(DealerUser::class, 'user_id', 'id');
    }

    public function dealers(): BelongsToMany
    {
        return $this->belongsToMany(Dealer::class, 'dealer_users', 'user_id', 'dealer_id')
            ->withPivot(['role_in_dealer', 'status'])
            ->withTimestamps();
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class, 'owner_user_id', 'id');
    }

    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class, 'seller_user_id', 'id');
    }

    public function leadsAsSeller(): HasMany
    {
        return $this->hasMany(Lead::class, 'seller_user_id', 'id');
    }

    public function leadsAsBuyer(): HasMany
    {
        return $this->hasMany(Lead::class, 'buyer_user_id', 'id');
    }

    public function conversationsAsBuyer(): HasMany
    {
        return $this->hasMany(Conversation::class, 'buyer_user_id', 'id');
    }

    public function conversationsAsSeller(): HasMany
    {
        return $this->hasMany(Conversation::class, 'seller_user_id', 'id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_user_id', 'id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id', 'id');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class, 'user_id', 'id');
    }

    public function comparisonItems(): HasMany
    {
        return $this->hasMany(UserComparisonItem::class, 'user_id', 'id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'user_id', 'id');
    }

    public function kycDocuments(): HasMany
    {
        return $this->hasMany(UserKycDocument::class, 'user_id', 'id');
    }

    /**
     * Casos de moderación asignados al usuario administrativo responsable.
     * El proceso de moderación es una función administrativa; no constituye un rol independiente.
     * El nombre de la FK se conserva por compatibilidad con el DDL aprobado.
     */
    public function moderationCasesAssigned(): HasMany
    {
        return $this->hasMany(ModerationCase::class, 'assigned_moderator_user_id', 'id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'user_id', 'id');
    }
}
