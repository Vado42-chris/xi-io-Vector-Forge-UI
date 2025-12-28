# Comprehensive MAI UI Surfacing Plan

**Date:** 2025-01-27  
**Server Timestamp:** 2025-12-27 19:10:00 UTC  
**Local Timestamp:** 2025-12-27 13:10:00 CST  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-013  
**Patent Tracking:** VF-MAI-SURFACING-001

## Purpose

This document provides a comprehensive plan for surfacing all UI elements (tools, preferences, settings, panels, configs, dialogs, tooltips, components, templates, page layouts, page compositions, page weights, visual styles, interactions, features, help options, support options, automation features, MCP protocols, GitHub actions, 3rd party addons, marketplace integrations, business plan integrations, distribution integrations, subscription and finance options, selling options, marketing options, social media options, and other business-related items) based on the MAI (Most Actionable Item) framework, ensuring users see the right tools at the right time.

---

## I. MAI Framework Overview

### Core Principle
**Surface the most actionable item for the user's current context.**

### Scoring Formula
```
MAI Score = Relevance (0-25) + Frequency (0-25) + Importance (0-25) + Availability (0-25)
```

### Priority Levels
- **P0 (Score > 80):** Always visible - Primary tools, critical settings
- **P1 (Score 60-80):** Contextually visible - Relevant to current tool/selection
- **P2 (Score 40-60):** Discoverable - Advanced features, power user options
- **P3 (Score < 40):** Hidden until needed - Rarely used, administrative

---

## II. Context Detection

### User Context
- **Role:** Designer, Animator, Developer, Business User
- **Subscription Tier:** Free, Pro, Enterprise
- **Experience Level:** Beginner, Intermediate, Advanced, Expert
- **Preferences:** Saved settings, custom layouts, keyboard shortcuts
- **Usage Patterns:** Frequently used features, workflows

### Document Context
- **Type:** Vector, Animation, Template, Project
- **Complexity:** Simple, Moderate, Complex, Very Complex
- **State:** New, In Progress, Saved, Exported
- **Errors/Warnings:** Active errors, warnings, suggestions
- **Layer Count:** Number of layers, groups, effects

### System Context
- **Performance:** CPU usage, memory, GPU acceleration
- **Errors:** System errors, API failures, network issues
- **Updates:** Available updates, maintenance windows
- **Health:** System status, service availability

### Workflow Context
- **Active Tool:** Currently selected tool
- **Selected Object:** Currently selected layer/object
- **Recent Actions:** Undo/redo history, recent operations
- **Current Task:** Drawing, editing, animating, exporting

---

## III. UI Category Surfacing Rules

### 1. Tools (MAI Score: 95, P0)

**5Ws:**
- **Who:** All users
- **What:** Drawing, selection, transformation, navigation tools
- **When:** Always available, contextually highlighted when active
- **Where:** Left sidebar (primary), toolbar (quick access), keyboard shortcuts
- **Why:** Core functionality - users need immediate access

**Surfacing Rules:**
- ✅ Always visible in left sidebar
- ✅ Active tool highlighted
- ✅ Tool properties shown when tool selected
- ✅ Keyboard shortcuts always available
- ✅ Tooltips include shortcuts and descriptions

**Implementation:** ✅ Complete

---

### 2. Preferences (MAI Score: 70, P1)

**5Ws:**
- **Who:** All users (power users most frequently)
- **What:** User-specific settings (theme, keyboard shortcuts, default tool properties, UI layout)
- **When:** On first use (setup), when user wants to customize, when troubleshooting
- **Where:** File menu → Preferences, Account menu → Settings, dedicated Preferences dialog
- **Why:** Personalization and accessibility

**Surfacing Rules:**
- Available via File menu → Preferences (P1)
- Shown in Account menu (P1)
- Contextual preferences shown when relevant (P1)
- First-time user sees setup wizard (P0)
- Advanced preferences hidden by default (P2)

**Implementation:** ✅ Complete (basic), ⚠️ Contextual preferences (to be implemented)

---

### 3. Settings (MAI Score: 75, P1)

**5Ws:**
- **Who:** All users (varies by setting type)
- **What:** Document-level and application-level settings (snap to grid, units, color mode, performance)
- **When:** When creating new document, when adjusting workflow, when optimizing performance
- **Where:** Document setup dialog, Canvas settings toolbar, Preferences
- **Why:** Control over document properties and application behavior

**Surfacing Rules:**
- Document settings shown when creating new document (P1)
- Canvas settings in toolbar (always visible) (P0)
- Application settings in Preferences (P1)
- Advanced settings hidden by default (P2)

