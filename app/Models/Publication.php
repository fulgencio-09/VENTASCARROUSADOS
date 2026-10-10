<?php

namespace App\Models;

use App\Support\Currency;
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

    protected $table = 'publications';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'vehicle_id', 'seller_user_id', 'dealer_id', 'plan_id', 'title', 'slug', 'description',
        'price_amount', 'price_currency', 'is_negotiable', 'is_featured', 'featured_until', 'status',
        'published_at', 'paused_at', 'expires_at', 'rejection_reason', 'rejection_internal_notes',
        'views_count', 'leads_count', 'favorites_count',
    ];

    protected function casts(): array
    {
        return [
            'price_amount' => 'decimal:2', 'is_negotiable' => 'boolean', 'is_featured' => 'boolean',
            'featured_until' => 'datetime', 'published_at' => 'datetime', 'paused_at' => 'datetime',
            'expires_at' => 'datetime', 'views_count' => 'integer', 'leads_count' => 'integer', 'favorites_count' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Publication $publication) {
            if (empty($publication->uuid)) $publication->uuid = (string) Str::uuid();
            $publication->price_currency = Currency::code();
        });
        static::saving(function (Publication $publication) { $publication->price_currency = Currency::code(); });
    }

    public function vehicle(): BelongsTo { return $this->belongsTo(Vehicle::class, 'vehicle_id', 'id'); }
    public function seller(): BelongsTo { return $this->belongsTo(User::class, 'seller_user_id', 'id'); }
    public function dealer(): BelongsTo { return $this->belongsTo(Dealer::class, 'dealer_id', 'id'); }
    public function plan(): BelongsTo { return $this->belongsTo(Plan::class, 'plan_id', 'id'); }
    public function planSnapshot(): HasOne { return $this->hasOne(PublicationPlanSnapshot::class, 'publication_id', 'id'); }
    public function statusHistory(): HasMany { return $this->hasMany(PublicationStatusHistory::class, 'publication_id', 'id'); }
    public function mediaFiles(): HasMany { return $this->hasMany(MediaFile::class, 'publication_id', 'id'); }
    public function payments(): HasMany { return $this->hasMany(Payment::class, 'publication_id', 'id'); }
    public function moderationCases(): HasMany { return $this->hasMany(ModerationCase::class, 'publication_id', 'id'); }
    public function leads(): HasMany { return $this->hasMany(Lead::class, 'publication_id', 'id'); }
    public function conversations(): HasMany { return $this->hasMany(Conversation::class, 'publication_id', 'id'); }
    public function favorites(): HasMany { return $this->hasMany(UserFavorite::class, 'publication_id', 'id'); }
    public function comparisonItems(): HasMany { return $this->hasMany(UserComparisonItem::class, 'publication_id', 'id'); }
    public function dailyAnalytics(): HasMany { return $this->hasMany(PublicationAnalyticsDaily::class, 'publication_id', 'id'); }
}
