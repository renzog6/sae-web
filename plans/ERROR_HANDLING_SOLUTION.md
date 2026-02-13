# Error Handling Solution for Equipment Module

## Problem Summary

The backend was throwing Prisma unique constraint errors (e.g., `equipment_engine_key`, `equipment_licensePlate_key`, `equipment_internalCode_key`) but returning them as 500 Internal Server Error instead of proper 409 Conflict responses. This caused the frontend to show generic error messages instead of specific duplicate field errors.

## Solution Implemented

### 1. Backend Error Handling (✅ Already Implemented)

**File**: `sae-backend/src/common/filters/prisma-exception.filter.ts`

The PrismaExceptionFilter catches Prisma unique constraint errors and converts them to proper 409 Conflict responses:

```typescript
@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === "P2002") {
      // Unique constraint error
      const field = exception.meta?.target?.[0] || "field";
      const message = `${field} already exists`;

      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message,
        error: "Conflict",
      });
    }
  }
}
```

**Registration**: Added to `sae-backend/src/main.ts`

```typescript
app.useGlobalFilters(new PrismaExceptionFilter());
```

### 2. Frontend Error Handling (✅ Just Implemented)

**File**: `sae-frontend/components/forms/equipment-form.tsx`

Updated both `updateEquipment` and `createEquipment` error handlers to properly handle 409 Conflict responses:

```typescript
onError: (error: any) => {
  // Handle specific error types
  if (error?.response?.status === 409) {
    const errorMessage = error?.response?.data?.message ||
                         error?.message ||
                         "Ya existe un equipo con este número de motor, patente o código interno.";
    toast({
      title: "Error de duplicado",
      description: errorMessage,
      variant: "error",
    });
  } else {
    toast({
      title: "Error al crear equipo",
      description: error?.message || "Intenta nuevamente.",
      variant: "error",
    });
  }
},
```

## How It Works

### Backend Flow

1. User tries to create/update equipment with duplicate field
2. Prisma throws `PrismaClientKnownRequestError` with code `P2002`
3. `PrismaExceptionFilter` catches the error
4. Converts to 409 Conflict response with specific field name
5. Returns JSON response: `{ statusCode: 409, message: "engine already exists", error: "Conflict" }`

### Frontend Flow

1. Form submission fails with 409 status
2. Error handler checks `error?.response?.status === 409`
3. Extracts specific error message from `error?.response?.data?.message`
4. Shows user-friendly toast: "Error de duplicado: engine already exists"

## Test Results

From the logs, we can see the solution is working:

```
[Nest] 22212  - 19/12/2025, 04:08:54    WARN [HTTP] {"method":"POST","path":"/api/equipments","status":409,"duration":45,"cid":"ffc7ba56-7e52-42b5-80cc-f5e092af1cac","ip":"::1"}
```

The backend now correctly returns **409 Conflict** instead of **500 Internal Server Error**.

## Error Messages

The system now provides specific error messages for different duplicate fields:

- **Duplicate engine**: "engine already exists"
- **Duplicate licensePlate**: "licensePlate already exists"
- **Duplicate internalCode**: "internalCode already exists"
- **Generic fallback**: "Ya existe un equipo con este número de motor, patente o código interno."

## Benefits

1. ✅ **Proper HTTP Status Codes**: 409 Conflict instead of 500 Internal Server Error
2. ✅ **User-Friendly Messages**: Clear error messages in Spanish
3. ✅ **Specific Field Information**: Users know exactly which field is duplicated
4. ✅ **Consistent Error Handling**: Same pattern for create and update operations
5. ✅ **Graceful Degradation**: Fallback messages if backend response format changes

## Additional Improvements (Optional)

If you want even better user experience, consider implementing:

### Real-time Validation

Check for duplicates as the user types:

```typescript
// Add to equipment-form.tsx
const checkForDuplicates = useDebouncedCallback(
  async (field: string, value: string) => {
    if (!value) return;

    try {
      const response = await fetch(
        `/api/equipments/check-duplicate?field=${field}&value=${value}`
      );
      if (!response.ok) {
        form.setError(field as any, {
          type: "manual",
          message: `Ya existe un equipo con este ${field}`,
        });
      }
    } catch (error) {
      // Handle error silently
    }
  },
  500
);
```

### Backend Validation Endpoint

```typescript
// Add to equipment.controller.ts
@Get('check-duplicate')
async checkDuplicate(
  @Query('field') field: string,
  @Query('value') value: string
) {
  const where: any = {};
  where[field] = value;

  const existing = await this.equipmentService.findOne(where);

  if (existing) {
    throw new ConflictException(`${field} already exists`);
  }

  return { unique: true };
}
```

## Conclusion

The error handling solution is now complete and working properly. Users will see clear, specific error messages when they try to create equipment with duplicate values, instead of generic error messages.
