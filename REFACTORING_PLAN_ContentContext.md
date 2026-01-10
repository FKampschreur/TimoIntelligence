# Refactoring Plan: ContentContext.tsx

**Target File:** `context/ContentContext.tsx` (763 lines → ~470 lines)  
**Goal:** Reduce complexity, eliminate duplication, improve maintainability

---

## Phase 1: Extract Update Functions (Low Risk, High Impact)

### Step 1.1: Create Generic Update Helper

**New File:** `context/hooks/useContentUpdater.ts`

```typescript
import { sanitizeInput, sanitizeUrl } from '../../utils/security';
import { ContentState } from '../ContentContext';

type FieldConfig = {
  maxLength: number;
  sanitizeUrl?: boolean;
};

type FieldConfigMap<T> = {
  [K in keyof T]?: FieldConfig | number;
};

export function createUpdater<T extends Record<string, any>>(
  section: keyof ContentState,
  fieldConfig: FieldConfigMap<T>
) {
  return (key: keyof T, value: string) => {
    const config = fieldConfig[key];
    const maxLength = typeof config === 'number' ? config : config?.maxLength ?? 500;
    const useUrlSanitization = typeof config === 'object' && config.sanitizeUrl;
    
    const sanitized = useUrlSanitization 
      ? (sanitizeUrl(value) || value)
      : sanitizeInput(value, maxLength);
    
    return { section, key, value: sanitized };
  };
}
```

**Usage:**
```typescript
// In ContentContext.tsx
const heroUpdater = createUpdater<ContentState['hero']>('hero', {
  tag: 500,
  titleLine1: 500,
  titleLine2: 500,
  description: 5000,
  buttonPrimary: 500,
  buttonSecondary: 500,
});

const updateHero = (key: keyof ContentState['hero'], value: string) => {
  const { sanitized } = heroUpdater(key, value);
  setContent(prev => ({
    ...prev,
    hero: { ...prev.hero, [key]: sanitized }
  }));
};
```

**Impact:** 
- Reduces 4 functions (40 lines) → 1 helper + 4 thin wrappers (~25 lines)
- **Savings: 15 lines**

---

## Phase 2: Extract Validation Logic (Medium Risk, High Impact)

### Step 2.1: Create Validation Module

**New File:** `context/validators/contentValidator.ts`

```typescript
import { ContentState, IconName, SolutionData, AboutData, PartnersData, ContactData } from '../ContentContext';

const VALID_ICON_NAMES: IconName[] = [
  'Truck', 'FileText', 'BarChart3', 'Users', 'ImageIcon', 'Zap', 
  'Shield', 'Globe', 'Cpu', 'Building', 'Package', 'Code', 'Settings', 
  'Database', 'Cloud', 'Lock', 'Bell', 'Mail', 'Calendar', 'Wallet', 
  'ShoppingCart', 'TrendingUp', 'Target', 'Puzzle'
];

function validateStringFields<T extends Record<string, any>>(
  obj: any,
  fields: (keyof T)[]
): obj is T {
  return obj && typeof obj === 'object' && 
    fields.every(field => typeof obj[field] === 'string');
}

function validateSolution(sol: any): sol is SolutionData {
  return sol && typeof sol === 'object' &&
    typeof sol.id === 'string' &&
    typeof sol.title === 'string' &&
    typeof sol.subtitle === 'string' &&
    typeof sol.description === 'string' &&
    typeof sol.detailTitle === 'string' &&
    typeof sol.detailText === 'string' &&
    typeof sol.image === 'string' &&
    typeof sol.iconName === 'string' &&
    VALID_ICON_NAMES.includes(sol.iconName);
}

export function validateContentStructure(data: any): data is ContentState {
  if (!data || typeof data !== 'object') return false;

  // Validate hero
  if (!validateStringFields(data.hero, ['tag', 'titleLine1', 'titleLine2', 'description', 'buttonPrimary', 'buttonSecondary'])) {
    return false;
  }

  // Validate solutions
  if (!Array.isArray(data.solutions) || data.solutions.length === 0) {
    return false;
  }
  if (!data.solutions.every(validateSolution)) {
    return false;
  }

  // Validate about
  if (!validateStringFields(data.about, ['tag', 'titleLine1', 'titleLine2', 'paragraph1', 'paragraph2', 'paragraph3', 'feature1Title', 'feature1Description', 'feature2Title', 'feature2Description', 'imageUrl', 'imageCaption', 'imageSubcaption'])) {
    return false;
  }

  // Validate partners
  if (!validateStringFields(data.partners, ['title', 'description', 'feature1Title', 'feature1Description', 'feature2Title', 'feature2Description'])) {
    return false;
  }

  // Validate contact
  if (!validateStringFields(data.contact, ['title', 'introText', 'addressStreet', 'addressPostalCode', 'addressCity', 'addressNote', 'email', 'phone', 'formTitle', 'buttonText'])) {
    return false;
  }

  return true;
}
```

