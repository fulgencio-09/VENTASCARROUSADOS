<?php

namespace App\Models;

use App\Support\Currency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'plans';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'code', 'name', 'description', 'target', 'price_amount', 'price_currency',
        'duration_days', 'max_photos', 'max_listings', 'is_featured', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_amount' => 'decimal:2', 'duration_days' => 'integer', 'max_photos' => 'integer',
            'max_listings' => 'integer', 'is_featured' => 'boolean', 'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Plan $plan) { $plan->price_currency = Currency::code(); });
        static::saving(function (Plan $plan) { $plan->price_currency = Currency::code(); });
    }

    public function publications(): HasMany { return $this->hasMany(Publication::class, 'plan_id', 'id'); }
    public function dealerSubscriptions(): HasMany { return $this->hasMany(DealerSubscription::class, 'plan_id', 'id'); }
    public function publicationPlanSnapshots(): HasMany { return $this->hasMany(PublicationPlanSnapshot::class, 'plan_id', 'id'); }
}
