<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminDataController extends Controller
{
    private const ROLES = [
        'vendedor_particular',
        'concesionario',
        'administrador',
        'superadministrador',
    ];

    private function ensureSuperAdmin(Request $request): void
    {
        abort_unless(
            $request->user()?->roles()->where('name', 'superadministrador')->exists(),
            403,
            'Solo el superadministrador puede realizar esta operación.'
        );
    }

    public function users(Request $request): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        $users = User::with(['profile', 'roles'])
            ->orderByDesc('id')
            ->paginate((int) min(max((int) $request->integer('per_page', 20), 1), 100));

        return response()->json($users);
    }

    public function storeUser(Request $request): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        $data = $request->validate([
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
            'role' => ['required', Rule::in(self::ROLES)],
            'first_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'document_type' => ['nullable', 'string', 'max:30'],
            'document_number' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $user = DB::transaction(function () use ($data): User {
            $user = User::create([
                'email' => mb_strtolower(trim($data['email'])),
                'password' => Hash::make($data['password']),
                'status' => $data['status'],
            ]);

            $user->profile()->create([
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'document_type' => $data['document_type'] ?? null,
                'document_number' => $data['document_number'] ?? null,
                'phone' => $data['phone'] ?? null,
                'whatsapp' => $data['whatsapp'] ?? null,
                'city_id' => $data['city_id'] ?? null,
                'address' => $data['address'] ?? null,
            ]);

            $roleId = Role::where('name', $data['role'])->value('id');
            $user->roles()->sync([$roleId]);

            return $user;
        });

        return response()->json([
            'message' => 'Usuario creado correctamente.',
            'user' => $user->load(['profile', 'roles']),
        ], 201);
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        $data = $request->validate([
            'email' => ['sometimes', 'required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'status' => ['sometimes', 'required', Rule::in(['active', 'inactive', 'suspended'])],
            'role' => ['sometimes', Rule::in(self::ROLES)],
            'first_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'last_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'document_type' => ['sometimes', 'nullable', 'string', 'max:30'],
            'document_number' => ['sometimes', 'nullable', 'string', 'max:50'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'whatsapp' => ['sometimes', 'nullable', 'string', 'max:30'],
            'city_id' => ['sometimes', 'nullable', 'integer', 'exists:cities,id'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        if ($user->id === $request->user()->id && (($data['status'] ?? $user->status) !== 'active')) {
            abort(422, 'No puede desactivar o suspender su propia cuenta.');
        }

        DB::transaction(function () use ($data, $user): void {
            $userData = [];

            if (array_key_exists('email', $data)) {
                $userData['email'] = mb_strtolower(trim($data['email']));
            }
            if (array_key_exists('status', $data)) {
                $userData['status'] = $data['status'];
            }
            if (!empty($data['password'])) {
                $userData['password'] = Hash::make($data['password']);
            }

            if ($userData !== []) {
                $user->update($userData);
            }

            $profileFields = [
                'first_name', 'last_name', 'document_type', 'document_number',
                'phone', 'whatsapp', 'city_id', 'address',
            ];
            $profileData = array_intersect_key($data, array_flip($profileFields));

            if ($profileData !== []) {
                $user->profile()->updateOrCreate(['user_id' => $user->id], $profileData);
            }

            if (array_key_exists('role', $data)) {
                $roleId = Role::where('name', $data['role'])->value('id');
                $user->roles()->sync([$roleId]);
            }
        });

        return response()->json([
            'message' => 'Usuario actualizado correctamente.',
            'user' => $user->fresh()->load(['profile', 'roles']),
        ]);
    }

    public function destroyUser(Request $request, User $user): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        abort_if($user->id === $request->user()->id, 422, 'No puede eliminar su propia cuenta.');

        $isSuperAdmin = $user->roles()->where('name', 'superadministrador')->exists();
        if ($isSuperAdmin) {
            $remaining = User::where('id', '<>', $user->id)
                ->whereHas('roles', fn ($query) => $query->where('name', 'superadministrador'))
                ->count();

            abort_if($remaining < 1, 422, 'No puede eliminar al último superadministrador.');
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }

    public function roles(Request $request): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        return response()->json([
            'data' => Role::whereIn('name', self::ROLES)
                ->with('permissions:id,name,guard_name,description')
                ->withCount('users')
                ->orderByRaw("FIELD(name, 'superadministrador', 'administrador', 'concesionario', 'vendedor_particular')")
                ->get(),
        ]);
    }

    public function updateRolePermissions(Request $request, Role $role): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        abort_unless(in_array($role->name, self::ROLES, true), 404, 'Rol no encontrado.');

        $data = $request->validate([
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['integer', 'distinct', 'exists:permissions,id'],
        ]);

        $role->permissions()->sync($data['permission_ids']);

        return response()->json([
            'message' => 'Permisos del rol actualizados correctamente.',
            'role' => $role->fresh()->load('permissions'),
        ]);
    }

    public function permissions(Request $request): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        return response()->json([
            'data' => Permission::withCount('roles')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function storePermission(Request $request): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:permissions,name,NULL,id,guard_name,web'],
            'guard_name' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $permission = Permission::create([
            'name' => trim($data['name']),
            'guard_name' => $data['guard_name'] ?? 'web',
            'description' => $data['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Permiso creado correctamente.',
            'permission' => $permission,
        ], 201);
    }

    public function updatePermission(Request $request, Permission $permission): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100', Rule::unique('permissions', 'name')->ignore($permission->id)->where('guard_name', $permission->guard_name)],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $permission->update($data);

        return response()->json([
            'message' => 'Permiso actualizado correctamente.',
            'permission' => $permission->fresh()->loadCount('roles'),
        ]);
    }

    public function destroyPermission(Request $request, Permission $permission): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        abort_if($permission->roles()->exists(), 422, 'No puede eliminar un permiso que está asignado a uno o más roles.');

        $permission->delete();

        return response()->json(['message' => 'Permiso eliminado correctamente.']);
    }
}