**Impact:**
- Moves 63 lines out of ContentContext
- Reusable validation logic
- **Savings: 63 lines**

---

## Phase 3: Extract Persistence Service (High Risk, High Impact)

### Step 3.1: Create Content Persistence Service

**New File:** `context/services/ContentPersistenceService.ts`

```typescript
import { ContentState } from '../ContentContext';
import { fetchContent, saveContent } from '../../utils/apiService';
import { isApiAvailable } from '../../utils/apiConfig';
import { LocalStorageEncryption } from '../../utils/security';
import { validateContentStructure } from '../validators/contentValidator';

export class ContentPersistenceService {
  private static readonly STORAGE_KEY = 'timo-intelligence-content';

  /**
   * Load content from API or localStorage
   */
  static async loadContent(defaultContent: ContentState): Promise<ContentState> {
    // Try API first
    if (isApiAvailable()) {
      try {
        const response = await fetchContent();
        if (response.success && response.data && validateContentStructure(response.data)) {
          return response.data;
        }
      } catch (error) {
        console.error('Error loading content from API:', error);
      }
    }

    // Fallback to localStorage
    const savedContent = localStorage.getItem(this.STORAGE_KEY);
    if (savedContent) {
      try {
        const parsed = await this.parseStoredContent(savedContent);
        if (parsed && validateContentStructure(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.warn('Failed to load localStorage content:', error);
      }
    }

    return defaultContent;
  }

  /**
   * Parse stored content (handles both JSON and encrypted)
   */
  private static async parseStoredContent(content: string): Promise<ContentState | null> {
    try {
      return JSON.parse(content);
    } catch {
      // Might be encrypted
      if (content.length > 100 && /^[A-Za-z0-9+/=]+$/.test(content)) {
        try {
          const decrypted = await LocalStorageEncryption.decrypt(content);
          return JSON.parse(decrypted);
        } catch {
          return null;
        }
      }
      return null;
    }
  }

  /**
   * Save content to API and/or localStorage
   */
  static async saveContent(
    content: ContentState,
    showError: boolean = false
  ): Promise<{ savedToApi: boolean; savedToLocalStorage: boolean; error?: string }> {
    let savedToApi = false;
    let savedToLocalStorage = false;
    let error: string | undefined;

    // Try API first
    if (isApiAvailable()) {
      try {
        const response = await saveContent(content);
        if (response.success) {
          savedToApi = true;
        } else {
          error = response.error;
          if (showError) {
            console.warn('API save failed:', response.error);
          }
        }
      } catch (err: any) {
        error = err.message;
        if (showError) {
          console.error('Error saving to API:', err);
        }
      }
    }

    // Always save to localStorage
    try {
      const contentString = JSON.stringify(content);
      try {
        const encrypted = await LocalStorageEncryption.encrypt(contentString);
        localStorage.setItem(this.STORAGE_KEY, encrypted);
      } catch (encryptError) {
        console.warn('Encryption failed, saving unencrypted:', encryptError);
        localStorage.setItem(this.STORAGE_KEY, contentString);
      }
      savedToLocalStorage = true;
    } catch (err: any) {
      if (err?.name === 'QuotaExceededError' || err?.code === 22) {
        error = 'Opslagruimte vol. Uw wijzigingen kunnen niet worden opgeslagen.';
      } else {
        error = error || 'Fout bij opslaan van wijzigingen.';
      }
    }

    return { savedToApi, savedToLocalStorage, error };
  }
}
```

**Impact:**
- Moves ~150 lines out of ContentContext
- Separates persistence concerns
- Easier to test
- **Savings: 150 lines**

---

## Phase 4: Extract Icon Selection (Low Risk, Medium Impact)

### Step 4.1: Move to Icon Mapper

**Update:** `utils/iconMapper.tsx`

