<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'payment_transactions';

    /**
     * Clave primaria id autoincremental estándar.
     * NO posee UUID.
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
     * Excluye id y timestamps.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'payment_id',
        'gateway',
        'gateway_transaction_id',
        'gateway_reference',
        'amount',
        'currency',
        'status',
        'response_payload',
        'processed_at',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     * amount se castea a decimal:2 para conservar la precisión monetaria exacta.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'response_payload' => 'array',
            'processed_at' => 'datetime',
        ];
    }

    /**
     * Fuerza la moneda oficial de AutoMarket Pro en cada transacción.
     * Las transacciones de pago nunca deben registrarse en USD u otra moneda.
     */
    protected static function booted(): void
    {
        static::creating(function (PaymentTransaction $transaction) {
            $transaction->currency = 'COP';
        });

        static::saving(function (PaymentTransaction $transaction) {
            $transaction->currency = 'COP';
        });
    }

    /**
     * Orden de pago principal a la que pertenece esta transacción.
     * NO posee relaciones directas con users, publications o dealers.
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class, 'payment_id', 'id');
    }
}
