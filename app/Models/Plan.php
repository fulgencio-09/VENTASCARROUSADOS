<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'plans';

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
     * Excluye id y timestamps.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'name',
        'description',
        'target',
        'price_amount',
        'price_currency',
        'duration_days',
        'max_photos',
        'max_listings',
        'is_featured',
        'is_active',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     * price_amount se castea a decimal:2 para preservar precisión contable en COP.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_amount' => 'decimal:2',
            'duration_days' => 'integer',
            'max_photos' => 'integer',
            'max_listings' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Publicaciones comerciales que han contratado este plan.
     */
    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class, 'plan_id', 'id');
    }

    /**
     * Suscripciones de concesionarios asociadas a este plan comercial.
     */
    public function dealerSubscriptions(): HasMany
    {
        return $this->hasMany(DealerSubscription::class, 'plan_id', 'id');
    }

    /**
     * Snapshots contractuales históricos generados a partir de este plan.
     */
    public function publicationPlanSnapshots(): HasMany
    {
        return $this->hasMany(PublicationPlanSnapshot::class, 'plan_id', 'id');
    }
}
