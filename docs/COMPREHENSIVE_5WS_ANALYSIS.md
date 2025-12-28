# Comprehensive 5Ws Analysis for All UI Categories

**Date:** 2025-01-27  
**Server Timestamp:** 2025-12-27 18:40:00 UTC  
**Local Timestamp:** 2025-12-27 12:40:00 CST  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-006  
**Patent Tracking:** VF-5WS-ANALYSIS-001

## Purpose

This document provides comprehensive 5Ws (Who, What, When, Where, Why) analysis for ALL UI categories in VectorForge, along with validation "Hows" to ensure requirements are met. This serves as the foundation for the MAI (Most Actionable Item) framework implementation.

---

## I. Core UI Elements

### 1. Tools

**Who:** All users (designers, animators, developers)  
**What:** Drawing, selection, transformation, navigation tools (pen, rectangle, ellipse, select, pan, zoom, etc.)  
**When:** Always available, contextually highlighted when active  
**Where:** Left sidebar (primary), toolbar (quick access), keyboard shortcuts  
**Why:** Core functionality - users need immediate access to create and manipulate vector objects  
**How to Validate:**
- ✅ Tool is visible and accessible within 2 clicks
- ✅ Active tool is visually distinct
- ✅ Keyboard shortcuts work
- ✅ Tool properties update when tool is selected
- ✅ Tool works on canvas (creates/modifies objects)
- ✅ Click tracking records tool usage

**MAI Score:** 95 (P0 - Always Visible)

---

### 2. Preferences

**Who:** All users (power users most frequently)  
**What:** User-specific settings (theme, keyboard shortcuts, default tool properties, UI layout)  
**When:** On first use (setup), when user wants to customize, when troubleshooting  
**Where:** File menu → Preferences, Account menu → Settings, dedicated Preferences dialog  
**Why:** Personalization and accessibility - users need to adapt the UI to their workflow  
**How to Validate:**
- ✅ Preferences persist across sessions
- ✅ Changes apply immediately or with clear "Apply" button
- ✅ Preferences are categorized logically
- ✅ Search/filter available for many preferences
- ✅ Reset to defaults option available
- ✅ Export/import preferences for backup

**MAI Score:** 70 (P1 - Contextually Visible)

---

### 3. Settings

**Who:** All users (varies by setting type)  
**What:** Document-level and application-level settings (snap to grid, units, color mode, performance)  
**When:** When creating new document, when adjusting workflow, when optimizing performance  
**Where:** Document setup dialog, Canvas settings toolbar, Preferences  
**Why:** Control over document properties and application behavior  
**How to Validate:**
- ✅ Settings are clearly labeled with descriptions
- ✅ Settings have appropriate defaults
- ✅ Settings persist per document or globally as appropriate
- ✅ Settings affect behavior immediately
- ✅ Settings are grouped by function
- ✅ Advanced settings are hidden by default but discoverable

**MAI Score:** 75 (P1 - Contextually Visible)

---

### 4. Panels

**Who:** All users (power users most frequently)  
**What:** Dockable UI panels (Layers, Properties, Tool Options, Scripts, AI Chat, Registry, etc.)  
**When:** When working with specific features (layers when managing objects, properties when editing)  
**Where:** Left/right sidebars, dockable/floating windows  
**Why:** Organized access to features without cluttering main workspace  
**How to Validate:**
- ✅ Panels can be docked/undocked
- ✅ Panels can be resized
- ✅ Panels remember position and size
- ✅ Panels can be hidden/shown via menu or keyboard
- ✅ Panel content updates based on selection/context
- ✅ Multiple panels can be open simultaneously

**MAI Score:** 80 (P0/P1 - Contextually Visible)

---

### 5. Configs

**Who:** Power users, administrators, developers  
**What:** Advanced configuration files (workspace layouts, tool presets, export profiles, AI model settings)  
**When:** When setting up workspace, when creating custom workflows, when configuring integrations  
**Where:** Preferences → Advanced, Config files, Import/Export dialogs  
**Why:** Deep customization for power users and system administrators  
**How to Validate:**
- ✅ Configs can be exported/imported
- ✅ Configs are validated before applying
- ✅ Configs have version numbers
- ✅ Configs can be shared between users
- ✅ Configs have clear documentation
- ✅ Invalid configs show helpful error messages

**MAI Score:** 50 (P2 - Discoverable)

---