**Implementation:** ✅ Complete

---

### 4. Panels (MAI Score: 80, P0/P1)

**5Ws:**
- **Who:** All users (power users most frequently)
- **What:** Dockable UI panels (Layers, Properties, Tool Options, Scripts, AI Chat, Registry, etc.)
- **When:** When working with specific features (layers when managing objects, properties when editing)
- **Where:** Left/right sidebars, dockable/floating windows
- **Why:** Organized access to features without cluttering main workspace

**Surfacing Rules:**
- Core panels (Layers, Properties) always available (P0)
- Contextual panels shown when relevant (P1)
- Panels can be docked/undocked (P1)
- Panel visibility remembered per user (P1)

**Implementation:** ✅ Complete (basic), ⚠️ Contextual visibility (to be implemented)

---

### 5. Configs (MAI Score: 50, P2)

**5Ws:**
- **Who:** Power users, administrators, developers
- **What:** Advanced configuration files (workspace layouts, tool presets, export profiles, AI model settings)
- **When:** When setting up workspace, when creating custom workflows, when configuring integrations
- **Where:** Preferences → Advanced, Config files, Import/Export dialogs
- **Why:** Deep customization for power users and system administrators

**Surfacing Rules:**
- Available via Preferences → Advanced (P2)
- Configs can be exported/imported (P2)
- Configs have version numbers (P2)
- Configs can be shared between users (P2)

**Implementation:** ⚠️ To be implemented

---

### 6. Dialogs (MAI Score: 85, P0)

**5Ws:**
- **Who:** All users (varies by dialog)
- **What:** Modal and non-modal dialogs (New Document, Export, Preferences, Error messages, Confirmations)
- **When:** When user initiates action requiring input or confirmation
- **Where:** Center of screen (modal), contextual position (non-modal)
- **Why:** Focused interaction for specific tasks, prevent accidental actions

**Surfacing Rules:**
- Show when user initiates action (P0)
- Modal for critical actions (P0)
- Non-modal for informational (P1)
- Dismissible with ESC/X (P0)

**Implementation:** ✅ Complete

---

### 7. Tooltips (MAI Score: 75, P1)

**5Ws:**
- **Who:** All users (especially new users)
- **What:** Contextual help text on hover/focus (tool names, keyboard shortcuts, feature descriptions)
- **When:** On hover/focus, after delay (300ms default), when feature is first used
- **Where:** Near the UI element, positioned to not obscure content
- **Why:** Discoverability and learning

**Surfacing Rules:**
- Show on hover/focus (300ms delay) (P1)
- Include keyboard shortcuts (P1)
- Contextual help when available (P1)
- Can be disabled in preferences (P2)

**Implementation:** ✅ Complete (Phase 1), ⚠️ Property inputs (to be implemented)

---

### 8. Components (MAI Score: 40, P2)

**5Ws:**
- **Who:** Developers, designers (internal), end users (via customization)
- **What:** Reusable UI components (buttons, inputs, panels, cards, modals)
- **When:** During development, when customizing UI, when building extensions
- **Where:** Component library, codebase, extension API
- **Why:** Consistency, maintainability, extensibility

**Surfacing Rules:**
- Available in component library (P2)
- Documented for developers (P2)
- Accessible for customization (P2)

**Implementation:** ✅ Complete (basic), ⚠️ Component library UI (to be implemented)

---

### 9. Templates (MAI Score: 65, P1)

**5Ws:**
- **Who:** All users (especially new users)
- **What:** Pre-configured document templates (business card, poster, logo, animation preset)
- **When:** When creating new document, when starting new project
- **Where:** New Document dialog, Template gallery, Welcome screen
- **Why:** Speed up workflow, provide starting points

**Surfacing Rules:**
- Show in New Document dialog (P1)
- Template gallery accessible (P1)
- Templates can be searched (P1)
- Templates can be customized (P1)

**Implementation:** ⚠️ To be implemented

---

### 10. Page Layouts (MAI Score: 70, P1)

**5Ws:**
- **Who:** All users
- **What:** Document page layouts (single page, multi-page, artboard layouts)
- **When:** When creating new document, when changing document structure
- **Where:** Document Setup dialog, Page/Artboard panel
- **Why:** Control over document structure and organization

**Surfacing Rules:**
- Show in Document Setup dialog (P1)
- Layouts can be customized (P1)
- Layouts can be saved (P1)

**Implementation:** ⚠️ To be implemented

---

### 11. Page Compositions (MAI Score: 55, P2)

