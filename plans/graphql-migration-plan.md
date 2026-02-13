# Plan de Migración GraphQL - sae-frontend → sae-backend

## Resumen del Estado Actual

### Backend GraphQL (sae-backend) ✅

El backend tiene NestJS GraphQL con todas las mutaciones necesarias:

**Mutaciones con inputs (funcionando):**

- `createAddress(input: CreateAddressDto!)`, `updateAddress(id, input: UpdateAddressDto!)`
- `createCity(input: CreateCityDto!)`, `updateCity(id, input: UpdateCityDto!)`
- `createContact(input: CreateContactDto!)`, `updateContact(id, input: UpdateContactDto!)`
- `createBrand(input: CreateBrandDto!)`, `updateBrand(id, input: UpdateBrandDto!)`
- `createCompany(input: CreateCompanyDto!)`, `updateCompany(id, input: UpdateCompanyDto!)`
- `createUnit(input: CreateUnitDto!)`, `updateUnit(id, input: UpdateUnitDto!)`

**Queries disponibles:**

- `findAllBrands`, `findAllBusinessCategories`, `findAllCompanies`, `findAllEmployees`, `findAllEquipment`, `findAllUnits`, etc.

**Soft Deletes:**

- `removeBrand(id)`, `restoreBrand(id)`, `hardDeleteBrand(id)`
- `removeCompany(id)`, `restoreCompany(id)`, `hardDeleteCompany(id)`
- `removeEmployee(id)`, `restoreEmployee(id)`, `hardDeleteEmployee(id)`
- `removeEquipment(id)`, `restoreEquipment(id)`, `hardDeleteEquipment(id)`
- `removeUnit(id)`, `restoreUnit(id)`, `hardDeleteUnit(id)`

---

## Modificaciones Realizadas

### Backend - DTOs

| Archivo                                                                                  | Cambios                                     |
| ---------------------------------------------------------------------------------------- | ------------------------------------------- |
| [`create-company.dto.ts`](sae-backend/src/modules/companies/dto/create-company.dto.ts)   | `@InputType()` y `@Field()`                 |
| [`update-company.dto.ts`](sae-backend/src/modules/companies/dto/update-company.dto.ts)   | `@InputType()` con `PartialType` de GraphQL |
| [`create-brand.dto.ts`](sae-backend/src/modules/catalogs/brands/dto/create-brand.dto.ts) | `@InputType()` y `@Field()`                 |
| [`update-brand.dto.ts`](sae-backend/src/modules/catalogs/brands/dto/update-brand.dto.ts) | `@InputType()` con `PartialType` de GraphQL |

### Backend - Resolvers y Servicios

| Archivo                                                                            | Cambios                                     |
| ---------------------------------------------------------------------------------- | ------------------------------------------- |
| [`companies.resolver.ts`](sae-backend/src/modules/companies/companies.resolver.ts) | Mutaciones `createCompany`, `updateCompany` |
| [`brands.resolver.ts`](sae-backend/src/modules/catalogs/brands/brands.resolver.ts) | Mutaciones `createBrand`, `updateBrand`     |
| [`brands.service.ts`](sae-backend/src/modules/catalogs/brands/brands.service.ts)   | Método `update`                             |
| [`units.resolver.ts`](sae-backend/src/modules/catalogs/units/units.resolver.ts)    | Mutaciones `createUnit`, `updateUnit`       |
| [`units.service.ts`](sae-backend/src/modules/catalogs/units/units.service.ts)      | Método `update`                             |

### Frontend

| Archivo                                                                   | Cambios                                           |
| ------------------------------------------------------------------------- | ------------------------------------------------- |
| [`codegen.ts`](sae-frontend/codegen.ts)                                   | URL del backend (`http://localhost:3305/graphql`) |
| [`companies.graphql`](sae-frontend/lib/graphql/queries/companies.graphql) | Queries y mutations para Companies                |
| [`brands.graphql`](sae-frontend/lib/graphql/queries/brands.graphql)       | Queries y mutations para Brands                   |
| [`units.graphql`](sae-frontend/lib/graphql/queries/units.graphql)         | Queries y mutations para Units                    |

---

## hooks GraphQL Generados ✅

### Mutations (6)

| Hook                       | Mutation        | Descripción     |
| -------------------------- | --------------- | --------------- |
| `useCreateAddressMutation` | `CreateAddress` | Crear dirección |
| `useCreateBrandMutation`   | `CreateBrand`   | Crear marca     |
| `useCreateCityMutation`    | `CreateCity`    | Crear ciudad    |
| `useCreateCompanyMutation` | `CreateCompany` | Crear empresa   |
| `useCreateContactMutation` | `CreateContact` | Crear contacto  |
| `useCreateUnitMutation`    | `CreateUnit`    | Crear unidad    |

| Hook                       | Mutation        | Descripción          |
| -------------------------- | --------------- | -------------------- |
| `useUpdateAddressMutation` | `UpdateAddress` | Actualizar dirección |
| `useUpdateBrandMutation`   | `UpdateBrand`   | Actualizar marca     |
| `useUpdateCityMutation`    | `UpdateCity`    | Actualizar ciudad    |
| `useUpdateCompanyMutation` | `UpdateCompany` | Actualizar empresa   |
| `useUpdateContactMutation` | `UpdateContact` | Actualizar contacto  |
| `useUpdateUnitMutation`    | `UpdateUnit`    | Actualizar unidad    |

### Queries (9)