### 6. Dialogs

**Who:** All users (varies by dialog)  
**What:** Modal and non-modal dialogs (New Document, Export, Preferences, Error messages, Confirmations)  
**When:** When user initiates action requiring input or confirmation  
**Where:** Center of screen (modal), contextual position (non-modal)  
**Why:** Focused interaction for specific tasks, prevent accidental actions  
**How to Validate:**
- ✅ Dialogs are accessible (keyboard navigation, screen readers)
- ✅ Dialogs have clear titles and descriptions
- ✅ Dialogs have appropriate buttons (OK, Cancel, Apply, etc.)
- ✅ Dialogs can be dismissed (ESC key, X button)
- ✅ Dialogs remember last used values where appropriate
- ✅ Dialogs show validation errors inline

**MAI Score:** 85 (P0 - Always Visible When Needed)

---

### 7. Tooltips

**Who:** All users (especially new users)  
**What:** Contextual help text on hover/focus (tool names, keyboard shortcuts, feature descriptions)  
**When:** On hover/focus, after delay (300ms default), when feature is first used  
**Where:** Near the UI element, positioned to not obscure content  
**Why:** Discoverability and learning - users need to understand what features do  
**How to Validate:**
- ✅ Tooltips appear after reasonable delay
- ✅ Tooltips are readable (contrast, font size)
- ✅ Tooltips don't obscure important content
- ✅ Tooltips include keyboard shortcuts when available
- ✅ Tooltips can be disabled in preferences
- ✅ Tooltips work with keyboard navigation

**MAI Score:** 75 (P1 - Contextually Visible)

---

## II. Layout & Composition

### 8. Components

**Who:** Developers, designers (internal), end users (via customization)  
**What:** Reusable UI components (buttons, inputs, panels, cards, modals)  
**When:** During development, when customizing UI, when building extensions  
**Where:** Component library, codebase, extension API  
**Why:** Consistency, maintainability, extensibility  
**How to Validate:**
- ✅ Components follow design system
- ✅ Components are accessible (WCAG 2.1 AA)
- ✅ Components are documented
- ✅ Components are testable
- ✅ Components are customizable
- ✅ Components work across browsers/platforms

**MAI Score:** 40 (P2 - Developer-Facing)

---

### 9. Templates

**Who:** All users (especially new users)  
**What:** Pre-configured document templates (business card, poster, logo, animation preset)  
**When:** When creating new document, when starting new project  
**Where:** New Document dialog, Template gallery, Welcome screen  
**Why:** Speed up workflow, provide starting points, ensure correct document setup  
**How to Validate:**
- ✅ Templates are categorized
- ✅ Templates have previews
- ✅ Templates can be searched
- ✅ Templates can be customized
- ✅ Templates can be saved as custom templates
- ✅ Templates include helpful comments/guides

**MAI Score:** 65 (P1 - Contextually Visible)

---

### 10. Page Layouts

**Who:** All users  
**What:** Document page layouts (single page, multi-page, artboard layouts)  
**When:** When creating new document, when changing document structure  
**Where:** Document Setup dialog, Page/Artboard panel  
**Why:** Control over document structure and organization  
**How to Validate:**
- ✅ Layouts are clearly labeled
- ✅ Layouts have previews
- ✅ Layouts can be customized
- ✅ Layouts can be saved
- ✅ Layouts support different page sizes
- ✅ Layouts work with export/print

**MAI Score:** 70 (P1 - Contextually Visible)

---

### 11. Page Compositions

**Who:** Designers, layout artists  
**What:** Complex multi-element compositions (grids, guides, master pages, style sheets)  
**When:** When creating complex documents, when setting up design systems  
**Where:** Document Setup, Master Pages panel, Style Sheets panel  
**Why:** Efficiency and consistency in complex projects  
**How to Validate:**
- ✅ Compositions are editable
- ✅ Compositions can be applied to multiple pages
- ✅ Compositions can be nested
- ✅ Compositions support inheritance
- ✅ Compositions can be exported/imported
- ✅ Compositions have version control

**MAI Score:** 55 (P2 - Power User Feature)

---

### 12. Page Weights

