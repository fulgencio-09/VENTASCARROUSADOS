<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModerationHistory extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'moderation_history';

    /**
     * Clave primaria id autoincremental estándar.
     * NO posee UUID.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Timestamps automáticos desactivados.
     * La migración 0037 posee created_at pero NO posee updated_at ni SoftDeletes.
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
        'moderation_case_id',
        'moderator_user_id',
        'from_status',
        'to_status',
        'decision',
        'reason',
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
            'created_at' => 'datetime',
        ];
    }

    /**
     * Caso de moderación al que pertenece este registro de historial.
     */
    public function moderationCase(): BelongsTo
    {
        return $this->belongsTo(ModerationCase::class, 'moderation_case_id', 'id');
    }

    /**
     * Usuario moderador que ejecutó la transición o acción de revisión.
     */
    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderator_user_id', 'id');
    }
}