| Hook                       | Query              | Descripción           |
| -------------------------- | ------------------ | --------------------- |
| `useFindAddressesQuery`    | `FindAddresses`    | Direcciones paginadas |
| `useFindCitiesQuery`       | `FindCities`       | Ciudades paginadas    |
| `useFindContactsQuery`     | `FindContacts`     | Contactos paginadas   |
| `useFindCountriesQuery`    | `FindCountries`    | Países paginadas      |
| `useFindAllCompaniesQuery` | `FindAllCompanies` | Empresas paginadas    |
| `useFindAllBrandsQuery`    | `FindAllBrands`    | Marcas paginadas      |
| `useFindAllUnitsQuery`     | `FindAllUnits`     | Unidades paginadas    |
| `useFindAllEmployeesQuery` | `FindAllEmployees` | Empleados paginadas   |
| `useFindAllEquipmentQuery` | `FindAllEquipment` | Equipos paginadas     |

---

## Ejemplo de Uso

### Query (Companies)

```typescript
import { useFindAllCompaniesQuery } from '@/lib/graphql/hooks';

function CompaniesList() {
  const { data, isLoading, error } = useFindAllCompaniesQuery({
    skip: 0,
    take: 10,
    orderBy: 'createdAt:desc'
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.findAllCompanies.data.map(company => (
        <li key={company.id}>
          {company.name} - {company.cuit}
        </li>
      ))}
    </ul>
  );
}
```

### Mutation (Create Company)

```typescript
import { useCreateCompanyMutation } from '@/lib/graphql/hooks';

function CreateCompanyForm() {
  const mutation = useCreateCompanyMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['FindAllCompanies'] });
    }
  });

  const handleSubmit = (data: CreateCompanyDto) => {
    mutation.mutate({ input: data });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Mutation con Confirmación

```typescript
import { useGraphQLMutationWithConfirm } from "@/lib/graphql/hooks";

function useDeleteCompany() {
  return useGraphQLMutationWithConfirm({
    mutationFn: (id: number) => removeCompanyMutation(id),
    confirmMessage: "¿Estás seguro de eliminar esta empresa?",
    successMessage: "Empresa eliminada",
    invalidateQueries: ["FindAllCompanies"],
  });
}

// Uso
const deleteCompany = useDeleteCompany();
deleteCompany.mutate(companyId);
```

---

## Próximos Pasos

### 1. Employees y Equipment

Agregar mutaciones manualmente para:

- [`employees.resolver.ts`](sae-backend/src/modules/employees/employees.resolver.ts)
- [`employees.service.ts`](sae-backend/src/modules/employees/services/employees.service.ts)
- [`create-employee.dto.ts`](sae-backend/src/modules/employees/dto/create-employee.dto.ts)
- [`update-employee.dto.ts`](sae-backend/src/modules/employees/dto/update-employee.dto.ts)

- [`equipment.resolver.ts`](sae-backend/src/modules/equipment/equipment.resolver.ts)
- [`equipment.service.ts`](sae-backend/src/modules/equipment/equipment.service.ts)
- [`create-equipment.dto.ts`](sae-backend/src/modules/equipment/dto/create-equipment.dto.ts)
- [`update-equipment.dto.ts`](sae-backend/src/modules/equipment/dto/update-equipment.dto.ts)

### 2. Migrar Componentes Frontend

Migrar los componentes existentes que usan REST a GraphQL:

| Componente     | Hook GraphQL a usar                                    |
| -------------- | ------------------------------------------------------ |
| Companies List | `useFindAllCompaniesQuery`                             |
| Companies Form | `useCreateCompanyMutation`, `useUpdateCompanyMutation` |
| Brands List    | `useFindAllBrandsQuery`                                |
| Brands Form    | `useCreateBrandMutation`, `useUpdateBrandMutation`     |
| Units List     | `useFindAllUnitsQuery`                                 |
| Units Form     | `useCreateUnitMutation`, `useUpdateUnitMutation`       |
| Employees List | `useFindAllEmployeesQuery`                             |
| Equipment List | `useFindAllEquipmentQuery`                             |

---

## Estructura de Archivos GraphQL

```
sae-frontend/
├── lib/
│   ├── graphql/
│   │   ├── client.ts          # Cliente GraphQL con auth
│   │   ├── codegen.ts         # Configuración de codegen
│   │   ├── schema.json        # Schema GraphQL (generado)
│   │   ├── generated.ts        # Tipos y hooks (generado)
│   │   ├── hooks/
│   │   │   ├── index.ts       # Índice de hooks
│   │   │   └── use-graphql.ts # Utilities y wrappers
│   │   └── queries/
│   │       ├── addresses.graphql
│   │       ├── brands.graphql
│   │       ├── cities.graphql
│   │       ├── companies.graphql
│   │       ├── contacts.graphql
│   │       ├── countries.graphql
│   │       ├── employees.graphql
│   │       ├── equipment.graphql
│   │       ├── persons.graphql
│   │       ├── provinces.graphql
│   │       └── units.graphql
```

---

## Comandos Útiles

```bash
# Regenerar tipos GraphQL desde el backend
cd sae-frontend && npm run codegen

# Verificar schema GraphQL del backend
curl -X POST http://localhost:3305/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { mutationType { fields { name } } } } }"}'

# Levantar backend para desarrollo
cd sae-backend && npm run start:dev

# Levantar frontend para desarrollo
cd sae-frontend && npm run dev
```

---

## Progreso de la Migración

### ✅ Completado

- [x] Analizar estructura del backend GraphQL
- [x] Configurar codegen del frontend para usar URL del backend
- [x] Crear queries y mutations para Companies
- [x] Crear queries y mutations para Brands
- [x] Crear queries y mutations para Units
- [x] Crear queries y mutations para Employees
- [x] Crear queries y mutations para Equipment
- [x] Ejecutar codegen y generar todos los hooks
- [ ] Migrar componentes frontend existentes
