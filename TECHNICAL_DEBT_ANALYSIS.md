# Technical Debt Analysis - Timo Intelligence

## 📊 Executive Summary

**Most Complex File:** `components/AdminPanel.tsx` (760 lines)
**Total Issues Found:** 15
**Estimated Refactoring Effort:** 8-12 hours

---

## 🔴 KRITIEKE TECHNICAL DEBT

### 1. Code Duplication: Icon Mapping Functions
**Severity:** HIGH  
**Locations:**
- `components/Solutions.tsx:11-39` - `getIcon()` function (29 lines)
- `components/Ecosystem.tsx:11-40` - `getIconComponent()` function (30 lines)

**Issue:** Identieke icon mapping logica wordt gedupliceerd in 2 bestanden. Beide functies doen hetzelfde maar met verschillende props.

**Impact:**
- Maintenance nightmare: icon toevoegen vereist wijzigingen in 2 plaatsen
- Inconsistentie risico: verschillende default sizes kunnen verwarring veroorzaken
- Code bloat: ~60 regels duplicatie

**Refactoring:** Extract naar `utils/iconMapper.ts`

---

### 2. Code Duplication: Tab Button Rendering
**Severity:** HIGH  
**Location:** `components/AdminPanel.tsx:283-317`

**Issue:** 5 bijna identieke tab buttons met alleen verschillen in:
- `onClick` handler
- `activeTab` check
- Label tekst

**Code Pattern:**
```typescript
<button
    onClick={() => setActiveTab('hero')}
    className={`flex-shrink-0 px-3 py-3 text-xs font-medium transition-colors relative ${activeTab === 'hero' ? 'text-timo-accent' : 'text-gray-400 hover:text-white'}`}
>
    Hero
    {activeTab === 'hero' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-timo-accent"></div>}
</button>
```
(Herhaald 5x met kleine variaties)

**Impact:**
- 35 regels repetitieve code
- Moeilijk onderhoudbaar
- Risico op inconsistentie

**Refactoring:** Extract naar `TabButton` component

---

### 3. Excessive File Size: AdminPanel.tsx
**Severity:** HIGH  
**Location:** `components/AdminPanel.tsx` (760 lines)

**Issues:**
- Te veel verantwoordelijkheden in één component:
  - Authentication logic
  - Form handling
  - File upload
  - Tab navigation
  - Content editing (5 verschillende tabs)
  - Image preview
- 9 useState hooks (veel state management)
- Diepe nesting (tot 6-7 levels)
- Moeilijk te testen
- Moeilijk te begrijpen

**Complexity Metrics:**
- Lines of Code: 760
- Cyclomatic Complexity: ~45 (zeer hoog)
- Max Nesting Depth: 7 levels
- State Variables: 9
- Functions: 8+

**Refactoring:** Split in meerdere componenten:
- `AdminAuth.tsx` - Authentication logic
- `AdminTabs.tsx` - Tab navigation
- `HeroEditor.tsx` - Hero content editor
- `SolutionsEditor.tsx` - Solutions editor
- `AboutEditor.tsx` - About editor
- `PartnersEditor.tsx` - Partners editor
- `ContactEditor.tsx` - Contact editor
- `ImageInput.tsx` - Image upload component (al deels geëxtraheerd)

---

## 🟠 MEDIUM TECHNICAL DEBT

### 4. Code Duplication: Image Error Handlers
**Severity:** MEDIUM  
**Locations:**
- `components/Solutions.tsx:74-79` (grid image)
- `components/Solutions.tsx:138-143` (modal image)
- `components/AdminPanel.tsx:740-745` (preview image)

**Issue:** Identieke `onError` handler logica wordt 3x herhaald:
```typescript
onError={(e) => {
  console.error(`Failed to load image...`);
  (e.target as HTMLImageElement).style.display = 'none';
}}
```

**Impact:** 
- 3x dezelfde logica
- Moeilijk om error handling te verbeteren (moet op 3 plaatsen)

**Refactoring:** Extract naar utility functie of custom hook

---

### 5. Code Duplication: Update Functions Sanitization
**Severity:** MEDIUM  
**Location:** `context/ContentContext.tsx:292-410`

