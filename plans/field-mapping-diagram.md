# Equipment Schema Update - Field Mapping

```mermaid
graph TB
    subgraph "Schema Changes"
        A["schema.prisma"] --> B["EquipmentStatus: Added SOLD"]
        A --> C["FuelType: New Enum"]
        C --> D["DIESEL"]
        C --> E["GASOLINE"]
        C --> F["ELECTRIC"]
        C --> G["HYBRID"]
        C --> H["LPG"]
        C --> I["CNG"]
        C --> J["NONE"]
    end

    subgraph "Backend Changes"
        K["equipment.entity.ts"] --> L["Replace diesel: boolean"]
        L --> M["With fuelType: FuelType"]
        N["create-equipment.dto.ts"] --> O["Update validation"]
        P["update-equipment.dto.ts"] --> Q["Update validation"]
    end

    subgraph "Frontend Changes"
        R["equipment.ts types"] --> S["Replace diesel field"]
        S --> T["Add fuelType field"]
        U["equipment.constants.ts"] --> V["Add SOLD status label"]
        W["equipment.validations.ts"] --> X["Update Zod schema"]
    end

    subgraph "Field Mapping"
        Y["Before: diesel?: boolean"] --> Z["After: fuelType?: FuelType"]
        AA["Before: 4 status values"] --> BB["After: 5 status values"]
    end

    style A fill:#e1f5fe
    style K fill:#fff3e0
    style R fill:#f3e5f5
    style Y fill:#e8f5e8
```

## Change Summary

### 1. Equipment Entity Changes

```typescript
// BEFORE
@ApiProperty({ required: false })
diesel?: boolean;

// AFTER
@ApiProperty({ enum: FuelType })
fuelType?: FuelType;
```

### 2. DTO Changes

```typescript
// BEFORE
@IsBoolean()
@IsOptional()
diesel?: boolean;

// AFTER
@IsEnum(FuelType)
@IsOptional()
fuelType?: FuelType;
```

### 3. Type Changes

```typescript
// BEFORE
diesel?: boolean | null;

// AFTER
fuelType?: FuelType | null;
```

### 4. Validation Changes

```typescript
// BEFORE
diesel: z.boolean().optional(),

// AFTER
fuelType: z.enum([
  "DIESEL", "GASOLINE", "ELECTRIC", "HYBRID", "LPG", "CNG", "NONE"
]).optional(),
```

### 5. Constants Changes

```typescript
// BEFORE
export const equipmentStatusLabels: Record<EquipmentStatus, string> = {
  [EquipmentStatus.ACTIVE]: "Activo",
  [EquipmentStatus.INACTIVE]: "Inactivo",
  [EquipmentStatus.MAINTENANCE]: "En mantenimiento",
  [EquipmentStatus.RETIRED]: "Retirado",
};

// AFTER
export const equipmentStatusLabels: Record<EquipmentStatus, string> = {
  [EquipmentStatus.ACTIVE]: "Activo",
  [EquipmentStatus.INACTIVE]: "Inactivo",
  [EquipmentStatus.MAINTENANCE]: "En mantenimiento",
  [EquipmentStatus.RETIRED]: "Retirado",
  [EquipmentStatus.SOLD]: "Vendido",
};
```
