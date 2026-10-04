<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicationPlanSnapshot extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'publication_plans_snapshot';

    /**
     * Clave primaria id autoincremental estándar.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Timestamps desactivados: la migración 0030 utiliza captured_at en lugar de timestamps convencionales.
     * No posee SoftDeletes.
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
        'publication_id',
        'plan_id',
        'plan_code',
        'plan_name',
        'duration_days',
        'price_amount',
        'price_currency',
        'max_photos',
        'is_featured',
        'captured_at',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     * price_amount se castea a decimal:2 para preservar precisión exacta en COP sin conversión a float.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'duration_days' => 'integer',
            'price_amount' => 'decimal:2',
            'max_photos' => 'integer',
            'is_featured' => 'boolean',
            'captured_at' => 'datetime',
        ];
    }

    /**
     * Publicación comercial a la que está vinculado este snapshot contractual.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }

    /**
     * Plan comercial original contratado como base de este snapshot.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'id');
    }
}
