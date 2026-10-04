<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadInteraction extends Model
{
    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'lead_interactions';

    /**
     * Clave primaria estándar autoincremental.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Nombre de la columna de creación.
     *
     * @var string
     */
    const CREATED_AT = 'created_at';

    /**
     * Desactiva updated_at para operar como bitácora histórica inmutable de solo inserción.
     *
     * @var string|null
     */
    const UPDATED_AT = null;

    /**
     * Atributos asignables en masa.
     * Excluye id y created_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'lead_id',
        'performed_by_user_id',
        'type',
        'notes',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [];
    }

    /**
     * Lead o prospecto comercial sobre el cual se realiza el seguimiento.
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class, 'lead_id', 'id');
    }

    /**
     * Usuario asesor o vendedor que ejecutó o registró la gestión comercial.
     */
    public function performedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by_user_id', 'id');
    }
}
