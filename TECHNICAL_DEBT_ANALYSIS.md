# Technical Debt Analysis - Timo Intelligence

**Date:** $(date)  
**Focus:** Code duplication, complexity, unused code

---

## Executive Summary

The codebase is generally well-structured, but `context/ContentContext.tsx` (763 lines) is the most complex file and contains significant technical debt. Key issues include code duplication in update functions, complex validation logic, and deeply nested state management.

---

## 1. Code Duplication (DRY Violations)

### 🔴 High Priority

#### 1.1 **Duplicate Update Functions Pattern**
**Location:** `context/ContentContext.tsx:554-728`

**Issue:** Four nearly identical update functions with only minor differences:
- `updateHero()` (lines 554-564)
- `updateAbout()` (lines 691-702)
- `updatePartners()` (lines 704-715)
- `updateContact()` (lines 717-728)

**Duplication:**
```typescript
// Pattern repeated 4 times:
const updateX = (key: keyof XData, value: string) => {
  const maxLength = /* different logic */;
  const sanitized = /* different logic */;
  setContent(prev => ({
    ...prev,
    x: {
      ...prev.x,
      [key]: sanitized
    }
  }));
};
```

**Impact:** 
- 4 functions × ~10 lines = 40 lines of duplicated code
- Changes to sanitization logic must be made in 4 places
- Risk of inconsistent behavior

**Recommendation:** Create generic `updateField()` helper function.

---

#### 1.2 **Duplicate Validation Logic**
**Location:** `context/ContentContext.tsx:210-273` and `276-325`

**Issue:** Two validation functions with overlapping logic:
- `validateContentStructure()` (lines 210-273) - comprehensive validation
- `loadSavedContentFromLocalStorage()` (lines 276-325) - partial validation

**Duplication:**
```typescript
// Both check:
- parsed.hero && typeof parsed.hero === 'object'
- Array.isArray(parsed.solutions)
- parsed.solutions.every((sol: any) => 
    typeof sol.id === 'string' &&
    typeof sol.title === 'string' &&
    // ... same checks
  )
```

**Impact:**
- Validation logic duplicated
- `loadSavedContentFromLocalStorage()` uses incomplete validation
- Risk of validation inconsistencies

**Recommendation:** Use `validateContentStructure()` in `loadSavedContentFromLocalStorage()`.

---

#### 1.3 **Duplicate Field Validation Pattern**
**Location:** `context/ContentContext.tsx:219-220, 249-250, 258-259, 267-268`

**Issue:** Same validation pattern repeated for each section:
```typescript
const heroFields = ['tag', 'titleLine1', ...];
if (!heroFields.every(field => typeof data.hero[field] === 'string')) {
  return false;
}
// Repeated for about, partners, contact
```

**Impact:** 4 × 3 lines = 12 lines of duplication

**Recommendation:** Extract to helper function `validateStringFields()`.

---

### 🟡 Medium Priority

#### 1.4 **Similar Editor Component Structure**
**Location:** `components/admin/editors/*.tsx`

**Issue:** All editor components follow identical pattern:
- Import same components (`InputGroup`, `TextAreaGroup`)
- Use `INPUT_LIMITS` constants
- Similar JSX structure with sections

**Impact:** Low - this is acceptable duplication for component clarity

**Recommendation:** Consider creating `FieldSection` wrapper component (optional).

---

## 2. Complexity Issues

### 🔴 Critical Complexity

#### 2.1 **ContentContext.tsx - 763 Lines**
**Location:** `context/ContentContext.tsx`

**Metrics:**
- **Lines:** 763
- **Functions:** 18+ functions
- **Cyclomatic Complexity:** High (multiple nested conditions)
- **Max Nesting Depth:** 4-5 levels

**Complex Functions:**

1. **`persistContent()`** (lines 416-512)
   - **Lines:** 96
   - **Nesting:** 4 levels
   - **Responsibilities:** API save, localStorage save, encryption, error handling
   - **Complexity Score:** 15/10

2. **`loadContent()` (inside useEffect)** (lines 337-410)
   - **Lines:** 73
   - **Nesting:** 5 levels (try-catch-inside-try-catch)
   - **Responsibilities:** API load, localStorage load, decryption, validation
   - **Complexity Score:** 12/10

3. **`validateContentStructure()`** (lines 210-273)
   - **Lines:** 63
   - **Nesting:** 3 levels
   - **Responsibilities:** Validates entire content structure
   - **Complexity Score:** 8/10

4. **`selectIconFromText()`** (lines 604-651)
   - **Lines:** 47
   - **Nesting:** 3 levels
   - **Responsibilities:** Keyword matching, scoring, selection
   - **Complexity Score:** 7/10

**Issues:**
- Single file handles: state management, validation, persistence, encryption, API calls
- Too many responsibilities (SRP violation)
- Hard to test individual pieces
- Difficult to understand flow

---

#### 2.2 **Deep Nesting in useEffect**
**Location:** `context/ContentContext.tsx:331-413`

**Issue:** Nested try-catch blocks:
```typescript
useEffect(() => {
  const loadContent = async () => {
    try {
      if (isApiAvailable()) {
        try {  // Nested try
          // API logic
        } catch { }
      }
      // localStorage logic
      try {  // Another nested try
        // decryption logic
      } catch { }
    } catch { }
  };
}, []);
```

