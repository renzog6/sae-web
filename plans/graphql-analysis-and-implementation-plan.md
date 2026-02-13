# Análisis Exhaustivo de GraphQL en SAE-Backend

## 📋 Resumen Ejecutivo

El proyecto **sae-backend** tiene una integración parcial de GraphQL basada en NestJS con Apollo Server. Aunque existe una arquitectura base sólida con `BaseResolver` y `BaseService`, hay **18 módulos** que aún no tienen implementación GraphQL y varios problemas de arquitectura que deben resolverse para lograr una implementación profesional y optimizada.

---

## 1. Estado Actual de la Integración GraphQL

### 1.1 Dependencias Instaladas

| Paquete           | Versión  | Propósito                        |
| ----------------- | -------- | -------------------------------- |
| `@nestjs/graphql` | ^12.2.2  | Integración principal de GraphQL |
| `@nestjs/apollo`  | ^12.2.2  | Driver de Apollo Server          |
| `@apollo/server`  | ^4.12.2  | Servidor GraphQL                 |
| `graphql`         | ^16.12.0 | Spec de GraphQL                  |

### 1.2 Configuración en [`app.module.ts`](sae-backend/src/app.module.ts:46)

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), "src/schema.gql"),
  sortSchema: true,
  playground: true,
});
```

**Observaciones:**

- ✅ `autoSchemaFile` genera el schema automáticamente desde los decoradores
- ✅ `sortSchema` organiza el schema alfabéticamente
- ✅ `playground` habilitado para desarrollo
- ❌ **Falta:** Configuración de introspection para producción
- ❌ **Falta:** Circuit breaker / depth limit
- ❌ **Falta:** Logging configurado
- ❌ **Falta:** Federation (si se necesita microservicios)

---

## 2. Módulos con Resolvers GraphQL

### 2.1 Resolvers Implementados (23 total)

| Módulo                                                                                                                            | Estado      | Observaciones              |
| --------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------- |
| [`catalogs/brands`](sae-backend/src/modules/catalogs/brands/brands.resolver.ts)                                                   | ✅ Completo | Extiende BaseResolver      |
| [`catalogs/units`](sae-backend/src/modules/catalogs/units/units.resolver.ts)                                                      | ✅ Completo | Extiende BaseResolver      |
| [`companies`](sae-backend/src/modules/companies/companies.resolver.ts)                                                            | ✅ Completo | Extiende BaseResolver      |
| [`companies/business-categories`](sae-backend/src/modules/companies/business-categories/business-categories.resolver.ts)          | ✅ Completo | Extiende BaseResolver      |
| [`companies/business-subcategories`](sae-backend/src/modules/companies/business-subcategories/business-subcategories.resolver.ts) | ✅ Completo | Extiende BaseResolver      |
| [`contacts`](sae-backend/src/modules/contacts/contacts.resolver.ts)                                                               | ✅ Completo | Mutations personalizadas   |
| [`employees`](sae-backend/src/modules/employees/employees.resolver.ts)                                                            | ✅ Completo | Extiende BaseResolver      |
| [`employees/employee-categories`](sae-backend/src/modules/employees/employee-categories/employee-categories.resolver.ts)          | ✅ Completo | Extiende BaseResolver      |
| [`employees/employee-positions`](sae-backend/src/modules/employees/employee-positions/employee-positions.resolver.ts)             | ✅ Completo | Extiende BaseResolver      |
| [`equipment`](sae-backend/src/modules/equipment/equipment.resolver.ts)                                                            | ✅ Completo | Con filtros personalizados |
| [`equipment/equipment-categories`](sae-backend/src/modules/equipment/equipment-categories/equipment-categories.resolver.ts)       | ✅ Completo | Extiende BaseResolver      |
| [`equipment/equipment-models`](sae-backend/src/modules/equipment/equipment-models/equipment-models.resolver.ts)                   | ✅ Completo | Extiende BaseResolver      |
| [`equipment/equipment-types`](sae-backend/src/modules/equipment/equipment-types/equipment-types.resolver.ts)                      | ✅ Completo | Extiende BaseResolver      |
| [`history`](sae-backend/src/modules/history/history.resolver.ts)                                                                  | ✅ Completo | Extiende BaseResolver      |
| [`inspections`](sae-backend/src/modules/inspections/inspections.resolver.ts)                                                      | ✅ Completo | Extiende BaseResolver      |
| [`locations/addresses`](sae-backend/src/modules/locations/addresses/addresses.resolver.ts)                                        | ✅ Completo | Mutations personalizadas   |
| [`locations/cities`](sae-backend/src/modules/locations/cities/cities.resolver.ts)                                                 | ✅ Completo | Mutations personalizadas   |
| [`locations/countries`](sae-backend/src/modules/locations/countries/countries.resolver.ts)                                        | ✅ Completo | Solo Query                 |
| [`locations/provinces`](sae-backend/src/modules/locations/provinces/provinces.resolver.ts)                                        | ✅ Completo | Solo Query                 |
| [`persons`](sae-backend/src/modules/persons/persons.resolver.ts)                                                                  | ✅ Completo | Extiende BaseResolver      |
| [`tires/tire-models`](sae-backend/src/modules/tires/tire-models/tire-models.resolver.ts)                                          | ✅ Completo | Extiende BaseResolver      |
| [`tires/tire-sizes`](sae-backend/src/modules/tires/tire-sizes/tire-sizes.resolver.ts)                                             | ✅ Completo | Extiende BaseResolver      |
| [`tires`](sae-backend/src/modules/tires/tires.resolver.ts)                                                                        | ✅ Completo | Extiende BaseResolver      |

---

## 3. Módulos SIN Resolvers GraphQL (18 módulos)

### 3.1 Equipment Module

| Submódulo                                                                                    | Controller | Service | Prioridad |
| -------------------------------------------------------------------------------------------- | ---------- | ------- | --------- |
| [`equipment/equipment-axles`](sae-backend/src/modules/equipment/equipment-axles)             | ✅         | ✅      | Media     |
| [`equipment/equipment-maintenance`](sae-backend/src/modules/equipment/equipment-maintenance) | ✅         | ✅      | Alta      |
| [`equipment/equipment-transaction`](sae-backend/src/modules/equipment/equipment-transaction) | ✅         | ✅      | Alta      |

### 3.2 Employees Module

| Submódulo                                                                                                      | Controller | Service | Prioridad |
| -------------------------------------------------------------------------------------------------------------- | ---------- | ------- | --------- |
| [`employees/employee-vacations`](sae-backend/src/modules/employees/employee-vacations)                         | ✅         | ✅      | Alta      |
| [`employees/employee-incident`](sae-backend/src/modules/employees/controllers/employee-incident.controller.ts) | ✅         | ✅      | Media     |

### 3.3 Tires Module

| Submódulo                                                                  | Controller | Service | Prioridad |
| -------------------------------------------------------------------------- | ---------- | ------- | --------- |
| [`tires/tire-inspections`](sae-backend/src/modules/tires/tire-inspections) | ✅         | ✅      | Media     |
| [`tires/tire-events`](sae-backend/src/modules/tires/tire-events)           | ✅         | ✅      | Baja      |
| [`tires/tire-assignments`](sae-backend/src/modules/tires/tire-assignments) | ✅         | ✅      | Alta      |
| [`tires/tire-positions`](sae-backend/src/modules/tires/tire-positions)     | ✅         | ❌      | Baja      |
| [`tires/tire-rotations`](sae-backend/src/modules/tires/tire-rotations)     | ❌         | ❌      | Baja      |
| [`tires/tire-recaps`](sae-backend/src/modules/tires/tire-recaps)           | ❌         | ❌      | Media     |

### 3.4 Módulos de Soporte (SIN resolver esperado)

| Módulo                                             | Tipo   | Razón                          |
| -------------------------------------------------- | ------ | ------------------------------ |
| [`auth`](sae-backend/src/auth)                     | Módulo | Solo REST (JWT)                |
| [`users`](sae-backend/src/modules/users)           | Módulo | Solo REST                      |
| [`server-files`](sae-backend/src/server-files)     | Módulo | Upload de archivos (multipart) |
| [`reports`](sae-backend/src/reports)               | Módulo | Genera PDFs/Excel              |
| [`validators`](sae-backend/src/modules/validators) | Módulo | Utilidades de validación       |
| [`health`](sae-backend/src/modules/health)         | Módulo | Health checks                  |

---

## 4. Análisis del [`BaseResolver`](sae-backend/src/common/resolvers/base.resolver.ts:1)

### 4.1 Arquitectura Actual

```typescript
export function BaseResolver<T>(classRef: T, options): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    // Queries: findAll, findOne
    // Mutations: remove, restore, hardDelete
    // Dynamically added: create, update
  }
  return BaseResolverHost;
}
```

### 4.2 Fortalezas ✅

1. **Patrón Decorator:** Uso correcto de decoradores NestJS
2. **Genericidad:** Resolver genérico que funciona para múltiples entidades
3. **Soft Delete:** Integrado en el BaseService
4. **Polimorfismo:** Soporta create/update inputs opcionales
5. **Serialización JSON:** Maneja `where` y `orderBy` como strings JSON

### 4.3 Debilidades ❌

| Problema                              | Impacto                | Solución Propuesta                                |
| ------------------------------------- | ---------------------- | ------------------------------------------------- |
| **Serialización JSON**                | Parseo en cada request | Usar `graphql-query-complexity` o filtros tipados |
| **Sin autenticación JWT**             | Seguridad expuesta     | Crear `GraphQLAuthGuard`                          |
| **Filtros como string JSON**          | No tipado, error-prone | InputTypes específicos por módulo                 |
| **Paginación básica**                 | Sin cursor-based       | Implementar Relay-style pagination                |
| **Sin Rate Limiting**                 | Vulnerable a DDoS      | `@nestjs/throttler` configurado globalmente       |
| **Ausencia de @Field() descriptions** | Poor DX                | Agregar descripciones a todas las entidades       |

---

## 5. Análisis del [`BaseService`](sae-backend/src/common/services/base.service.ts:1)

### 5.1 Métodos Implementados

```typescript
abstract class BaseService<T> {
  // Lectura
  findAll(query, additionalWhere, include): Promise<BaseResponseDto<T>>;
  findOne(id, include, options): Promise<SingleResponseDto<T>>;

