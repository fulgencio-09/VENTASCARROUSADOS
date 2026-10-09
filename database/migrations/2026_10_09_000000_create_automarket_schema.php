<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * The approved DDL files are the source of truth for the initial schema.
     * This baseline migration executes them in dependency order without
     * inventing or transforming columns, indexes, constraints or enum values.
     */
    private array $ddlFiles = [
        '0001_departments.sql',
        '0002_cities.sql',
        '0003_body_types.sql',
        '0004_fuel_types.sql',
        '0005_transmissions.sql',
        '0006_traction_types.sql',
        '0007_colors.sql',
        '0008_features.sql',
        '0009_vehicle_makes.sql',
        '0010_vehicle_models.sql',
        '0011_vehicle_versions.sql',
        '0012_users.sql',
        '0013_profiles.sql',
        '0014_roles.sql',
        '0015_permissions.sql',
        '0016_model_has_roles.sql',
        '0017_model_has_permissions.sql',
        '0018_role_has_permissions.sql',
        '0019_dealers.sql',
        '0020_dealer_users.sql',
        '0021_dealer_branches.sql',
        '0022_plans.sql',
        '0023_dealer_subscriptions.sql',
        '0024_user_kyc_documents.sql',
        '0025_vehicles.sql',
        '0026_vehicle_features.sql',
        '0027_vehicle_inspections.sql',
        '0028_publications.sql',
        '0029_publication_status_history.sql',
        '0030_publication_plans_snapshot.sql',
        '0031_media_files.sql',
        '0032_payments.sql',
        '0033_payment_transactions.sql',
        '0034_payment_webhook_logs.sql',
        '0035_refunds.sql',
        '0036_moderation_cases.sql',
        '0037_moderation_history.sql',
        '0038_leads.sql',
        '0039_lead_interactions.sql',
        '0040_test_drive_appointments.sql',
        '0041_conversations.sql',
        '0042_messages.sql',
        '0043_notifications.sql',
        '0044_user_favorites.sql',
        '0045_user_comparison_items.sql',
        '0046_publication_analytics_daily.sql',
        '0047_dealer_reviews.sql',
        '0048_user_saved_searches.sql',
        '0049_audit_logs.sql',
        '0050_personal_access_tokens.sql',
    ];

    public function up(): void
    {
        foreach ($this->ddlFiles as $file) {
            $path = base_path('database/ddl/' . $file);

            if (! is_file($path)) {
                throw new RuntimeException("DDL no encontrado: {$path}");
            }

            $sql = trim((string) file_get_contents($path));

            if ($sql === '') {
                throw new RuntimeException("DDL vacío: {$path}");
            }

            // Execute each SQL statement independently while preserving the approved DDL.
            foreach ($this->splitSqlStatements($sql) as $statement) {
                DB::unprepared($statement);
            }
        }
    }

    public function down(): void
    {
        // Reverse numeric order removes dependent tables before their parents.
        foreach (array_reverse($this->ddlFiles) as $file) {
            $table = $this->tableNameFromDdl($file);

            if ($table !== null) {
                DB::statement('DROP TABLE IF EXISTS `' . $table . '`');
            }
        }
    }

    private function splitSqlStatements(string $sql): array
    {
        $statements = [];
        $buffer = '';
        $length = strlen($sql);
        $inSingleQuote = false;
        $inDoubleQuote = false;
        $inBacktick = false;
        $inLineComment = false;
        $inBlockComment = false;
        $escaped = false;

        for ($i = 0; $i < $length; $i++) {
            $char = $sql[$i];
            $next = $i + 1 < $length ? $sql[$i + 1] : '';

            if ($inLineComment) {
                $buffer .= $char;

                if ($char === "\n" || $char === "\r") {
                    $inLineComment = false;
                }

                continue;
            }

            if ($inBlockComment) {
                $buffer .= $char;

                if ($char === '*' && $next === '/') {
                    $buffer .= $next;
                    $i++;
                    $inBlockComment = false;
                }

                continue;
            }

            if (! $inSingleQuote && ! $inDoubleQuote && ! $inBacktick) {
                if ($char === '-' && $next === '-') {
                    $third = $i + 2 < $length ? $sql[$i + 2] : '';

                    if ($third === '' || $third === ' ' || $third === "\t" || $third === "\r" || $third === "\n") {
                        $buffer .= $char . $next;
                        $i++;
                        $inLineComment = true;
                        continue;
                    }
                }

                if ($char === '#') {
                    $buffer .= $char;
                    $inLineComment = true;
                    continue;
                }

                if ($char === '/' && $next === '*') {
                    $buffer .= $char . $next;
                    $i++;
                    $inBlockComment = true;
                    continue;
                }
            }

            $buffer .= $char;

            if ($escaped) {
                $escaped = false;
                continue;
            }

            if ($char === '\\' && ($inSingleQuote || $inDoubleQuote)) {
                $escaped = true;
                continue;
            }

            if ($char === "'" && ! $inDoubleQuote && ! $inBacktick) {
                $inSingleQuote = ! $inSingleQuote;
                continue;
            }

            if ($char === '"' && ! $inSingleQuote && ! $inBacktick) {
                $inDoubleQuote = ! $inDoubleQuote;
                continue;
            }

            if ($char === '`' && ! $inSingleQuote && ! $inDoubleQuote) {
                $inBacktick = ! $inBacktick;
                continue;
            }

            if ($char === ';' && ! $inSingleQuote && ! $inDoubleQuote && ! $inBacktick) {
                $statement = trim(substr($buffer, 0, -1));

                if ($statement !== '') {
                    $statements[] = $statement;
                }

                $buffer = '';
            }
        }

        $statement = trim($buffer);

        if ($statement !== '') {
            $statements[] = $statement;
        }

        return $statements;
    }

    private function tableNameFromDdl(string $file): ?string
    {
        $path = base_path('database/ddl/' . $file);

        if (! is_file($path)) {
            return null;
        }

        $sql = (string) file_get_contents($path);

        if (preg_match('/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?([a-zA-Z0-9_]+)`?/i', $sql, $matches)) {
            return $matches[1];
        }

        return null;
    }
};