**Issue:** Sanitization logica wordt herhaald in:
- `updateHero()` - sanitizeInput call
- `updateSolution()` - conditional sanitization
- `updateAbout()` - conditional sanitization  
- `updatePartners()` - sanitizeInput call
- `updateContact()` - sanitizeInput call

**Pattern:**
```typescript
const sanitized = sanitizeInput(value, maxLength);
// of
const sanitized = field === 'imageUrl' ? sanitizeUrl(value) || value : sanitizeInput(value, maxLength);
```

**Impact:**
- Repetitieve code
- Max length logica verspreid over meerdere functies
- Moeilijk om sanitization regels te wijzigen

**Refactoring:** Extract naar `sanitizeFieldValue()` helper

---

### 6. Complex Function: selectIconFromText
**Severity:** MEDIUM  
**Location:** `context/ContentContext.tsx:342-389` (48 lines)

**Issues:**
- Grote switch-like object (25 icon keywords)
- Complex scoring algoritme
- Diepe nesting (reduce binnen reduce)
- Moeilijk te testen
- Performance: loopt door alle icons voor elke call

**Complexity:**
- Lines: 48
- Cyclomatic Complexity: ~30
- Nested loops: 2 levels

**Refactoring:** 
- Extract iconKeywords naar config file
- Simplify scoring algorithm
- Add memoization voor performance

---

### 7. Debug Logging Code Pollution
**Severity:** MEDIUM  
**Locations:** 124 matches across 21 files

**Issue:** Debug logging code (`#region agent log`) is overal aanwezig maar niet nodig in production:
```typescript
// #region agent log
fetch('http://127.0.0.1:7245/ingest/...', {...}).catch(()=>{});
// #endregion
```

**Impact:**
- Code pollution: ~250+ regels debug code
- Performance impact: onnodige fetch calls
- Bundle size increase
- Moeilijk te lezen code

**Refactoring:** 
- Remove alle debug logging
- Of: conditional compilation voor development only

---

### 8. Repetitive Tab Content Rendering
**Severity:** MEDIUM  
**Location:** `components/AdminPanel.tsx:323-539`

**Issue:** Elke tab heeft vergelijkbare structuur:
- Conditional rendering: `{activeTab === 'hero' && (...)}`
- InputGroup/TextAreaGroup components
- Section headers met `pt-4 border-t border-white/5`
- Similar layout patterns

**Impact:**
- 200+ regels repetitieve JSX
- Moeilijk om layout te wijzigen (moet op 5 plaatsen)

**Refactoring:** Extract naar separate editor components

---

## 🟡 LAGE TECHNICAL DEBT

### 9. Unused Import: Save
**Severity:** LOW  
**Location:** `components/AdminPanel.tsx:2`

**Issue:** `Save` icon wordt geïmporteerd maar nooit gebruikt

**Impact:** Minimale impact, maar onnodige import

---

### 10. Magic Numbers
**Severity:** LOW  
**Locations:** Multiple

**Examples:**
- `15 * 60 * 1000` (15 minutes) - AdminPanel.tsx:77
- `8 * 60 * 60 * 1000` (8 hours) - AdminPanel.tsx:107
- `5 * 1024 * 1024` (5MB) - AdminPanel.tsx:610
- `360 / solutions.length` - Ecosystem.tsx:66

**Impact:** Moeilijk te begrijpen zonder comments

**Refactoring:** Extract naar named constants

---

### 11. Inline Styles Mixed with Tailwind
**Severity:** LOW  
**Location:** `components/Ecosystem.tsx:101, 175-176`

**Issue:** Mix van inline styles en Tailwind classes:
```typescript
style={{ height: `${containerHeight}px` }}
style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
```

**Impact:** Inconsistent styling approach

---

### 12. Hardcoded Strings
**Severity:** LOW  
**Locations:** Multiple

**Issue:** UI strings zijn hardcoded in plaats van constants:
- Error messages
- Button labels
- Placeholder text

**Impact:** Moeilijk te internationaliseren

---

### 13. Long Parameter Lists
**Severity:** LOW  
**Location:** `components/Ecosystem.tsx:155`

