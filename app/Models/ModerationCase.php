<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ModerationCase extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'moderation_cases';

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
        'publication_id',
        'seller_user_id',
        'assigned_moderator_user_id',
        'reason',
        'priority',
        'status',
        'decision',
        'decision_reason',
        'risk_score',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'risk_score' => 'integer',
        ];
    }

    /**
     * Boot del modelo para generación automática de UUID v4 de 36 caracteres al crear.
     */
    protected static function booted(): void
    {
        static::creating(function (ModerationCase $moderationCase) {
            if (empty($moderationCase->uuid)) {
                $moderationCase->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Publicación comercial objeto del caso de moderación.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }

    /**
     * Usuario vendedor propietario de la publicación auditada.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_user_id', 'id');
    }

    /**
     * Usuario moderador asignado al caso (si aplica).
     */
    public function assignedModerator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_moderator_user_id', 'id');
    }

    /**
     * Trazabilidad histórica de revisiones y transiciones de estado del caso.
     */
    public function history(): HasMany
    {
        return $this->hasMany(ModerationHistory::class, 'moderation_case_id', 'id');
    }
}
