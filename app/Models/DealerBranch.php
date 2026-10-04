<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DealerBranch extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'dealer_branches';

    /**
     * Atributos asignables en masa.
     * Excluye id, timestamps y deleted_at.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'dealer_id',
        'name',
        'city_id',
        'address',
        'phone',
        'is_active',
    ];

    /**
     * Casteo de atributos.
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
     * Concesionario propietario de la sucursal o sede física.
     */
    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class, 'dealer_id', 'id');
    }

    /**
     * Ciudad donde se ubica la sucursal.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }
}