**5Ws:**
- **Who:** Designers, layout artists
- **What:** Complex multi-element compositions (grids, guides, master pages, style sheets)
- **When:** When creating complex documents, when setting up design systems
- **Where:** Document Setup, Master Pages panel, Style Sheets panel
- **Why:** Efficiency and consistency in complex projects

**Surfacing Rules:**
- Available in Document Setup (P2)
- Compositions can be applied to multiple pages (P2)
- Compositions can be exported/imported (P2)

**Implementation:** ⚠️ To be implemented

---

### 12. Page Weights (MAI Score: 80, P0)

**5Ws:**
- **Who:** Designers, UX professionals
- **What:** Visual hierarchy and importance of UI elements (size, color, position, contrast)
- **When:** During design, when customizing UI, when optimizing for different screen sizes
- **Where:** Design system, CSS variables, component properties
- **Why:** Clear visual hierarchy guides user attention

**Surfacing Rules:**
- Always applied (P0)
- Primary actions are visually prominent (P0)
- Secondary actions are less prominent (P1)
- Visual weight matches functional importance (P0)

**Implementation:** ✅ Complete (design system), ⚠️ Dynamic adjustment (to be implemented)

---

### 13. Visual Styles (MAI Score: 70, P1)

**5Ws:**
- **Who:** All users (especially designers)
- **What:** Visual appearance (themes, color schemes, fonts, spacing, borders, shadows)
- **When:** On first use, when customizing appearance, when switching themes
- **Where:** Preferences → Appearance, Theme selector, Style panel
- **Why:** Personalization, accessibility, brand consistency

**Surfacing Rules:**
- Available in Preferences → Appearance (P1)
- Theme selector accessible (P1)
- Styles can be customized (P1)
- Styles can be exported/imported (P2)

**Implementation:** ✅ Complete (basic), ⚠️ Advanced customization (to be implemented)

---

### 14. Interactions (MAI Score: 90, P0)

**5Ws:**
- **Who:** All users
- **What:** User interactions (clicks, drags, keyboard shortcuts, gestures, hover states)
- **When:** Always (core to application use)
- **Where:** Throughout UI (buttons, canvas, panels, menus)
- **Why:** How users interact with and control the application

**Surfacing Rules:**
- Always active (P0)
- Interactions are responsive (<100ms feedback) (P0)
- Interactions have visual feedback (P0)
- Interactions support keyboard alternatives (P0)

**Implementation:** ✅ Complete

---

### 15. Features (MAI Score: 85, P0)

**5Ws:**
- **Who:** All users (varies by feature)
- **What:** Application features (layers, paths, text, effects, animation, AI assistance)
- **When:** When user needs specific functionality
- **Where:** Throughout application (tools, menus, panels, canvas)
- **Why:** Core functionality that enables user goals

**Surfacing Rules:**
- Features are discoverable (P0)
- Features work as documented (P0)
- Features have help/documentation (P1)
- Features are accessible (P0)

**Implementation:** ✅ Complete (core features), ⚠️ Advanced features (to be implemented)

---

### 16. Help Options (MAI Score: 75, P1)

**5Ws:**
- **Who:** All users (especially new users)
- **What:** Help content (documentation, tutorials, tooltips, contextual help, keyboard shortcuts)
- **When:** When user needs assistance, when learning features, when stuck
- **Where:** Help menu, Contextual Help panel, Tooltips, Welcome screen
- **Why:** User education and support

**Surfacing Rules:**
- Help is searchable (P1)
- Help is contextual (relevant to current task) (P1)
- Help includes examples (P1)
- Help includes keyboard shortcuts (P1)

**Implementation:** ✅ Complete (basic), ⚠️ Comprehensive help system (to be implemented)

---

### 17. Support Options (MAI Score: 70, P1)

**5Ws:**
- **Who:** Users needing assistance
- **What:** Support channels (bug reports, feature requests, community forums, email support, chat)
- **When:** When encountering issues, when requesting features, when needing help
- **Where:** Help menu, Bug Reporter dialog, Feature Request dialog, Support website
- **Why:** User support and feedback collection

**Surfacing Rules:**
- Support channels are easily accessible (P1)
- Support forms are easy to fill out (P1)
- Support includes relevant context (P1)
- Support provides confirmation/acknowledgment (P1)

**Implementation:** ✅ Complete (basic), ⚠️ Full support system (to be implemented)

---

### 18. Automation Features (MAI Score: 60, P2)

**5Ws:**
- **Who:** Power users, developers, designers (workflow optimization)
- **What:** Automation tools (macros, scripts, batch processing, AI assistance, workflows)
- **When:** When repeating tasks, when optimizing workflow, when processing multiple files
- **Where:** Scripts panel, Automation menu, AI Chat, Workflow builder
- **Why:** Efficiency and consistency

