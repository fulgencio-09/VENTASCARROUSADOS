<?php

namespace App\Support;

final class Currency
{
    /** Moneda única de AutoMarket Pro. */
    public const COP = 'COP';

    private function __construct()
    {
    }

    /**
     * Devuelve únicamente la moneda oficial de la plataforma.
     *
     * Los importes no se convierten aquí: deben llegar ya expresados en COP.
     */
    public static function code(): string
    {
        return self::COP;
    }

    public static function isCop(?string $currency): bool
    {
        return strtoupper((string) $currency) === self::COP;
    }
}
