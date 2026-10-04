<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentWebhookLog extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'payment_webhook_logs';

    /**
     * Clave primaria id autoincremental estándar.
     * NO posee UUID.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Timestamps automáticos desactivados.
     * La migración 0034 posee created_at pero NO posee updated_at ni SoftDeletes.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Atributos asignables en masa.
     * Excluye id.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'gateway',
        'event_id',
        'idempotency_key',
        'payload',
        'signature',
        'status',
        'error_message',
        'processed_at',
        'created_at',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'processed_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    /**
     * IMPORTANTE: No posee relaciones Eloquent.
     * Esta tabla registra eventos de webhook de pasarela desacoplados de Payments existentes.
     */
}