  // Escritura
  create(data): Promise<{ data: T }>;
  update(id, data): Promise<{ data: T }>;
  remove(id): Promise<{ data?: T; message: string }>;
  restore(id): Promise<SingleResponseDto<T>>;
  hardDelete(id): Promise<{ message: string }>;

  // Utilidades
  buildSearchConditions(q): any[];
  hasDeletedAt(): Promise<boolean>;
  getDefaultOrderBy(): any;
}
```

### 5.2 Problemas Identificados

1. **Wrapper responses:** Envuelve todo en `{ data: T }` pero GraphQL espera objetos planos
2. **Search conditions:** Base vacía, debe overridearse en cada servicio
3. **Includes hardcodeados:** No hay forma de configurar includes desde el resolver

---

## 6. Problemas de Arquitectura GraphQL

### 6.1 Problemas Críticos

| #   | Problema                                    | Archivo                                                              | Líneas                  |
| --- | ------------------------------------------- | -------------------------------------------------------------------- | ----------------------- |
| 1   | Schema no generado automáticamente en build | [`schema.gql`](sae-backend/src/schema.gql)                           | 1-736 (generado manual) |
| 2   | Sin GraphQL Code Generator                  | `package.json`                                                       | -                       |
| 3   | Inputs tipados como JSON strings            | [`PaginationArgs`](sae-backend/src/common/dto/pagination.args.ts:16) | 16-23                   |
| 4   | Sin autenticación en Queries/Mutations      | Todos los resolvers                                                  | -                       |

### 6.2 Schema GraphQL Actual

El [`schema.gql`](sae-backend/src/schema.gql:1) contiene:

- **Types:** ~25 entity types
- **Enums:** ~15 enums (EquipmentStatus, FuelType, etc.)
- **Inputs:** ~10 input types
- **Queries:** ~50 queries
- **Mutations:** ~80 mutations

**Problemas del schema:**

- ❌ Filtros genéricos (where: String)
- ❌ Sin campos de filtrado específicos
- ❌ Relaciones anidadas sin límites de profundidad
- ❌ Sin query complexity limits

---

## 7. Plan de Implementación Profesional

### 7.1 Fases del Plan

```
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 0: PREPARACIÓN                          │
│  (Configuración, Herramientas, Patrones)                         │
├─────────────────────────────────────────────────────────────────┤
│  0.1 Instalar GraphQL Code Generator                            │
│  0.2 Crear GraphQL Auth Guard                                   │
│  0.3 Mejorar BaseResolver con autenticación                     │
│  0.4 Crear InputTypes tipados                                   │
│  0.5 Configurar playground y introspection                      │
├─────────────────────────────────────────────────────────────────┤
│                    FASE 1: CORE MODULES                         │
│  (Equipment, Employees - Prioridad Alta)                        │
├─────────────────────────────────────────────────────────────────┤
│  1.1 Equipment Maintenance Resolver                             │
│  1.2 Equipment Transaction Resolver                             │
│  1.3 Equipment Axle Resolver                                     │
│  1.4 Employee Vacation Resolver                                 │
│  1.5 Employee Incident Resolver                                 │
├─────────────────────────────────────────────────────────────────┤
│                    FASE 2: TIRES MODULE                         │
│  (Gestión de neumáticos)                                         │
├─────────────────────────────────────────────────────────────────┤
│  2.1 Tire Assignment Resolver                                   │
│  2.2 Tire Inspection Resolver                                   │
│  2.3 Tire Event Resolver                                        │
│  2.4 Tire Rotation Resolver                                      │
│  2.5 Tire Recap Resolver                                        │
├─────────────────────────────────────────────────────────────────┤
│                    FASE 3: OPTIMIZACIÓN                          │
│  (Performance, Seguridad, Documentación)                        │
├─────────────────────────────────────────────────────────────────┤
│  3.1 DataLoader implementation                                  │
│  3.2 Query complexity limits                                    │
│  3.3 Depth limiting                                             │
│  3.4 Persisted queries                                          │
│  3.5 GraphQL schema documentation                               │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Detalle de Fases

