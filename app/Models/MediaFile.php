<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class MediaFile extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'media_files';

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
     * Excluye id, uuid (generado por aplicación), is_primary_flag (columna generada por MySQL),
     * timestamps y deleted_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'file_type',
        'publication_id',
        'vehicle_inspection_id',
        'uploaded_by_user_id',
        'original_filename',
        's3_bucket',
        's3_key_original',
        's3_key_hd',
        's3_key_thumb',
        'mime_type',
        'file_size_bytes',
        'width',
        'height',
        'aspect_ratio',
        'order_index',
        'is_primary',
        'processing_status',
        'checksum_sha256',
    ];

    /**
     * Casteo estricto de atributos según tipos físicos de MySQL 8.0.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'file_size_bytes' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'aspect_ratio' => 'decimal:2',
            'order_index' => 'integer',
            'is_primary' => 'boolean',
        ];
    }

    /**
     * Boot del modelo para generación automática de UUID v4 de 36 caracteres al crear.
     */
    protected static function booted(): void
    {
        static::creating(function (MediaFile $mediaFile) {
            if (empty($mediaFile->uuid)) {
                $mediaFile->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Publicación comercial a la que está asociado el archivo multimedia (si aplica).
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }

    /**
     * Inspección/peritaje de vehículo al que está asociado el documento o evidencia (si aplica).
     */
    public function vehicleInspection(): BelongsTo
    {
        return $this->belongsTo(VehicleInspection::class, 'vehicle_inspection_id', 'id');
    }

    /**
     * Usuario que realizó la carga del archivo.
     */
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by_user_id', 'id');
    }
}