**Issue:** `SatelliteNode` component heeft 5 parameters:
```typescript
const SatelliteNode: React.FC<{ icon: React.ReactNode; label: string; angle: number; radius: number; delay: number }>
```

**Impact:** Moeilijk te gebruiken, kan worden verbeterd met object parameter

---

### 14. Complex Conditional Logic
**Severity:** LOW  
**Location:** `components/Solutions.tsx:57-59`

**Issue:** Complexe conditional voor grid centering:
```typescript
const isLastItem = index === content.solutions.length - 1;
const isOddCount = content.solutions.length % 2 !== 0;
const shouldCenter = isLastItem && isOddCount;
```

**Impact:** Moeilijk te begrijpen zonder context

---

### 15. Missing Type Safety
**Severity:** LOW  
**Location:** `components/AdminPanel.tsx:417`

**Issue:** Type assertion zonder validatie:
```typescript
onChange={(e) => updateSolution(index, 'iconName', e.target.value as any)}
```

**Impact:** Type safety risico

---

## 📋 REFACTORING PLAN: AdminPanel.tsx

### Fase 1: Extract Authentication (2-3 uur)
**Doel:** Verwijder authentication logic uit AdminPanel

**Stappen:**
1. Maak `hooks/useAdminAuth.ts` custom hook
2. Verplaats alle auth state en logic naar hook
3. Update AdminPanel om hook te gebruiken

**Resultaat:** ~150 regels minder in AdminPanel

---

### Fase 2: Extract Tab Components (3-4 uur)
**Doel:** Split tab content in separate components

**Stappen:**
1. Maak `components/admin/HeroEditor.tsx`
2. Maak `components/admin/SolutionsEditor.tsx`
3. Maak `components/admin/AboutEditor.tsx`
4. Maak `components/admin/PartnersEditor.tsx`
5. Maak `components/admin/ContactEditor.tsx`
6. Extract `TabButton` component
7. Update AdminPanel om nieuwe components te gebruiken

**Resultaat:** AdminPanel wordt ~400 regels kleiner

---

### Fase 3: Extract Shared Utilities (1-2 uur)
**Doel:** Verwijder duplicatie

**Stappen:**
1. Maak `utils/iconMapper.ts` voor icon mapping
2. Extract image error handler naar utility
3. Extract tab button naar component
4. Update alle bestanden om utilities te gebruiken

**Resultaat:** ~100 regels duplicatie verwijderd

---

### Fase 4: Cleanup & Optimization (1-2 uur)
**Doel:** Final cleanup

**Stappen:**
1. Verwijder debug logging code
2. Extract magic numbers naar constants
3. Verbeter type safety
4. Add JSDoc comments

**Resultaat:** Schonere, beter gedocumenteerde code

---

## 📈 Expected Improvements

### Code Metrics (After Refactoring)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| AdminPanel.tsx LOC | 760 | ~200 | -74% |
| Code Duplication | ~300 lines | ~50 lines | -83% |
| Max Nesting Depth | 7 levels | 4 levels | -43% |
| Cyclomatic Complexity | ~45 | ~15 | -67% |
| Number of Components | 1 monolith | 8 focused | +700% |

### Benefits

1. **Maintainability:** ✅ Veel makkelijker om te onderhouden
2. **Testability:** ✅ Componenten kunnen individueel worden getest
3. **Reusability:** ✅ Componenten kunnen worden hergebruikt
4. **Readability:** ✅ Veel makkelijker te begrijpen
5. **Performance:** ✅ Betere code splitting mogelijk
6. **Type Safety:** ✅ Betere TypeScript support

---

## 🎯 Priority Ranking

1. **🔴 HIGH:** Extract icon mapping (quick win, grote impact)
2. **🔴 HIGH:** Split AdminPanel component (grootste impact)
3. **🟠 MEDIUM:** Remove debug logging (cleanup)
4. **🟠 MEDIUM:** Extract tab buttons (reduce duplication)
5. **🟡 LOW:** Extract constants (polish)

---

## 📝 Implementation Notes

- Start met icon mapping (snelste win)
- Test elke fase voordat je verder gaat
- Behoud backward compatibility tijdens refactoring
- Documenteer nieuwe component interfaces
- Update tests na refactoring