#### **FASE 0: PREPARACIÓN**

| Task | Descripción                      | Archivos                                                                                                                                 |
| ---- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1  | Instalar dependencias            | `npm i -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-resolvers @graphql-codegen/typescript-operations` |
| 0.2  | Configurar `codegen.yml`         | Nuevo archivo                                                                                                                            |
| 0.3  | Crear `GraphQLAuthGuard`         | `src/common/guards/graphql-auth.guard.ts`                                                                                                |
| 0.4  | Mejorar `BaseResolver`           | Agregar `@UseGuards(GraphQLAuthGuard)`                                                                                                   |
| 0.5  | Crear `FilterInputType` genérico | `src/common/dto/filter.input.ts`                                                                                                         |
| 0.6  | Configurar Apollo Server options | `playground: false` en prod, `introspection: true`                                                                                       |

#### **FASE 1: CORE MODULES**

| Task | Entidad              | DTOs Requeridos                       | Dependencias                   |
| ---- | -------------------- | ------------------------------------- | ------------------------------ |
| 1.1  | EquipmentMaintenance | CreateInput, UpdateInput, FilterInput | Equipment, MaintenanceType     |
| 1.2  | EquipmentTransaction | CreateInput, UpdateInput, FilterInput | Equipment, Company, Currency   |
| 1.3  | EquipmentAxle        | CreateInput, UpdateInput, FilterInput | Equipment, AxleType            |
| 1.4  | EmployeeVacation     | CreateInput, UpdateInput, FilterInput | Employee, VacationType         |
| 1.5  | EmployeeIncident     | CreateInput, UpdateInput, FilterInput | Employee, EmployeeIncidentType |

