<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use SoftDeletes;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'leads';

    /**
     * Clave primaria id autoincremental estándar.
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
     * Excluye id, timestamps y deleted_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'seller_user_id',
        'buyer_user_id',
        'publication_id',
        'dealer_id',
        'buyer_name',
        'buyer_email',
        'buyer_phone',
        'initial_message',
        'type',
        'status',
    ];

    /**
     * Casteo estricto de atributos según tipos de MySQL 8.0.
     * Los enums y campos de texto no requieren casts adicionales en este proyecto.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [];
    }

    /**
     * Usuario vendedor o asesor receptor de la oportunidad comercial.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_user_id', 'id');
    }

    /**
     * Usuario comprador registrado interesado en la oferta (si está autenticado).
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_user_id', 'id');
    }

    /**
     * Publicación vehicular sobre la que se origina el prospecto comercial.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }

    /**
     * Concesionario receptor del lead (en publicaciones o vitrinas de concesionario).
     */
    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class, 'dealer_id', 'id');
    }
}