```typescript
// Add icon keyword mapping
export const ICON_KEYWORDS: { [key in IconName]: string[] } = {
  Truck: ['vloot', 'fleet', 'transport', 'vervoer', 'voertuig', 'chauffeur', 'route', 'logistiek'],
  // ... rest of mappings
};

export function selectIconFromText(title: string, description: string): IconName {
  const text = `${title} ${description}`.toLowerCase();
  
  const scores: { [key in IconName]?: number } = {};
  
  for (const [icon, keywords] of Object.entries(ICON_KEYWORDS)) {
    scores[icon as IconName] = keywords.reduce((score, keyword) => {
      return score + (text.includes(keyword) ? 1 : 0);
    }, 0);
  }

  const bestMatch = Object.entries(scores).reduce((best, [icon, score]) => {
    return (score || 0) > (best.score || 0) 
      ? { icon: icon as IconName, score: score || 0 } 
      : best;
  }, { icon: 'Cpu' as IconName, score: 0 });

  return bestMatch.score > 0 ? bestMatch.icon : 'Cpu';
}
```

**Impact:**
- Moves 47 lines out of ContentContext
- Better organization (icon logic with icon mapper)
- **Savings: 47 lines**

---

## Phase 5: Refactored ContentContext Structure

### Target Structure

```
context/
├── ContentContext.tsx (~300 lines) ✨ Reduced from 763
│   ├── Types & Interfaces
│   ├── Default Content
│   ├── Context Definition
│   └── ContentProvider (simplified)
│       ├── State Management
│       ├── Update Functions (using helpers)
│       └── Provider JSX
│
├── hooks/
│   └── useContentUpdater.ts (NEW)
│
├── services/
│   └── ContentPersistenceService.ts (NEW)
│
└── validators/
    └── contentValidator.ts (NEW)
```

---

## Implementation Steps

### Week 1: Low-Risk Refactorings
1. ✅ Extract update functions → `useContentUpdater.ts`
2. ✅ Extract icon selection → `iconMapper.tsx`
3. ✅ Extract validation → `contentValidator.ts`

**Estimated Time:** 4-6 hours  
**Risk:** Low  
**Impact:** ~125 lines reduced

### Week 2: High-Impact Refactoring
4. ✅ Extract persistence → `ContentPersistenceService.ts`
5. ✅ Update ContentContext to use new services
6. ✅ Remove duplicate `loadSavedContentFromLocalStorage()`

**Estimated Time:** 6-8 hours  
**Risk:** Medium-High  
**Impact:** ~150 lines reduced

### Week 3: Testing & Cleanup
7. ✅ Test all functionality
8. ✅ Update imports
9. ✅ Remove unused code
10. ✅ Documentation

**Estimated Time:** 2-4 hours  
**Risk:** Low

---

## Testing Strategy

### Unit Tests Needed
- `contentValidator.test.ts` - Test validation logic
- `ContentPersistenceService.test.ts` - Test save/load
- `useContentUpdater.test.ts` - Test update helpers

### Integration Tests
- ContentContext integration with new services
- End-to-end content save/load flow

---

## Risk Mitigation

1. **Create feature branch** for refactoring
2. **Write tests first** (TDD approach)
3. **Refactor incrementally** - one phase at a time
4. **Test after each phase** before proceeding
5. **Keep old code** commented until fully tested

---

## Success Metrics

- ✅ ContentContext.tsx reduced from 763 → ~300 lines (60% reduction)
- ✅ Zero code duplication in update functions
- ✅ All tests passing
- ✅ No functionality changes (refactoring only)
- ✅ Improved code maintainability score

---

## Rollback Plan

If issues arise:
1. Revert to previous commit
2. All changes are in separate files (easy to remove)
3. No database/API changes required

---

## Estimated Total Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| ContentContext.tsx lines | 763 | ~300 | -60% |
| Duplicated code | ~90 lines | 0 | -100% |
| Max nesting depth | 5 | 3 | -40% |
| Functions per file | 18+ | ~8 | -55% |
| Test coverage | 0% | Target: 80% | +80% |

---

## Next Actions

1. Review this plan with team
2. Create feature branch: `refactor/content-context`
3. Start with Phase 1 (lowest risk)
4. Set up testing framework
5. Begin incremental refactoring

---

**Status:** 📋 Ready for implementation  
**Priority:** High  
**Estimated Total Time:** 12-18 hours