**Surfacing Rules:**
- Available via Scripts panel (P2)
- Automations are recordable/creatable (P2)
- Automations can be saved/shared (P2)
- Automations are documented (P2)

**Implementation:** ✅ Complete (basic), ⚠️ Advanced automation (to be implemented)

---

### 19. MCP Protocols (MAI Score: 55, P2)

**5Ws:**
- **Who:** Developers, power users, AI integration users
- **What:** Model Context Protocol integration (local AI, code editing, file operations, terminal access)
- **When:** When using AI features, when automating tasks, when integrating with external tools
- **Where:** AI Chat panel, Settings → Integrations, Code Editor
- **Why:** Enable AI-powered features and tool integration

**Surfacing Rules:**
- Available in Settings → Integrations (P2)
- MCP servers are configurable (P2)
- MCP connections are secure (P2)
- MCP features are documented (P2)

**Implementation:** ✅ Complete (basic), ⚠️ Full MCP integration (to be implemented)

---

### 20. GitHub Actions (MAI Score: 45, P2)

**5Ws:**
- **Who:** Developers, teams, CI/CD users
- **What:** GitHub Actions integration (automated testing, deployment, version control workflows)
- **When:** When setting up CI/CD, when automating development workflows
- **Where:** Settings → Integrations → GitHub, Project settings
- **Why:** Automation and collaboration for development teams

**Surfacing Rules:**
- Available in Settings → Integrations (P3)
- Actions are configurable (P2)
- Actions support common workflows (P2)
- Actions are documented (P2)

**Implementation:** ⚠️ To be implemented

---

### 21. 3rd Party Addons (MAI Score: 65, P1)

**5Ws:**
- **Who:** All users (varies by addon)
- **What:** Third-party extensions, plugins, integrations (export formats, cloud storage, design tools)
- **When:** When user needs specific functionality not in core app
- **Where:** Marketplace, Extensions menu, Settings → Addons
- **Why:** Extensibility - allow users to add functionality

**Surfacing Rules:**
- Available via Marketplace (P1)
- Addons are installable/uninstallable (P1)
- Addons are secure (sandboxed, reviewed) (P1)
- Addons are compatible (version checking) (P1)

**Implementation:** ⚠️ To be implemented

---

### 22. Marketplace Integrations (MAI Score: 60, P1)

**5Ws:**
- **Who:** All users (buyers and sellers)
- **What:** Browse, search, purchase, sell assets (templates, scripts, addons, brushes, effects)
- **When:** When user needs assets, when user wants to sell content, when discovering resources
- **Where:** Marketplace panel, Asset browser, File menu → Marketplace, Contextual hints
- **Why:** Enable asset sharing, monetization, ecosystem growth

**Surfacing Rules:**
- Show in Marketplace panel (P1)
- Show contextual hint when user tries to import unavailable asset (P1)
- Show in onboarding for creators (P1)
- Hide for users who haven't expressed interest (P2)

**Implementation:** ⚠️ To be implemented

---

### 23. Subscription & Finance Options (MAI Score: 75, P1)

**5Ws:**
- **Who:** All users (especially paying customers)
- **What:** Subscription management (tiers, billing, payment methods, usage tracking, upgrades)
- **When:** On login, when managing account, when viewing usage, when upgrading, when feature locked
- **Where:** Account menu, Billing panel, Subscription status indicator, Upgrade prompts
- **Why:** Monetization and user management

**Surfacing Rules:**
- Subscription status always visible in header (P0)
- Billing panel accessible via Account menu (P1)
- Upgrade prompt shown when Pro feature accessed (P1)
- Usage visible in Account menu (P1)

**Implementation:** ✅ Complete

---

### 24. Selling Options (MAI Score: 55, P2)

**5Ws:**
- **Who:** Content creators, asset sellers
- **What:** Selling features (pricing, licensing, royalties, payment processing)
- **When:** When user wants to sell assets, when setting up shop, when managing sales
- **Where:** Marketplace → Sell, Asset properties → Pricing, Seller dashboard
- **Why:** Enable users to monetize their content

**Surfacing Rules:**
- Show in Marketplace when user has creator role (P1)
- Show in asset properties when asset is user's own (P1)
- Hidden for non-creators (P3)
- Featured in onboarding for creators (P1)

**Implementation:** ⚠️ To be implemented

---

### 25. Marketing Options (MAI Score: 50, P2)

