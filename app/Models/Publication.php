<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Publication extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'publications';

    /**
     * Clave primaria id autoincremental estándar (el UUID no reemplaza la PK).
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
     * Excluye id, uuid, active_status_flag (columna virtual/generada), timestamps y deleted_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vehicle_id',
        'seller_user_id',
        'dealer_id',
        'plan_id',
        'title',
        'slug',
        'description',
        'price_amount',
        'price_currency',
        'is_negotiable',
        'is_featured',
        'featured_until',
        'status',
        'published_at',
        'paused_at',
        'expires_at',
        'rejection_reason',
        'rejection_internal_notes',
        'views_count',
        'leads_count',
        'favorites_count',
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
            'price_amount' => 'decimal:2',
            'is_negotiable' => 'boolean',
            'is_featured' => 'boolean',
            'featured_until' => 'datetime',
            'published_at' => 'datetime',
            'paused_at' => 'datetime',
            'expires_at' => 'datetime',
            'views_count' => 'integer',
            'leads_count' => 'integer',
            'favorites_count' => 'integer',
        ];
    }

    /**
     * Boot del modelo para generación automática de UUID v4 de 36 caracteres al crear.
     */
    protected static function booted(): void
    {
        static::creating(function (Publication $publication) {
            if (empty($publication->uuid)) {
                $publication->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Activo físico ofertado comercialmente en esta publicación.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'id');
    }

    /**
     * Vendedor o usuario anunciante propietario de la oferta.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_user_id', 'id');
    }

    /**
     * Concesionario anunciante (si la publicación es de inventario de concesionario).
     */
    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class, 'dealer_id', 'id');
    }

    /**
     * Plan comercial contratado para la publicación.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'id');
    }

    /**
     * Snapshot histórico de las condiciones del plan contratado.
     */
    public function planSnapshot(): HasOne
    {
        return $this->hasOne(PublicationPlanSnapshot::class, 'publication_id', 'id');
    }

    /**
     * Trazabilidad cronológica de cambios de estado comercial.
     */
    public function statusHistory(): HasMany
    {
        return $this->hasMany(PublicationStatusHistory::class, 'publication_id', 'id');
    }

    /**
     * Archivos multimedia asociados a la publicación.
     */
    public function mediaFiles(): HasMany
    {
        return $this->hasMany(MediaFile::class, 'publication_id', 'id');
    }

    /**
     * Pagos vinculados a esta publicación.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'publication_id', 'id');
    }

    /**
     * Casos de moderación y auditoría de contenido abiertos para esta publicación.
     */
    public function moderationCases(): HasMany
    {
        return $this->hasMany(ModerationCase::class, 'publication_id', 'id');
    }

    /**
     * Prospectos comerciales (leads) recibidos por esta oferta.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'publication_id', 'id');
    }

    /**
     * Conversaciones de mensajería originadas a partir de esta publicación.
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'publication_id', 'id');
    }

    /**
     * Registros de usuarios que han marcado esta publicación como favorita.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class, 'publication_id', 'id');
    }

    /**
     * Registros de comparación que incluyen esta publicación.
     */
    public function comparisonItems(): HasMany
    {
        return $this->hasMany(UserComparisonItem::class, 'publication_id', 'id');
    }

    /**
     * Métricas de tráfico y analítica diaria agregada para esta publicación.
     */
    public function dailyAnalytics(): HasMany
    {
        return $this->hasMany(PublicationAnalyticsDaily::class, 'publication_id', 'id');
    }
}