**Who:** Designers, UX professionals  
**What:** Visual hierarchy and importance of UI elements (size, color, position, contrast)  
**When:** During design, when customizing UI, when optimizing for different screen sizes  
**Where:** Design system, CSS variables, component properties  
**Why:** Clear visual hierarchy guides user attention and improves usability  
**How to Validate:**
- ✅ Primary actions are visually prominent
- ✅ Secondary actions are less prominent
- ✅ Visual weight matches functional importance
- ✅ Hierarchy is consistent across UI
- ✅ Hierarchy works at different zoom levels
- ✅ Hierarchy is accessible (not just visual)

**MAI Score:** 80 (P0 - Always Applied)

---

## III. Visual Design

### 13. Visual Styles

**Who:** All users (especially designers)  
**What:** Visual appearance (themes, color schemes, fonts, spacing, borders, shadows)  
**When:** On first use, when customizing appearance, when switching themes  
**Where:** Preferences → Appearance, Theme selector, Style panel  
**Why:** Personalization, accessibility, brand consistency  
**How to Validate:**
- ✅ Styles are consistent across UI
- ✅ Styles support dark/light themes
- ✅ Styles are accessible (contrast ratios)
- ✅ Styles can be customized
- ✅ Styles can be exported/imported
- ✅ Styles work with all components

**MAI Score:** 70 (P1 - Contextually Visible)

---

### 14. Interactions

**Who:** All users  
**What:** User interactions (clicks, drags, keyboard shortcuts, gestures, hover states)  
**When:** Always (core to application use)  
**Where:** Throughout UI (buttons, canvas, panels, menus)  
**Why:** How users interact with and control the application  
**How to Validate:**
- ✅ Interactions are responsive (<100ms feedback)
- ✅ Interactions have visual feedback
- ✅ Interactions are consistent
- ✅ Interactions support keyboard alternatives
- ✅ Interactions support touch/gestures
- ✅ Interactions are accessible

**MAI Score:** 90 (P0 - Always Active)

---

## IV. Features

### 15. Features (General)

**Who:** All users (varies by feature)  
**What:** Application features (layers, paths, text, effects, animation, AI assistance)  
**When:** When user needs specific functionality  
**Where:** Throughout application (tools, menus, panels, canvas)  
**Why:** Core functionality that enables user goals  
**How to Validate:**
- ✅ Features are discoverable
- ✅ Features work as documented
- ✅ Features have help/documentation
- ✅ Features are accessible
- ✅ Features can be extended (plugins)
- ✅ Features are performant

**MAI Score:** 85 (P0 - Core Functionality)

---

## V. Help & Support

### 16. Help Options

**Who:** All users (especially new users)  
**What:** Help content (documentation, tutorials, tooltips, contextual help, keyboard shortcuts)  
**When:** When user needs assistance, when learning features, when stuck  
**Where:** Help menu, Contextual Help panel, Tooltips, Welcome screen  
**Why:** User education and support - reduce learning curve and frustration  
**How to Validate:**
- ✅ Help is searchable
- ✅ Help is contextual (relevant to current task)
- ✅ Help includes examples
- ✅ Help includes keyboard shortcuts
- ✅ Help is up-to-date
- ✅ Help is accessible

**MAI Score:** 75 (P1 - Contextually Visible)

---

### 17. Support Options

**Who:** Users needing assistance  
**What:** Support channels (bug reports, feature requests, community forums, email support, chat)  
**When:** When encountering issues, when requesting features, when needing help  
**Where:** Help menu, Bug Reporter dialog, Feature Request dialog, Support website  
**Why:** User support and feedback collection - improve product and user satisfaction  
**How to Validate:**
- ✅ Support channels are easily accessible
- ✅ Support forms are easy to fill out
- ✅ Support includes relevant context (screenshots, logs)
- ✅ Support provides confirmation/acknowledgment
- ✅ Support has response time expectations
- ✅ Support is integrated with issue tracking

**MAI Score:** 70 (P1 - Contextually Visible)

---

## VI. Automation & Integration

### 18. Automation Features

**Who:** Power users, developers, designers (workflow optimization)  
**What:** Automation tools (macros, scripts, batch processing, AI assistance, workflows)  
**When:** When repeating tasks, when optimizing workflow, when processing multiple files  
**Where:** Scripts panel, Automation menu, AI Chat, Workflow builder  
**Why:** Efficiency and consistency - reduce repetitive work  
**How to Validate:**
- ✅ Automations are recordable/creatable
- ✅ Automations are testable
- ✅ Automations can be saved/shared
- ✅ Automations have error handling
- ✅ Automations are documented
- ✅ Automations are secure

