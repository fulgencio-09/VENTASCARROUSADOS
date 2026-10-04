<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'cities';

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
        'department_id',
        'code',
        'name',
        'is_active',
    ];

    /**
     * Casteo estricto de atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Departamento al cual pertenece la ciudad o municipio.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id', 'id');
    }

    /**
     * Perfiles de usuarios radicados en esta ciudad.
     */
    public function profiles(): HasMany
    {
        return $this->hasMany(Profile::class, 'city_id', 'id');
    }

    /**
     * Concesionarios cuya sede principal está radicada en esta ciudad.
     */
    public function dealers(): HasMany
    {
        return $this->hasMany(Dealer::class, 'city_id', 'id');
    }

    /**
     * Sucursales o sedes de concesionarios ubicadas en esta ciudad.
     */
    public function dealerBranches(): HasMany
    {
        return $this->hasMany(DealerBranch::class, 'city_id', 'id');
    }
}