#### **FASE 2: TIRES MODULE**

| Task | Entidad        | DTOs Requeridos                 | Dependencias                  |
| ---- | -------------- | ------------------------------- | ----------------------------- |
| 2.1  | TireAssignment | CreateInput, EndAssignmentInput | Tire, Equipment, TirePosition |
| 2.2  | TireInspection | CreateInput, UpdateInput        | Tire                          |
| 2.3  | TireEvent      | CreateInput, FilterInput        | Tire, TireEventType           |
| 2.4  | TireRotation   | CreateInput                     | Tire, Equipment               |
| 2.5  | TireRecap      | CreateInput, UpdateInput        | Tire                          |

#### **FASE 3: OPTIMIZACIÓN**

| Task | Descripción           | Beneficio                             |
| ---- | --------------------- | ------------------------------------- |
| 3.1  | **DataLoaders**       | N+1 query prevention                  |
| 3.2  | **Complexity Limits** | Protección contra queries maliciosas  |
| 3.3  | **Depth Limiting**    | Previene queries recursivas infinitas |
| 3.4  | **Persisted Queries** | Cache en CDN/APM                      |
| 3.5  | **Schema Stitching**  | Documentación automática              |

---

## 8. Arquitectura Propuesta Optimizada

### 8.1 Diagrama de Capas