**MAI Score:** 60 (P2 - Power User Feature)

---

### 19. MCP Protocols

**Who:** Developers, power users, AI integration users  
**What:** Model Context Protocol integration (local AI, code editing, file operations, terminal access)  
**When:** When using AI features, when automating tasks, when integrating with external tools  
**Where:** AI Chat panel, Settings → Integrations, Code Editor  
**Why:** Enable AI-powered features and tool integration  
**How to Validate:**
- ✅ MCP servers are configurable
- ✅ MCP connections are secure
- ✅ MCP errors are handled gracefully
- ✅ MCP features are documented
- ✅ MCP supports local and remote models
- ✅ MCP integrates with existing features

**MAI Score:** 55 (P2 - Advanced Feature)

---

### 20. GitHub Actions

**Who:** Developers, teams, CI/CD users  
**What:** GitHub Actions integration (automated testing, deployment, version control workflows)  
**When:** When setting up CI/CD, when automating development workflows  
**Where:** Settings → Integrations → GitHub, Project settings  
**Why:** Automation and collaboration for development teams  
**How to Validate:**
- ✅ Actions are configurable
- ✅ Actions support common workflows
- ✅ Actions are documented
- ✅ Actions have error handling
- ✅ Actions integrate with version control
- ✅ Actions support secrets management

**MAI Score:** 45 (P2 - Developer Feature)

---

### 21. 3rd Party Addons

**Who:** All users (varies by addon)  
**What:** Third-party extensions, plugins, integrations (export formats, cloud storage, design tools)  
**When:** When user needs specific functionality not in core app  
**Where:** Marketplace, Extensions menu, Settings → Addons  
**Why:** Extensibility - allow users to add functionality  
**How to Validate:**
- ✅ Addons are discoverable (marketplace)
- ✅ Addons are installable/uninstallable
- ✅ Addons are secure (sandboxed, reviewed)
- ✅ Addons are compatible (version checking)
- ✅ Addons are documented
- ✅ Addons can be updated

**MAI Score:** 65 (P1 - Contextually Visible)

---

## VII. Business & Commerce

### 22. Marketplace Integrations

**Who:** All users (buyers and sellers)  
**What:** Marketplace features (browse, purchase, sell assets, scripts, templates, addons)  
**When:** When user wants to buy/sell assets, when discovering resources  
**Where:** Marketplace panel, Asset browser, File menu → Marketplace  
**Why:** Ecosystem and monetization - enable asset sharing and commerce  
**How to Validate:**
- ✅ Marketplace is searchable
- ✅ Marketplace has categories
- ✅ Marketplace shows ratings/reviews
- ✅ Marketplace supports purchases
- ✅ Marketplace supports selling
- ✅ Marketplace has payment integration

**MAI Score:** 60 (P1 - Contextually Visible)

---

### 23. Business Plan Integrations

**Who:** Business users, teams, enterprises  
**What:** Business features (team collaboration, project management, analytics, reporting)  
**When:** When working in teams, when managing projects, when analyzing usage  
**Where:** Team panel, Project settings, Analytics dashboard  
**Why:** Support business workflows and team collaboration  
**How to Validate:**
- ✅ Business features are clearly separated
- ✅ Business features support multiple users
- ✅ Business features have permissions/roles
- ✅ Business features integrate with billing
- ✅ Business features have analytics
- ✅ Business features are scalable

**MAI Score:** 50 (P2 - Business Feature)

---

### 24. Distribution Integrations

**Who:** Content creators, publishers  
**What:** Distribution features (export to platforms, publishing workflows, format conversion)  
**When:** When publishing content, when exporting for specific platforms  
**Where:** Export dialog, Publish menu, Distribution settings  
**Why:** Enable content distribution to various platforms  
**How to Validate:**
- ✅ Distribution supports multiple platforms
- ✅ Distribution formats are correct
- ✅ Distribution includes metadata
- ✅ Distribution is automated where possible
- ✅ Distribution has preview/validation
- ✅ Distribution tracks publishing history

**MAI Score:** 55 (P2 - Creator Feature)

---

### 25. Subscription & Finance Options

