<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserComparisonItem extends Model
{
    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'user_comparison_items';

    /**
     * Clave primaria estándar autoincremental.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Desactiva updated_at ya que la tabla solo registra fecha de creación.
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
        'user_id',
        'publication_id',
    ];

    /**
     * Usuario propietario de la bandeja de comparación vehicular.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Publicación vehicular incorporada al comparador.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }
}
