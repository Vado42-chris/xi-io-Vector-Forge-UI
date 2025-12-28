# MAI (Most Actionable Item) Implementation Guide

**Date:** 2025-01-27  
**Server Timestamp:** 2025-12-27 18:50:00 UTC  
**Local Timestamp:** 2025-12-27 12:50:00 CST  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-008  
**Patent Tracking:** VF-MAI-IMPL-001

## Purpose

This guide provides the implementation framework for the MAI (Most Actionable Item) system, ensuring users see the right tools, preferences, settings, panels, configs, dialogs, tooltips, components, templates, page layouts, page compositions, page weights, visual styles, interactions, features, help options, support options, automation features, MCP protocols, GitHub actions, 3rd party addons, marketplace integrations, business plan integrations, distribution integrations, subscription and finance options, selling options, marketing options, social media options, and other business-related items at the right time based on their context and workflow.

---

## I. MAI System Architecture

### Core Components

1. **Context Detection Engine**
   - User context (role, subscription tier, experience level)
   - Document context (type, state, complexity)
   - System context (errors, warnings, performance)
   - Workflow context (current task, active tool, selected object)

2. **Priority Scoring Engine**
   - Relevance (0-25): How relevant is this to current context?
   - Frequency (0-25): How often is this used?
   - Importance (0-25): How critical is this to user goals?
   - Availability (0-25): How easy is it to access when needed?

3. **Surfacing Rules Engine**
   - P0 (Score > 80): Always visible
   - P1 (Score 60-80): Contextually visible
   - P2 (Score 40-60): Discoverable
   - P3 (Score < 40): Hidden until needed

4. **UI Rendering System**
   - Dynamic panel visibility
   - Contextual menu items
   - Smart tooltips
   - Adaptive layouts

---

## II. Context Detection

### User Context

**Who:** All users  
**What:** User profile data (role, subscription tier, experience level, preferences, usage patterns)  
**When:** On login, when preferences change, when subscription changes  
**Where:** User profile, subscription service, preferences storage  
**Why:** Personalize UI based on user needs and capabilities  
**How to Validate:**
- ✅ User profile loads correctly
- ✅ Subscription tier affects feature visibility
- ✅ Experience level affects help/tutorial visibility
- ✅ Preferences persist and apply correctly
- ✅ Usage patterns are tracked accurately

**MAI Score:** 85 (P0 - Always Applied)

### Document Context

**Who:** All users  
**What:** Document state (type, complexity, layers, keyframes, errors, warnings)  
**When:** On document open, when document changes, when errors occur  
**Where:** Document state, error tracking, layer management  
**Why:** Surface relevant tools and features based on document needs  
**How to Validate:**
- ✅ Document type detected correctly
- ✅ Complexity calculated accurately
- ✅ Errors trigger appropriate help/suggestions
- ✅ Layer count affects UI complexity
- ✅ Keyframes trigger animation tools

**MAI Score:** 80 (P0 - Always Applied)

### System Context

**Who:** All users  
**What:** System state (performance, errors, warnings, updates, maintenance)  
**When:** Continuously, when errors occur, when updates available  
**Where:** Error tracking, performance monitoring, update service  
**Why:** Surface system-relevant information and actions  
**How to Validate:**
- ✅ Errors trigger error dialogs/help
- ✅ Performance issues trigger optimization suggestions
- ✅ Updates trigger update notifications
- ✅ Maintenance windows trigger warnings
- ✅ System health is visible when needed

**MAI Score:** 75 (P1 - Contextually Visible)

### Workflow Context

**Who:** All users  
**What:** Current task, active tool, selected object, recent actions  
**When:** Continuously, when tool changes, when object selected  
**Where:** Application state, tool state, selection state  
**Why:** Surface tools and features relevant to current workflow  
**How to Validate:**
- ✅ Active tool triggers relevant property panels
- ✅ Selected object triggers object inspector
- ✅ Recent actions affect undo/redo visibility
- ✅ Current task affects help content
- ✅ Workflow state persists across sessions

**MAI Score:** 90 (P0 - Always Applied)

---

## III. Priority Scoring Examples

### Example 1: Tool Properties Panel

**Context:** User selects Rectangle tool  
**Scoring:**
- Relevance: 25/25 (directly relevant to active tool)
- Frequency: 20/25 (used frequently when drawing)
- Importance: 22/25 (critical for tool functionality)
- Availability: 18/25 (easily accessible in right panel)

**Total Score:** 85/100 → **P0 (Always Visible)**

**Surfacing Rule:** Show Tool Properties panel in right sidebar, highlight Rectangle-specific properties

---

### Example 2: Marketplace Integration

**Context:** User is working on logo design  
**Scoring:**
- Relevance: 15/25 (somewhat relevant - could use assets)
- Frequency: 10/25 (used occasionally)
- Importance: 12/25 (helpful but not critical)
- Availability: 8/25 (accessible via menu)

