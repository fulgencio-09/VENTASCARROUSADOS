<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Payment extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'payments';

    /**
     * Clave primaria id autoincremental estándar (el UUID no reemplaza la PK).
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Timestamps activos (created_at, updated_at).
     * No posee SoftDeletes.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Atributos asignables en masa.
     * Excluye id, uuid (generado por aplicación) y timestamps.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'publication_id',
        'dealer_subscription_id',
        'concept',
        'amount',
        'currency',
        'internal_reference',
        'status',
        'description',
        'paid_at',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     * amount se castea a decimal:2 para preservar precisión exacta en COP sin conversión flotante.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * Boot del modelo para generación automática de UUID v4 de 36 caracteres al crear.
     */
    protected static function booted(): void
    {
        static::creating(function (Payment $payment) {
            if (empty($payment->uuid)) {
                $payment->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Usuario titular o pagador que ejecuta la orden.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Publicación asociada si el concepto es publicación o destaque.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }

    /**
     * Suscripción de concesionario asociada si el concepto es suscripcion_dealer.
     */
    public function dealerSubscription(): BelongsTo
    {
        return $this->belongsTo(DealerSubscription::class, 'dealer_subscription_id', 'id');
    }

    /**
     * Transacciones e intentos de procesamiento registrados en pasarela de pagos.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class, 'payment_id', 'id');
    }

    /**
     * Reembolsos asociados a esta orden de pago.
     */
    public function refunds(): HasMany
    {
        return $this->hasMany(Refund::class, 'payment_id', 'id');
    }
}