**Impact:** Hard to follow error flow, difficult to debug

---

### 🟡 Medium Complexity

#### 2.3 **updateSolution() - Complex Sanitization**
**Location:** `context/ContentContext.tsx:566-601`

**Issue:** Multiple conditional branches for different field types:
```typescript
if (field === 'image') {
  sanitizedValue = sanitizeUrl(value as string) || (value as string);
} else if (typeof value === 'string') {
  const maxLength = field === 'detailText' ? 10000 : 
                     field === 'description' ? 2000 : 500;
  sanitizedValue = sanitizeInput(value, maxLength);
}
```

**Impact:** Complex conditional logic, hard to extend

---

## 3. Unused Code

### 🟢 Low Priority

#### 3.1 **Unused Function: `loadSavedContentFromLocalStorage()`**
**Location:** `context/ContentContext.tsx:276-325`

**Status:** Function exists but is only called once at initialization (line 327). The logic is duplicated in `loadContent()` useEffect.

**Recommendation:** Remove and use `validateContentStructure()` directly.

---

#### 3.2 **Unused Import Check**
**Files checked:** All components

**Findings:**
- All imports appear to be used
- No obvious dead code found
- Agent logging imports are used

**Status:** ✅ No unused imports detected

---

## Complexity Metrics Summary

| File | Lines | Functions | Max Nesting | Complexity Score |
|------|-------|-----------|-------------|------------------|
| `ContentContext.tsx` | 763 | 18+ | 5 | 🔴 **Very High** |
| `apiService.ts` | 187 | 4 | 3 | 🟡 Medium |
| `security.ts` | 326 | 6 | 3 | 🟡 Medium |
| `Contact.tsx` | 292 | 1 | 4 | 🟡 Medium |
| `SolutionsEditor.tsx` | 165 | 1 | 3 | 🟢 Low |

---

## Most Complex File: `ContentContext.tsx`

### Current Structure
```
ContentContext.tsx (763 lines)
├── Type definitions (73 lines)
├── Default content (97 lines)
├── Context setup (3 lines)
├── ContentProvider component (548 lines)
│   ├── State & Refs (12 lines)
│   ├── validateContentStructure() (63 lines) ⚠️
│   ├── loadSavedContentFromLocalStorage() (49 lines) ⚠️ DUPLICATE
│   ├── useEffect - loadContent() (82 lines) ⚠️ COMPLEX
│   ├── persistContent() (96 lines) ⚠️ COMPLEX
│   ├── useEffect - debounced save (28 lines)
│   ├── forceSave() (2 lines)
│   ├── updateContent() (2 lines)
│   ├── updateHero() (10 lines) ⚠️ DUPLICATE
│   ├── updateSolution() (35 lines) ⚠️ COMPLEX
│   ├── selectIconFromText() (47 lines) ⚠️ COMPLEX
│   ├── addSolution() (25 lines)
│   ├── removeSolution() (8 lines)
│   ├── updateAbout() (11 lines) ⚠️ DUPLICATE
│   ├── updatePartners() (11 lines) ⚠️ DUPLICATE
│   ├── updateContact() (11 lines) ⚠️ DUPLICATE
│   └── Provider JSX (17 lines)
└── useContent hook (12 lines)
```

---

## Refactoring Priority

### Priority 1: Extract Update Functions (High Impact, Low Risk)
- Create generic `updateField()` function
- Reduces 40 lines → ~15 lines
- Eliminates 4 duplicate functions

### Priority 2: Extract Validation Logic (High Impact, Medium Risk)
- Move `validateContentStructure()` to separate file
- Remove duplicate validation in `loadSavedContentFromLocalStorage()`
- Reduces complexity

### Priority 3: Extract Persistence Logic (High Impact, High Risk)
- Create `ContentPersistence` service class
- Move `persistContent()` and `loadContent()` logic
- Reduces ContentContext by ~150 lines

### Priority 4: Extract Icon Selection (Medium Impact, Low Risk)
- Move `selectIconFromText()` to `utils/iconMapper.tsx`
- Move keyword mapping to config file
- Reduces ContentContext by ~50 lines

---

## Estimated Refactoring Impact

| Refactoring | Lines Reduced | Complexity Reduction | Risk Level |
|------------|---------------|---------------------|------------|
| Extract Update Functions | 40 → 15 | Medium | Low |
| Extract Validation | 50 → 30 | High | Medium |
| Extract Persistence | 150 → 50 | High | High |
| Extract Icon Selection | 50 → 10 | Low | Low |
| **Total** | **290 → 105** | **High** | **Medium** |

**Target:** Reduce `ContentContext.tsx` from 763 → ~470 lines (38% reduction)

---

## Recommendations

1. **Immediate:** Extract update functions (1-2 hours)
2. **Short-term:** Extract validation logic (2-3 hours)
3. **Medium-term:** Extract persistence service (4-6 hours)
4. **Long-term:** Consider splitting ContentContext into multiple contexts (HeroContext, SolutionsContext, etc.)

---

## Code Quality Metrics

- **Duplication:** ~90 lines of duplicated code
- **Complexity:** 1 file exceeds recommended 300-line limit
- **Unused Code:** 1 unused function (~50 lines)
- **Test Coverage:** Unknown (no test files found)

---

## Next Steps

See `REFACTORING_PLAN_ContentContext.md` for detailed refactoring plan.