**Total Score:** 45/100 → **P2 (Discoverable)**

**Surfacing Rule:** Show subtle hint in Help panel, include in contextual menu, don't clutter main UI

---

### Example 3: Subscription Upgrade Prompt

**Context:** Free user tries to use Pro feature  
**Scoring:**
- Relevance: 25/25 (directly relevant - feature locked)
- Frequency: 5/25 (rarely needed)
- Importance: 25/25 (critical - blocks feature)
- Availability: 20/25 (prompt appears automatically)

**Total Score:** 75/100 → **P1 (Contextually Visible)**

**Surfacing Rule:** Show upgrade prompt modal when feature is accessed, include in feature tooltip

---

## IV. Implementation Strategy

### Phase 1: Core Context Detection (Week 1-2)

1. **User Context Detection**
   - Load user profile on login
   - Track subscription tier
   - Detect experience level
   - Load preferences

2. **Document Context Detection**
   - Detect document type
   - Calculate complexity
   - Track errors/warnings
   - Monitor layer/keyframe count

3. **Workflow Context Detection**
   - Track active tool
   - Track selected object
   - Track recent actions
   - Detect current task

### Phase 2: Priority Scoring (Week 3-4)

1. **Scoring Engine**
   - Implement relevance calculation
   - Implement frequency tracking
   - Implement importance weighting
   - Implement availability scoring

2. **Scoring Rules**
   - Define scoring formulas
   - Create rule sets per UI category
   - Test scoring accuracy
   - Refine based on usage data

### Phase 3: Surfacing Rules (Week 5-6)

1. **P0 (Always Visible)**
   - Primary tools always visible
   - Critical settings always accessible
   - Core features always available

2. **P1 (Contextually Visible)**
   - Show when relevant to context
   - Hide when not relevant
   - Smooth transitions

3. **P2 (Discoverable)**
   - Available via menu/search
   - Shown in help/contextual help
   - Included in onboarding

4. **P3 (Hidden Until Needed)**
   - Advanced settings
   - Developer features
   - Administrative tools

### Phase 4: UI Rendering (Week 7-8)

1. **Dynamic Panel Visibility**
   - Show/hide panels based on score
   - Animate transitions
   - Remember user overrides

2. **Contextual Menu Items**
   - Show relevant actions
   - Hide irrelevant actions
   - Group by priority

3. **Smart Tooltips**
   - Show based on context
   - Include relevant shortcuts
   - Link to help when needed

4. **Adaptive Layouts**
   - Adjust layout based on context
   - Optimize for current task
   - Support user customization

---

## V. UI Category Surfacing Rules

### Tools (MAI Score: 95, P0)

**Surfacing Rules:**
- Always visible in left sidebar
- Active tool highlighted
- Tool properties shown when tool selected
- Keyboard shortcuts always available

**Implementation:**
- ✅ Tools panel always visible
- ✅ Active tool highlighted
- ✅ Tool properties panel shows when tool selected
- ✅ Keyboard shortcuts work

---

### Preferences (MAI Score: 70, P1)

**Surfacing Rules:**
- Available via File menu → Preferences
- Shown in Account menu
- Contextual preferences shown when relevant
- First-time user sees setup wizard

**Implementation:**
- ✅ Preferences dialog accessible
- ✅ Account menu includes preferences
- ⚠️ Contextual preferences (to be implemented)
- ⚠️ Setup wizard (to be implemented)

---

### Settings (MAI Score: 75, P1)

**Surfacing Rules:**
- Document settings shown when creating new document
- Canvas settings in toolbar (always visible)
- Application settings in Preferences
- Advanced settings hidden by default

**Implementation:**
- ✅ Canvas settings in toolbar
- ✅ Document settings in File menu
- ✅ Application settings in Preferences
- ✅ Advanced settings hidden

---

### Panels (MAI Score: 80, P0/P1)

**Surfacing Rules:**
- Core panels (Layers, Properties) always available
- Contextual panels shown when relevant
- Panels can be docked/undocked
- Panel visibility remembered per user

**Implementation:**
- ✅ Core panels always available
- ✅ Panels dockable/undockable
- ✅ Panel visibility remembered
- ⚠️ Contextual panel visibility (to be implemented)

---

### Dialogs (MAI Score: 85, P0)

**Surfacing Rules:**
- Show when user initiates action
- Modal for critical actions
- Non-modal for informational
- Dismissible with ESC/X

**Implementation:**
- ✅ Dialogs show on action
- ✅ Modal/non-modal appropriate
- ✅ Dismissible with ESC/X
- ✅ Accessible

---

### Tooltips (MAI Score: 75, P1)

**Surfacing Rules:**
- Show on hover/focus (300ms delay)
- Include keyboard shortcuts
- Contextual help when available
- Can be disabled in preferences