**5Ws:**
- **Who:** Marketing teams, content creators
- **What:** Marketing features (social sharing, analytics, campaigns, promotions)
- **When:** When promoting content, when analyzing reach, when running campaigns
- **Where:** Share menu, Analytics dashboard, Marketing panel
- **Why:** Enable content promotion and marketing

**Surfacing Rules:**
- Show in Share menu when content is ready (P1)
- Show in Analytics dashboard for creators (P1)
- Hidden for non-creators (P3)
- Contextual hints when content is shareable (P2)

**Implementation:** ⚠️ To be implemented

---

### 26. Social Media Options (MAI Score: 55, P2)

**5Ws:**
- **Who:** Content creators, social media managers
- **What:** Social media features (direct posting, scheduling, format optimization, analytics)
- **When:** When posting to social media, when scheduling content
- **Where:** Share menu, Social Media panel, Export → Social Media
- **Why:** Streamline social media workflow

**Surfacing Rules:**
- Show in Share menu when content is ready (P1)
- Show in Export dialog when exporting (P1)
- Hidden for non-creators (P3)
- Contextual hints for creators (P2)

**Implementation:** ⚠️ To be implemented

---

### 27. Business Plan Integrations (MAI Score: 50, P2)

**5Ws:**
- **Who:** Business users, teams, enterprises
- **What:** Business features (team collaboration, project management, analytics, reporting)
- **When:** When working in teams, when managing projects, when analyzing usage
- **Where:** Team panel, Project settings, Analytics dashboard
- **Why:** Support business workflows and team collaboration

**Surfacing Rules:**
- Show for Business/Enterprise tier users (P1)
- Hidden for Free/Pro tier users (P3)
- Featured in upgrade prompts for teams (P1)

**Implementation:** ⚠️ To be implemented

---

### 28. Distribution Integrations (MAI Score: 55, P2)

**5Ws:**
- **Who:** Content creators, publishers
- **What:** Distribution features (export to platforms, publishing workflows, format conversion)
- **When:** When publishing content, when exporting for specific platforms
- **Where:** Export dialog, Publish menu, Distribution settings
- **Why:** Enable content distribution to various platforms

**Surfacing Rules:**
- Show in Export dialog for creators (P1)
- Show in Publish menu (P1)
- Hidden for non-creators (P3)

**Implementation:** ⚠️ To be implemented

---

## IV. Implementation Strategy

### Phase 1: Core Context Detection (Weeks 1-2)
1. User context (role, subscription, experience)
2. Document context (type, complexity, errors)
3. Workflow context (active tool, selection)
4. System context (performance, errors)

### Phase 2: Priority Scoring (Weeks 3-4)
1. Scoring engine
2. Rule sets
3. Testing
4. Refinement

### Phase 3: Surfacing Rules (Weeks 5-6)
1. P0 rules (always visible)
2. P1 rules (contextually visible)
3. P2 rules (discoverable)
4. P3 rules (hidden)

### Phase 4: UI Rendering (Weeks 7-8)
1. Dynamic panel visibility
2. Contextual menus
3. Smart tooltips
4. Adaptive layouts

---

## V. Validation Framework

### Functional Validation
- ✅ Context detected correctly 95%+ of time
- ✅ Priority scores accurate within 5 points
- ✅ Surfacing rules applied correctly
- ✅ UI renders in <100ms

### Usability Validation
- ✅ Users find features within 2 clicks
- ✅ Contextual features reduce clicks by 30%+
- ✅ User satisfaction score >4/5
- ✅ Feature usage increases 20%+

### Technical Validation
- ✅ No performance degradation
- ✅ WCAG 2.1 AA compliant
- ✅ Works in all supported browsers
- ✅ Errors handled gracefully

### Business Validation
- ✅ Upgrade conversion increases 15%+
- ✅ Feature adoption increases 25%+
- ✅ User retention improves 10%+
- ✅ Revenue per user increases 20%+

---

## VI. Next Steps

### Immediate (This Week)
1. ✅ Enhanced tooltips (DONE)
2. ⚠️ Test right panel interactions (IN PROGRESS)
3. ⚠️ Complete file menu handlers (IN PROGRESS)

### Short-Term (Weeks 2-4)
1. Implement MAI framework foundation
2. Enhance Object Inspector (blend modes, transforms)
3. Implement Registry panel fully
4. Add tooltips to property inputs

### Medium-Term (Weeks 5-12)
1. Workspace panel
2. Tasks panel & SprintBoard
3. Community tools UI
4. Advanced features

### Long-Term (Months 4-12)
1. Full business features
2. Advanced technical features
3. Enterprise features

---

**This document is part of the legal evidence chain for patent processes and work tracking.**

**Patent:** VF-MAI-SURFACING-001  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-013

