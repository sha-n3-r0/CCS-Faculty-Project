<?php

namespace App\Services;

use App\Models\SystemSetting;

class SystemSettings
{
    public const KEY_MAINTENANCE_MODE = 'maintenance_mode';
    public const KEY_CURRENT_SEMESTER = 'current_semester';

    /**
     * @return array{maintenance_mode: bool, current_semester: string|null}
     */
    public function get(): array
    {
        return [
            'maintenance_mode' => (bool) $this->getValue(self::KEY_MAINTENANCE_MODE, false),
            'current_semester' => $this->getValue(self::KEY_CURRENT_SEMESTER, null),
        ];
    }

    /**
     * @param  array{maintenance_mode?: bool, current_semester?: string|null}  $data
     * @return array{maintenance_mode: bool, current_semester: string|null}
     */
    public function put(array $data): array
    {
        if (array_key_exists('maintenance_mode', $data)) {
            $this->setValue(self::KEY_MAINTENANCE_MODE, (bool) $data['maintenance_mode']);
        }

        if (array_key_exists('current_semester', $data)) {
            $this->setValue(self::KEY_CURRENT_SEMESTER, $data['current_semester']);
        }

        return $this->get();
    }

    private function getValue(string $key, mixed $default): mixed
    {
        $row = SystemSetting::query()->where('key', $key)->first();
        if (! $row) {
            return $default;
        }
        return $row->value ?? $default;
    }

    private function setValue(string $key, mixed $value): void
    {
        SystemSetting::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}

