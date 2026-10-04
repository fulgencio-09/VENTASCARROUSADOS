<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleInspection extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'vehicle_inspections';

    /**
     * Clave primaria id autoincremental estándar.
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
        'vehicle_id',
        'inspector_user_id',
        'score',
        'report_s3_key',
        'summary_json',
        'inspected_at',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'summary_json' => 'array',
            'inspected_at' => 'datetime',
        ];
    }

    /**
     * Activo físico peritado.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'id');
    }

    /**
     * Perito o inspector usuario responsable del peritaje.
     */
    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspector_user_id', 'id');
    }
}
