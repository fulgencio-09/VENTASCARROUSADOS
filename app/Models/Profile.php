<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'profiles';

    /**
     * Atributos asignables en masa.
     * Excluye id y timestamps.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'document_type',
        'document_number',
        'phone',
        'whatsapp',
        'city_id',
        'address',
        'avatar_media_id',
    ];

    /**
     * Usuario propietario del perfil (1:1 inverso).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Ciudad de residencia del usuario.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }

    /**
     * Archivo multimedia asignado como avatar de perfil.
     */
    public function avatarMedia(): BelongsTo
    {
        return $this->belongsTo(MediaFile::class, 'avatar_media_id', 'id');
    }
}
