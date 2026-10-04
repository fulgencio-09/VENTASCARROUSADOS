<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DealerSubscription extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'dealer_subscriptions';

    /**
     * Atributos asignables en masa.
     * Excluye id y timestamps.
     * No posee SoftDeletes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'dealer_id',
        'plan_id',
        'status',
        'starts_at',
        'ends_at',
        'cancelled_at',
    ];

    /**
     * Casteo de atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    /**
     * Concesionario titular de la suscripción.
     */
    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class, 'dealer_id', 'id');
    }

    /**
     * Plan comercial contratado.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'id');
    }

    /**
     * Órdenes de pago asociadas a esta suscripción.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'dealer_subscription_id', 'id');
    }
}
