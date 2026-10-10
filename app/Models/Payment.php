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

    protected $table = 'payments';
    protected $primaryKey = 'id';
    public $timestamps = true;

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

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Payment $payment) {
            if (empty($payment->uuid)) {
                $payment->uuid = (string) Str::uuid();
            }

            // Regla financiera global: AutoMarket Pro opera exclusivamente en COP.
            $payment->currency = 'COP';
        });

        static::saving(function (Payment $payment) {
            // Impide que una integración, formulario o proceso interno registre USD
            // u otra moneda en una orden de pago de la plataforma.
            $payment->currency = 'COP';
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }

    public function dealerSubscription(): BelongsTo
    {
        return $this->belongsTo(DealerSubscription::class, 'dealer_subscription_id', 'id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class, 'payment_id', 'id');
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(Refund::class, 'payment_id', 'id');
    }
}