**Implementation:**
- ✅ Tooltips on hover
- ⚠️ Keyboard shortcuts in tooltips (partial)
- ⚠️ Contextual help links (to be implemented)
- ✅ Can be disabled

---

### Marketplace Integrations (MAI Score: 60, P1)

**Surfacing Rules:**
- Available via menu
- Shown in contextual help when relevant
- Subtle hints in empty states
- Featured in onboarding for creators

**Implementation:**
- ⚠️ Marketplace menu item (to be implemented)
- ⚠️ Contextual hints (to be implemented)
- ⚠️ Empty state hints (to be implemented)
- ⚠️ Onboarding integration (to be implemented)

---

### Subscription & Finance Options (MAI Score: 75, P1)

**Surfacing Rules:**
- Subscription status always visible (header)
- Upgrade prompts when Pro feature accessed
- Billing accessible via Account menu
- Usage visible in Account menu

**Implementation:**
- ✅ Subscription status in header
- ✅ Upgrade prompts functional
- ✅ Billing in Account menu
- ✅ Usage tracking

---

### Social Media Options (MAI Score: 55, P2)

**Surfacing Rules:**
- Available via Share menu
- Shown when exporting
- Contextual hints for creators
- Hidden for non-creators

**Implementation:**
- ⚠️ Share menu (to be implemented)
- ⚠️ Export integration (to be implemented)
- ⚠️ Creator hints (to be implemented)
- ⚠️ Role-based visibility (to be implemented)

---

## VI. Validation Framework

### Functional Validation

**How to Validate:**
1. Test context detection accuracy
2. Test priority scoring correctness
3. Test surfacing rules application
4. Test UI rendering performance

**Success Criteria:**
- ✅ Context detected correctly 95%+ of time
- ✅ Priority scores accurate within 5 points
- ✅ Surfacing rules applied correctly
- ✅ UI renders in <100ms

---

### Usability Validation

**How to Validate:**
1. User testing for discoverability
2. A/B testing for surfacing rules
3. Analytics for feature usage
4. User feedback collection

**Success Criteria:**
- ✅ Users find features within 2 clicks
- ✅ Contextual features reduce clicks by 30%+
- ✅ User satisfaction score >4/5
- ✅ Feature usage increases 20%+

---

### Technical Validation

**How to Validate:**
1. Performance testing
2. Accessibility testing
3. Cross-browser testing
4. Error handling testing

**Success Criteria:**
- ✅ No performance degradation
- ✅ WCAG 2.1 AA compliant
- ✅ Works in all supported browsers
- ✅ Errors handled gracefully

---

### Business Validation

**How to Validate:**
1. Conversion tracking (free → paid)
2. Feature adoption rates
3. User retention metrics
4. Revenue impact analysis

**Success Criteria:**
- ✅ Upgrade conversion increases 15%+
- ✅ Feature adoption increases 25%+
- ✅ User retention improves 10%+
- ✅ Revenue per user increases 20%+

---

## VII. Implementation Checklist

### Core System
- [ ] Context detection engine
- [ ] Priority scoring engine
- [ ] Surfacing rules engine
- [ ] UI rendering system

### User Context
- [ ] User profile loading
- [ ] Subscription tier detection
- [ ] Experience level detection
- [ ] Preference loading

### Document Context
- [ ] Document type detection
- [ ] Complexity calculation
- [ ] Error/warning tracking
- [ ] Layer/keyframe monitoring

### Workflow Context
- [ ] Active tool tracking
- [ ] Selected object tracking
- [ ] Recent actions tracking
- [ ] Current task detection

### UI Category Implementation
- [ ] Tools (P0) - ✅ Complete
- [ ] Preferences (P1) - ✅ Complete
- [ ] Settings (P1) - ✅ Complete
- [ ] Panels (P0/P1) - ✅ Complete
- [ ] Dialogs (P0) - ✅ Complete
- [ ] Tooltips (P1) - ⚠️ Partial
- [ ] Marketplace (P1) - ⚠️ To be implemented
- [ ] Subscriptions (P1) - ✅ Complete
- [ ] Social Media (P2) - ⚠️ To be implemented
- [ ] Business Plans (P2) - ⚠️ To be implemented
- [ ] Distribution (P2) - ⚠️ To be implemented
- [ ] Selling (P2) - ⚠️ To be implemented
- [ ] Marketing (P2) - ⚠️ To be implemented

---

## VIII. Next Steps

1. **Implement Context Detection Engine** (Week 1-2)
2. **Implement Priority Scoring Engine** (Week 3-4)
3. **Implement Surfacing Rules Engine** (Week 5-6)
4. **Implement UI Rendering System** (Week 7-8)
5. **Test and Refine** (Week 9-10)
6. **Deploy and Monitor** (Week 11-12)

---

**This document is part of the legal evidence chain for patent processes and work tracking.**

**Patent:** VF-MAI-IMPL-001  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-008

