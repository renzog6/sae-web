# Equipment Schema Update Plan

## Overview

Update the equipment module to reflect new enums added to `schema.prisma`:

- `EquipmentStatus`: Added `SOLD` value (was missing from frontend)
- `FuelType`: New enum replacing the old `diesel` boolean field

## Current State Analysis

### Backend (sae-backend)

- **Equipment Entity**: Uses old `diesel: boolean` field instead of `fuelType: FuelType`
- **EquipmentStatus**: Missing `SOLD` value in frontend constants
- **DTOs**: Still reference `diesel` boolean instead of `fuelType` enum

### Frontend (sae-frontend/lib)

- **Types**: `equipment.ts` uses old `diesel` field
- **Constants**: `equipment.constants.ts` missing `SOLD` status
- **Validations**: `equipment.ts` validates `diesel` boolean instead of `fuelType`
- **API Service**: May need updates for new field structure

## Changes Required

### 1. Backend Updates

#### 1.1 Update Equipment Entity

**File**: `sae-backend/src/modules/equipment/entities/equipment.entity.ts`

- Replace `diesel: boolean` field with `fuelType: FuelType`
- Update `@ApiProperty` decorator to reference `FuelType` enum
- Import `FuelType` from `@prisma/client`

#### 1.2 Update DTOs

**Files**:

- `sae-backend/src/modules/equipment/dto/create-equipment.dto.ts`
- `sae-backend/src/modules/equipment/dto/update-equipment.dto.ts`

Changes:

- Replace `diesel?: boolean` with `fuelType?: FuelType`
- Update validation decorators to use `@IsEnum(FuelType)`
- Update API property descriptions
- Import `FuelType` enum

#### 1.3 Update Service (if needed)

**File**: `sae-backend/src/modules/equipment/equipment.service.ts`

- Verify service methods handle the new `fuelType` field correctly
- Update any hardcoded references to `diesel` field

#### 1.4 Update Controller (if needed)

**File**: `sae-backend/src/modules/equipment/equipment.controller.ts`

- Verify controller methods handle the new `fuelType` field
- Update any validation or transformation logic

### 2. Frontend Updates

#### 2.1 Update Types

**File**: `sae-frontend/lib/types/domain/equipment.ts`

Changes:

- Replace `diesel?: boolean | null` with `fuelType?: FuelType | null`
- Add import for `FuelType` from shared enums
- Update the `CreateEquipmentDto` and `UpdateEquipmentDto` types

#### 2.2 Update Constants

**File**: `sae-frontend/lib/constants/equipment.constants.ts`

Changes:

- Add `SOLD` status to `equipmentStatusLabels` object
- Update the import to include `SOLD` from `EquipmentStatus` enum

#### 2.3 Update Validations

**File**: `sae-frontend/lib/validations/equipment.ts`

Changes:

- Replace `diesel: z.boolean().optional()` with `fuelType: z.enum([...]).optional()`
- Update the enum values to include all `FuelType` options
- Update the `EquipmentFormData` and related types

#### 2.4 Update API Service

**File**: `sae-frontend/lib/api/equipments/equipments.service.ts`

Changes:

- Verify the service works with the new field structure
- Update any hardcoded field references if needed

#### 2.5 Update Hooks

**File**: `sae-frontend/lib/hooks/useEquipments.ts`

Changes:

- Update any hardcoded references to `diesel` field
- Ensure form data mapping includes `fuelType`

## Implementation Order

1. **Backend First** (to ensure API compatibility):

   - Update Equipment entity
   - Update DTOs
   - Update service/controller if needed

2. **Frontend Second** (to match API changes):
   - Update types
   - Update constants
   - Update validations
   - Update API service and hooks

## Field Mapping

### Before → After

```typescript
// Before
diesel?: boolean;

// After
fuelType?: FuelType;
```

### FuelType Enum Values

```typescript
enum FuelType {
  DIESEL = "DIESEL"
  GASOLINE = "GASOLINE"
  ELECTRIC = "ELECTRIC"
  HYBRID = "HYBRID"
  LPG = "LPG"
  CNG = "CNG"
  NONE = "NONE"
}
```

### EquipmentStatus Enum Values (Frontend Update)

```typescript
enum EquipmentStatus {
  ACTIVE = "ACTIVE"
  INACTIVE = "INACTIVE"
  MAINTENANCE = "MAINTENANCE"
  RETIRED = "RETIRED"
  SOLD = "SOLD"  // ← New value to add
}
```

## Validation Schema Updates

### Backend (NestJS)

```typescript
@IsEnum(FuelType)
@IsOptional()
fuelType?: FuelType;
```

### Frontend (Zod)

```typescript
fuelType: z.enum([
  "DIESEL", "GASOLINE", "ELECTRIC", "HYBRID", "LPG", "CNG", "NONE"
]).optional(),
```

## Testing Considerations

1. **Backend Testing**:

   - Test API endpoints with new `fuelType` field
   - Verify enum validation works correctly
   - Test database migrations if applicable

2. **Frontend Testing**:
   - Test form validation with new fuel type options
   - Verify dropdown/select components show all fuel types
   - Test form submission with new field structure
   - Verify equipment listing shows new status values

## Migration Notes

- This is a **breaking change** for the API contract
- Frontend and backend must be updated simultaneously
- Database migration may be needed if changing existing data structure
- Consider backward compatibility if equipment records already exist

## Files to Modify Summary

### Backend (4-6 files)

1. `sae-backend/src/modules/equipment/entities/equipment.entity.ts`
2. `sae-backend/src/modules/equipment/dto/create-equipment.dto.ts`
3. `sae-backend/src/modules/equipment/dto/update-equipment.dto.ts`
4. `sae-backend/src/modules/equipment/equipment.service.ts` (if needed)
5. `sae-backend/src/modules/equipment/equipment.controller.ts` (if needed)

### Frontend (5-6 files)

1. `sae-frontend/lib/types/domain/equipment.ts`
2. `sae-frontend/lib/constants/equipment.constants.ts`
3. `sae-frontend/lib/validations/equipment.ts`
4. `sae-frontend/lib/api/equipments/equipments.service.ts` (if needed)
5. `sae-frontend/lib/hooks/useEquipments.ts` (if needed)
6. Any component files that reference the old `diesel` field

## Success Criteria

- [ ] Backend API accepts and returns `fuelType` instead of `diesel`
- [ ] Frontend forms display fuel type dropdown with all enum values
- [ ] Equipment status includes "Sold" option
- [ ] All existing functionality continues to work
- [ ] No TypeScript compilation errors
- [ ] API validation works for new enum fields
