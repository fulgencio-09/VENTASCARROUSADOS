<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'messages';

    /**
     * Clave primaria estándar autoincremental.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Desactiva la columna updated_at ya que la tabla solo maneja fecha de creación.
     *
     * @var string|null
     */
    public const UPDATED_AT = null;

    /**
     * Atributos asignables en masa.
     * Excluye id y created_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'conversation_id',
        'sender_user_id',
        'body',
        'read_at',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    /**
     * Conversación a la que pertenece el mensaje.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class, 'conversation_id', 'id');
    }

    /**
     * Usuario remitente del mensaje.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_user_id', 'id');
    }
}
