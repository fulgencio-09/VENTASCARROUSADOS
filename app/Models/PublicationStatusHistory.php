<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicationStatusHistory extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'publication_status_history';

    /**
     * Clave primaria id autoincremental estándar.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Timestamps desactivados: la migración 0029 define created_at pero NO define updated_at.
     * El historial es una bitácora inmutable de solo inserción.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Atributos asignables en masa.
     * Excluye id y created_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'publication_id',
        'from_status',
        'to_status',
        'changed_by_user_id',
        'reason',
    ];

    /**
     * Publicación a la que pertenece la transición de estado.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }

    /**
     * Usuario que ejecutó o detonó el cambio de estado (moderador, vendedor o sistema).
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_user_id', 'id');
    }
}
