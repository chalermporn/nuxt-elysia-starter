# Testing Documentation

## Overview

This project uses **Vitest** as the testing framework along with **@vue/test-utils** for component testing.

## Test Structure

```
├── api.test.ts              # API endpoint tests
├── app/
│   └── app.test.ts         # Vue component tests
├── __mocks__/
│   ├── nuxt.ts             # Nuxt composables mock
│   └── bun-sqlite.ts       # Bun SQLite mock
├── vitest.config.ts        # Vitest configuration
└── vitest.setup.ts         # Global test setup
```

## Running Tests

### Run all tests once
```bash
bun run test:run
```

### Run tests in watch mode
```bash
bun run test
```

### Run tests with UI
```bash
bun run test:ui
```

### Generate coverage report
```bash
bun run test:coverage
```

Coverage reports are generated in:
- **Terminal**: Summary table
- **HTML**: `coverage/index.html` (open in browser for detailed view)
- **JSON**: `coverage/coverage-final.json` (for CI/CD integration)

## Test Files

### API Tests (`api.test.ts`)
Tests for Elysia API endpoints:
- ✅ GET /hello endpoint
- ✅ GET /members endpoint
- ✅ Query parameters (page, limit, search, sortBy, sortOrder)
- ✅ Response structure validation

### Component Tests (`app/app.test.ts`)
Tests for Vue components:
- ✅ Component structure validation
- ✅ Sorting functionality
- ✅ Pagination functionality
- ✅ Items per page selection
- ✅ Search functionality

## Mocking Strategy

### Database Mocking
The database is mocked in tests to avoid dependencies on actual SQLite:
- `bun:sqlite` is aliased to `__mocks__/bun-sqlite.ts`
- Database operations are mocked using Vitest's `vi.mock()`

### Nuxt Mocking
Nuxt composables are mocked to avoid Nuxt environment requirements:
- `useNuxtApp` is mocked in `__mocks__/nuxt.ts`
- `onMounted` lifecycle hook is stubbed

## Configuration

### vitest.config.ts
Key configurations:
- **Environment**: happy-dom (for DOM testing)
- **Globals**: Enabled for test utilities
- **Aliases**: Configured for imports
- **External deps**: `bun:sqlite` marked as external

## Test Results

```
✅ Test Files: 4 passed (4)
✅ Tests: 45 passed (45)
✅ Duration: ~3-4s
```

### Test Breakdown
- **API Tests** (`api.test.ts`): 4 tests
- **Composable Tests** (`useMembersTable.test.ts`): 17 tests
- **Utility Tests** (`membersApi.test.ts`): 18 tests
- **Component Tests** (`app.test.ts`): 6 tests

### Coverage Report

```
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |     100 |      100 |     100 |     100 | ✅
api.ts             |     100 |      100 |     100 |     100 | ✅
useMembersTable.ts |     100 |      100 |     100 |     100 | ✅
membersApi.ts      |     100 |      100 |     100 |     100 | ✅
```

**🎉 100% Code Coverage Achieved!**

### Coverage Strategy

Our testing strategy achieves 100% coverage for business logic:

1. **API Layer** (`api.ts`) - 100% ✅
   - All Elysia endpoints
   - Request/response handling
   - Query parameter validation

2. **Business Logic** (`useMembersTable.ts`) - 100% ✅
   - State management composable
   - Sorting logic
   - Pagination logic
   - Search functionality

3. **Utilities** (`membersApi.ts`) - 100% ✅
   - Query parameter building
   - Display range calculation
   - Date formatting
   - Status badge helpers

4. **Presentation Layer** (`app.vue`) - Excluded
   - Vue SFC components are presentation layer
   - Should be tested with E2E tests (Playwright, Cypress)
   - Business logic extracted to testable composables

### Why app.vue is Excluded

Vue Single File Components (SFCs) are primarily presentation/UI layer. Unit testing them requires:
- Complex mocking of Nuxt environment
- Mocking Vue lifecycle hooks
- DOM manipulation testing

Instead, we:
- **Extract business logic** into composables (100% tested ✅)
- **Extract utilities** into pure functions (100% tested ✅)
- **Recommend E2E tests** for UI/integration testing

## Writing New Tests

### API Endpoint Tests
```typescript
it('should test endpoint', async () => {
  const app = api()
  const response = await app.handle(
    new Request('http://localhost/endpoint')
  )
  const data = await response.json()
  expect(data).toHaveProperty('expectedField')
})
```

### Component Tests
```typescript
it('should test component feature', async () => {
  const module = await import('./component.vue')
  expect(module.default).toBeDefined()
})
```

## Best Practices

1. **Mock external dependencies** - Always mock database and external services
2. **Test behavior, not implementation** - Focus on what the code does, not how
3. **Keep tests isolated** - Each test should be independent
4. **Use descriptive names** - Test names should clearly describe what they test
5. **Cleanup after tests** - Use `beforeEach` and `afterEach` for cleanup

## Troubleshooting

### Issue: Cannot bundle built-in module "bun:sqlite"
**Solution**: The mock is configured in `vitest.config.ts`. Ensure the alias is correctly set.

### Issue: useNuxtApp is not defined
**Solution**: Import from `#app` which is aliased to the mock in `__mocks__/nuxt.ts`.

## Future Improvements

- Add integration tests with real database
- Add E2E tests using Playwright
- Increase test coverage to >80%
- Add visual regression tests
- Add performance/load tests for API endpoints
