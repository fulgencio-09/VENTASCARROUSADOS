<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conversation extends Model
{
    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'conversations';

    /**
     * Clave primaria estándar autoincremental.
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
     * Excluye id, created_at y updated_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'publication_id',
        'buyer_user_id',
        'seller_user_id',
        'status',
        'last_message_at',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    /**
     * Publicación vehicular sobre la que se desarrolla la conversación.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }

    /**
     * Usuario interesado que actúa como comprador.
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_user_id', 'id');
    }

    /**
     * Usuario vendedor titular de la publicación vehicular.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_user_id', 'id');
    }
}