```
┌────────────────────────────────────────────────────────────────────┐
│                        GraphQL Layer                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │    Queries      │  │   Mutations     │  │    Subscriptions    │ │
│  └────────┬────────┘  └────────┬────────┘  └──────────┬────────────┘ │
└───────────┼────────────────────┼──────────────────────┼─────────────┘
            │                    │                      │
            ▼                    ▼                      ▼
┌────────────────────────────────────────────────────────────────────┐
│                      Resolver Layer                                │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    BaseResolver<T>                            │ │
│  │  + AuthGuard  + Logging  + ValidationPipe                     │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
            │                    │                      │
            ▼                    ▼                      ▼
┌────────────────────────────────────────────────────────────────────┐
│                      Service Layer                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │  BaseService    │  │  ModuleService  │  │  Business Services │ │
│  │  (CRUD básico)  │  │  (Lógica datos) │  │  (Casos de uso)    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
            │                    │                      │
            ▼                    ▼                      ▼
┌────────────────────────────────────────────────────────────────────┐
│                       Data Layer                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Prisma ORM                                │  │
│  │  + DataLoaders  + Transaction Manager  + Soft Deletes       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### 8.2 Patrón de Resolver Mejorado

```typescript
@Resolver(() => Equipment)
@UseGuards(GraphQLAuthGuard)
export class EquipmentResolver extends BaseResolver(Equipment, {
  createInput: CreateEquipmentInput,
  updateInput: UpdateEquipmentInput,
  filterInput: EquipmentFilterInput,
}) {
  constructor(
    private equipmentService: EquipmentService,
    private equipmentLoader: EquipmentLoader,
  ) {
    super(equipmentService);
  }

  @Query(() => PaginatedEquipment, { name: "findAllEquipment" })
  @UseFilters(HttpExceptionFilter)
  async findAll(
    @Args() pagination: PaginationArgs,
    @Args("filter", { nullable: true }) filter?: EquipmentFilterInput,
  ): Promise<PaginatedEquipment> {
    const result = await this.equipmentService.findAll({
      ...pagination,
      ...filter,
    });
    return result;
  }

  @ResolveField(() => Company, { nullable: true })
  async company(@Parent() equipment: Equipment) {
    return this.equipmentLoader.loadCompany(equipment.companyId);
  }
}
```

---

## 9. Métricas y KPIs de Éxito

| Métrica                 | Actual      | Objetivo  | Medición             |
| ----------------------- | ----------- | --------- | -------------------- |
| Cobertura GraphQL       | 23/41 (56%) | 100%      | Módulos con resolver |
| Tiempo de respuesta avg | TBD         | < 200ms   | Apollo Studio        |
| Query complexity avg    | Ilimitado   | < 100     | GraphQL validation   |
| N+1 queries             | Presente    | Eliminado | DataLoaders          |
| Schema documentation    | 0%          | 100%      | GraphQL Playground   |

---

## 10. Recomendaciones Finales

### 10.1 Prioridad Alta (Inmediato)

1. ✅ **Seguridad:** Implementar `GraphQLAuthGuard`
2. ✅ **Tipado:** Crear InputTypes específicos en lugar de JSON strings
3. ✅ **Generación:** Configurar GraphQL Code Generator

### 10.2 Prioridad Media (Corto plazo)

1. 📋 **Resolvers faltantes:** Equipment Maintenance, Transactions, Employee Vacations
2. 📋 **Optimización:** DataLoaders para evitar N+1 queries
3. 📋 **Documentación:** Agregar descriptions a todos los campos

### 10.3 Prioridad Baja (Largo plazo)

1. 📘 **Subscriptions:** Para real-time updates
2. 📘 **Federation:** Si se necesita microservicios
3. 📘 **Persisted Queries:** Para cache en CDN

---

## 11. Próximos Pasos

1. **Revisar y aprobar** este plan
2. **Crear tareas** en el sistema de gestión
3. **Configurar entorno** de desarrollo
4. **Ejecutar Fase 0** (preparación)
5. **Iterar** en fases 1-3

---

_Documento creado el 2026-02-04_
_Proyecto: SAE-Backend GraphQL Analysis_