**Who:** All users (especially paying customers)  
**What:** Subscription management (tiers, billing, payment methods, usage tracking, upgrades)  
**When:** When subscribing, when managing account, when viewing usage, when upgrading  
**Where:** Account menu, Billing panel, Subscription status indicator, Upgrade prompts  
**Why:** Monetization and user management - enable subscription business model  
**How to Validate:**
- ✅ Subscription tiers are clear
- ✅ Billing information is secure
- ✅ Payment methods are supported
- ✅ Usage is tracked accurately
- ✅ Upgrades/downgrades are easy
- ✅ Billing history is accessible

**MAI Score:** 75 (P1 - Contextually Visible)

---

### 26. Selling Options

**Who:** Content creators, asset sellers  
**What:** Selling features (pricing, licensing, royalties, payment processing)  
**When:** When user wants to sell assets, when setting up shop  
**Where:** Marketplace → Sell, Asset properties → Pricing, Seller dashboard  
**Why:** Enable users to monetize their content  
**How to Validate:**
- ✅ Selling is easy to set up
- ✅ Pricing is flexible
- ✅ Licensing options are clear
- ✅ Payment processing works
- ✅ Royalties are tracked
- ✅ Seller dashboard is comprehensive

**MAI Score:** 55 (P2 - Creator Feature)

---

### 27. Marketing Options

**Who:** Marketing teams, content creators  
**What:** Marketing features (social sharing, analytics, campaigns, promotions)  
**When:** When promoting content, when analyzing reach, when running campaigns  
**Where:** Share menu, Analytics dashboard, Marketing panel  
**Why:** Enable content promotion and marketing  
**How to Validate:**
- ✅ Sharing is easy (one-click)
- ✅ Analytics are comprehensive
- ✅ Campaigns are trackable
- ✅ Promotions are manageable
- ✅ Social integration works
- ✅ Marketing tools are accessible

**MAI Score:** 50 (P2 - Marketing Feature)

---

### 28. Social Media Options

**Who:** Content creators, social media managers  
**What:** Social media features (direct posting, scheduling, format optimization, analytics)  
**When:** When posting to social media, when scheduling content  
**Where:** Share menu, Social Media panel, Export → Social Media  
**Why:** Streamline social media workflow  
**How to Validate:**
- ✅ Social platforms are supported
- ✅ Posting is direct (no manual upload)
- ✅ Scheduling works
- ✅ Formats are optimized per platform
- ✅ Analytics are integrated
- ✅ Social features are secure

**MAI Score:** 55 (P2 - Creator Feature)

---

## VIII. Validation Framework

### How to Validate Requirements

For each UI category, validation should include:

1. **Functional Validation:**
   - Feature works as intended
   - Feature integrates with other features
   - Feature handles errors gracefully

2. **Usability Validation:**
   - Feature is discoverable
   - Feature is accessible (WCAG 2.1 AA)
   - Feature has clear feedback
   - Feature is efficient to use

3. **Technical Validation:**
   - Feature is performant
   - Feature is secure
   - Feature is maintainable
   - Feature is testable

4. **Business Validation:**
   - Feature supports business goals
   - Feature has clear value proposition
   - Feature is monetizable (if applicable)
   - Feature supports user retention

5. **MAI Validation:**
   - Feature surfaces at appropriate priority
   - Feature is contextually relevant
   - Feature doesn't clutter UI
   - Feature is discoverable when needed

---

## IX. MAI Scoring System

**Score Calculation:**
- Relevance (0-25): How relevant is this to current user context?
- Frequency (0-25): How often is this used?
- Importance (0-25): How critical is this to user goals?
- Availability (0-25): How easy is it to access when needed?

**Priority Levels:**
- **P0 (Score > 80):** Always visible - Primary tools, critical settings
- **P1 (Score 60-80):** Contextually visible - Relevant to current tool/selection
- **P2 (Score 40-60):** Discoverable - Advanced features, power user options
- **P3 (Score < 40):** Hidden until needed - Rarely used, administrative

---

## X. Implementation Priority

Based on MAI scores and user workflows:

1. **Phase 1 (P0 - Always Visible):** Tools, Interactions, Features, Dialogs
2. **Phase 2 (P1 - Contextually Visible):** Panels, Settings, Preferences, Help, Subscriptions
3. **Phase 3 (P2 - Discoverable):** Automation, Addons, Marketplace, Business features
4. **Phase 4 (P3 - Hidden):** Advanced configs, Developer features, Administrative tools

---

**This document is part of the legal evidence chain for patent processes and work tracking.**

**Patent:** VF-5WS-ANALYSIS-001  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-006

