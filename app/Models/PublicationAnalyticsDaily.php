<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicationAnalyticsDaily extends Model
{
    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'publication_analytics_daily';

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
        'publication_id',
        'date',
        'views_count',
        'leads_count',
        'favorites_count',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'views_count' => 'integer',
            'leads_count' => 'integer',
            'favorites_count' => 'integer',
        ];
    }

    /**
     * Publicación vehicular a la que corresponden las métricas analíticas.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }
}
