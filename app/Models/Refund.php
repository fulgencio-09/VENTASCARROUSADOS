<?php

namespace App\Models;

use App\Support\Currency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Refund extends Model
{
    use HasFactory;
    protected $table = 'refunds';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = ['payment_id', 'amount', 'currency', 'reason', 'status', 'approved_by_user_id', 'processed_at'];

    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'processed_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::creating(function (Refund $refund) {
            if (empty($refund->uuid)) $refund->uuid = (string) Str::uuid();
            $refund->currency = Currency::code();
        });
        static::saving(function (Refund $refund) { $refund->currency = Currency::code(); });
    }

    public function payment(): BelongsTo { return $this->belongsTo(Payment::class, 'payment_id', 'id'); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(User::class, 'approved_by_user_id', 'id'); }
}
