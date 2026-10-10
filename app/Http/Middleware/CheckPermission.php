<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        abort_unless($user, 401, 'Autenticación requerida.');

        if ($user->roles()->where('name', 'superadministrador')->exists()) {
            return $next($request);
        }

        $directPermissions = $user->permissions()
            ->whereIn('name', $permissions)
            ->pluck('name');

        if ($directPermissions->isNotEmpty()) {
            return $next($request);
        }

        $rolePermissions = $user->roles()
            ->with('permissions')
            ->get()
            ->flatMap(fn ($role) => $role->permissions->pluck('name'))
            ->unique();

        if ($rolePermissions->intersect($permissions)->isNotEmpty()) {
            return $next($request);
        }

        abort(403, 'No tiene el permiso requerido para realizar esta operación.');
    }
}
