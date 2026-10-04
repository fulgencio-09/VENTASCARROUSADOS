<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Dealer extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'dealers';

    /**
     * Atributos asignables en masa.
     * Excluye id, uuid (generado por aplicación), timestamps y deleted_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'legal_name',
        'commercial_name',
        'nit',
        'email',
        'phone',
        'whatsapp',
        'website',
        'logo_media_id',
        'banner_media_id',
        'city_id',
        'address',
        'status',
        'verified_at',
    ];

    /**
     * Casteo de atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Boot del modelo para generación automática de UUID en creación si no está establecido.
     */
    protected static function booted(): void
    {
        static::creating(function (Dealer $dealer) {
            if (empty($dealer->uuid)) {
                $dealer->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Usuarios vinculados al concesionario (miembros de equipo).
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'dealer_users', 'dealer_id', 'user_id')
            ->withPivot(['role_in_dealer', 'status'])
            ->withTimestamps();
    }

    /**
     * Membresías de usuario en el concesionario (registros pivote dealer_users).
     */
    public function dealerUsers(): HasMany
    {
        return $this->hasMany(DealerUser::class, 'dealer_id', 'id');
    }

    /**
     * Sedes físicas o sucursales del concesionario.
     */
    public function branches(): HasMany
    {
        return $this->hasMany(DealerBranch::class, 'dealer_id', 'id');
    }

    /**
     * Suscripciones a planes comerciales contratadas por el concesionario.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(DealerSubscription::class, 'dealer_id', 'id');
    }

    /**
     * Vehículos en inventario registrados a nombre del concesionario.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class, 'dealer_id', 'id');
    }

    /**
     * Publicaciones comerciales activas o históricas del concesionario.
     */
    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class, 'dealer_id', 'id');
    }

    /**
     * Prospectos comerciales (leads) recibidos por el concesionario.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'dealer_id', 'id');
    }

    /**
     * Pagos vinculados al concesionario a través de sus suscripciones.
     * Nota: La tabla payments no posee dealer_id directo; se relaciona vía dealer_subscriptions.
     */
    public function paymentsThroughSubscriptions(): HasManyThrough
    {
        return $this->hasManyThrough(
            Payment::class,
            DealerSubscription::class,
            'dealer_id',
            'dealer_subscription_id',
            'id',
            'id'
        );
    }

    /**
     * Ciudad sede principal del concesionario.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }

    /**
     * Archivo multimedia asignado como logotipo del concesionario.
     */
    public function logoMedia(): BelongsTo
    {
        return $this->belongsTo(MediaFile::class, 'logo_media_id', 'id');
    }

    /**
     * Archivo multimedia asignado como banner institucional del concesionario.
     */
    public function bannerMedia(): BelongsTo
    {
        return $this->belongsTo(MediaFile::class, 'banner_media_id', 'id');
    }
}
