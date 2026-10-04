<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSavedSearch extends Model
{
    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'user_saved_searches';

    /**
     * Clave primaria estándar autoincremental.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Timestamps activos (created_at, updated_at).
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
        'user_id',
        'name',
        'filters',
        'notify_email',
        'is_active',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'filters' => 'array',
            'notify_email' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Usuario propietario de la búsqueda guardada.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
