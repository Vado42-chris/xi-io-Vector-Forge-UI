# UI Planning Framework: Most Actionable Items & Contextual Surfacing

**Date:** 2025-01-27  
**Server Timestamp:** [AUTO-GENERATED ON BUILD]  
**Patent Tracking:** VF-UI-PLAN-001  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-001

## Executive Summary

This framework defines how to surface the **Most Actionable Item (MAI)** for users in any given context, ensuring tools, preferences, settings, panels, configs, dialogs, tooltips, components, templates, page layouts, page compositions, page weights, visual styles, interactions, features, help options, support options, automation features, MCP protocols, GitHub actions, 3rd party addons, marketplace integrations, business plan integrations, distribution integrations, subscription and finance options, selling options, marketing options, social media options, and other business-related items are accessible, user-friendly, and contextually appropriate.

## I. Most Actionable Item (MAI) Framework

### Definition
The **Most Actionable Item** is the single most important action, tool, setting, or information a user needs in their current context to progress their workflow.

### MAI Identification Process

1. **Context Analysis**
   - What is the user currently doing?
   - What is their goal?
   - What is blocking them?
   - What would help them most right now?

2. **Workflow Mapping**
   - Map user workflows (from `docs/USER_WORKFLOWS.md`)
   - Identify decision points
   - Identify action points
   - Identify information needs

3. **Priority Calculation**
   - **P0 (Critical):** Blocks workflow, must be visible
   - **P1 (High):** Significantly improves workflow, should be visible
   - **P2 (Medium):** Nice to have, can be discoverable
   - **P3 (Low):** Advanced feature, can be hidden

### MAI Surfacing Rules

1. **Always Visible (P0)**
   - Primary tool for current task
   - Critical setting for current operation
   - Blocking error or warning
   - Required confirmation

2. **Contextually Visible (P1)**
   - Relevant to current tool/selection
   - Next step in workflow
   - Related preferences
   - Helpful shortcuts

3. **Discoverable (P2)**
   - Advanced features
   - Power user options
   - Customization settings
   - Experimental features

4. **Hidden Until Needed (P3)**
   - Rarely used features
   - Administrative functions
   - Developer options
   - Legacy features

## II. UI Element Categories: 5Ws Analysis

### A. Tools

**Who:** All users (beginners to power users)  
**What:** Drawing, selection, transformation, text, navigation tools  
**When:** Always available, contextually highlighted based on active tool  
**Where:** Left sidebar (primary), toolbar (quick access), keyboard shortcuts  
**Why:** Core functionality - users need immediate access to create and edit

**How Validation:**
- ✅ Tools visible in left sidebar
- ✅ Active tool highlighted
- ✅ Keyboard shortcuts work
- ✅ Tool properties update when tool changes
- ✅ Tool-specific help available

**MAI Surfacing:**
- **P0:** Active tool properties panel
- **P1:** Recently used tools
- **P2:** All available tools
- **P3:** Custom tool configurations

### B. Preferences

**Who:** All users (personalization needs)  
**What:** Application settings, UI preferences, behavior options  
**When:** On demand (Preferences menu), contextually (tool-specific)  
**Where:** Preferences dialog, context menus, tool panels  
**Why:** Users need control over their experience

**How Validation:**
- ✅ Preferences accessible from menu
- ✅ Changes apply immediately
- ✅ Preferences persist across sessions
- ✅ Contextual preferences available in relevant panels
- ✅ Reset to defaults option

**MAI Surfacing:**
- **P0:** Preferences affecting current operation
- **P1:** Frequently changed preferences
- **P2:** All preferences in dialog
- **P3:** Advanced/preferences

### C. Settings

**Who:** All users (configuration needs)  
**What:** Document settings, canvas settings, export settings  
**When:** When creating/editing documents, before export  
**Where:** Document Setup dialog, Canvas Settings panel, Export dialog  
**Why:** Users need to configure their work environment

**How Validation:**
- ✅ Settings accessible from relevant contexts
- ✅ Settings validate before applying
- ✅ Settings show current values
- ✅ Settings have helpful descriptions
- ✅ Settings can be saved as presets

**MAI Surfacing:**
- **P0:** Settings affecting current document/canvas
- **P1:** Settings for current tool/operation
- **P2:** All settings in dialogs
- **P3:** Advanced settings

### D. Panels

**Who:** All users (information and control needs)  
**What:** Tool properties, layers, scripts, AI chat, registry, tasks, workspace, help, history  
**When:** Contextually based on user activity  
**Where:** Right sidebar (dockable), floating panels, collapsed tabs  
**Why:** Users need information and controls for their work

**How Validation:**
- ✅ Panels show relevant information
- ✅ Panels update when selection changes
- ✅ Panels can be docked/undocked
- ✅ Panels can be resized
- ✅ Panels remember state

**MAI Surfacing:**
- **P0:** Panel relevant to current tool/selection
- **P1:** Panels for current workflow step
- **P2:** All panels available in sidebar
- **P3:** Custom panel configurations

### E. Configs

**Who:** Power users, administrators  
**What:** Advanced configurations, system settings, integrations  
**When:** On setup, when configuring integrations  
**Where:** Settings dialog, Admin panel, Configuration files  
**Why:** Advanced users need system-level control

**How Validation:**
- ✅ Configs accessible to authorized users
- ✅ Configs validate before saving
- ✅ Configs have documentation
- ✅ Configs can be exported/imported
- ✅ Configs show warnings for risky changes

**MAI Surfacing:**
- **P0:** Configs affecting current operation
- **P1:** Frequently used configs
- **P2:** All configs in settings
- **P3:** Advanced configs in admin panel

### F. Dialogs

**Who:** All users (confirmation, input needs)  
**What:** File operations, confirmations, input forms, warnings  
**When:** When action requires confirmation or input  
**Where:** Modal dialogs, non-modal dialogs, inline dialogs  
**Why:** Users need to confirm actions and provide input

**How Validation:**
- ✅ Dialogs are accessible (keyboard navigation)
- ✅ Dialogs have clear actions (OK, Cancel, etc.)
- ✅ Dialogs show relevant information
- ✅ Dialogs can be dismissed appropriately
- ✅ Dialogs don't block unnecessarily

**MAI Surfacing:**
- **P0:** Dialogs for critical actions (Save, Delete, etc.)
- **P1:** Dialogs for important operations
- **P2:** Dialogs for optional operations
- **P3:** Advanced dialogs

### G. Tooltips

**Who:** All users (discovery and help needs)  
**What:** Short descriptions, keyboard shortcuts, hints  
**When:** On hover/focus, always available  
**Where:** On all interactive elements  
**Why:** Users need quick information without leaving context

**How Validation:**
- ✅ Tooltips on all interactive elements
- ✅ Tooltips show keyboard shortcuts
- ✅ Tooltips are concise and helpful
- ✅ Tooltips don't block interaction
- ✅ Tooltips are accessible (screen readers)

**MAI Surfacing:**
- **P0:** Tooltips on primary actions
- **P1:** Tooltips on all tools
- **P2:** Tooltips on all UI elements
- **P3:** Advanced tooltip content

### H. Components

**Who:** Developers, power users (customization)  
**What:** Reusable UI components, custom components  
**When:** When building custom interfaces, when extending functionality  
**Where:** Component library, marketplace, custom code  
**Why:** Users need to extend and customize the application

**How Validation:**
- ✅ Components are documented
- ✅ Components are accessible
- ✅ Components follow design system
- ✅ Components can be customized
- ✅ Components are tested

**MAI Surfacing:**
- **P0:** Components needed for current feature
- **P1:** Commonly used components
- **P2:** All components in library
- **P3:** Advanced/custom components

### I. Templates

**Who:** All users (productivity needs)  
**What:** Document templates, workspace templates, animation presets  
**When:** When creating new documents, when setting up workspace  
**Where:** New Document dialog, Template library, Marketplace  
**Why:** Users need starting points for common tasks

**How Validation:**
- ✅ Templates are easily accessible
- ✅ Templates are categorized
- ✅ Templates can be previewed
- ✅ Templates can be customized
- ✅ Templates can be created/saved

**MAI Surfacing:**
- **P0:** Templates for current workflow
- **P1:** Recently used templates
- **P2:** All templates in library
- **P3:** Custom templates

### J. Page Layouts

**Who:** All users (workspace needs)  
**What:** Workspace layouts, panel arrangements, view configurations  
**When:** When setting up workspace, when switching workflows  
**Where:** Layout menu, Workspace panel, Layout presets  
**Why:** Users need to organize their workspace for efficiency

**How Validation:**
- ✅ Layouts are easily switchable
- ✅ Layouts can be saved
- ✅ Layouts can be customized
- ✅ Layouts remember panel states
- ✅ Layouts are optimized for workflows

**MAI Surfacing:**
- **P0:** Layout for current workflow
- **P1:** Recently used layouts
- **P2:** All layouts in menu
- **P3:** Custom layouts

### K. Page Compositions

**Who:** Designers, content creators  
**What:** Artboard compositions, multi-page documents, export compositions  
**When:** When creating multi-page documents, when exporting  
**Where:** Artboard panel, Export dialog, Composition settings  
**Why:** Users need to manage complex document structures

**How Validation:**
- ✅ Compositions are easily manageable
- ✅ Compositions can be previewed
- ✅ Compositions can be exported
- ✅ Compositions support different sizes
- ✅ Compositions can be organized

**MAI Surfacing:**
- **P0:** Current composition settings
- **P1:** Composition tools for current document
- **P2:** All composition options
- **P3:** Advanced composition features

### L. Page Weights (Visual Hierarchy)

**Who:** All users (visual clarity needs)  
**What:** Visual importance, size, contrast, positioning  
**When:** Always (affects all UI)  
**Where:** All UI elements  
**Why:** Users need clear visual hierarchy to understand importance

**How Validation:**
- ✅ Primary actions are visually prominent
- ✅ Secondary actions are less prominent
- ✅ Information hierarchy is clear
- ✅ Visual weight matches functional importance
- ✅ Follows HallbergMaths principles

**MAI Surfacing:**
- **P0:** Most important elements are largest/most prominent
- **P1:** Related elements are grouped visually
- **P2:** All elements follow hierarchy
- **P3:** Custom visual weights

### M. Visual Styles

**Who:** All users (aesthetic needs)  
**What:** Colors, typography, spacing, borders, shadows  
**When:** Always (affects all UI)  
**Where:** All UI elements  
**Why:** Users need consistent, professional, accessible visual design

**How Validation:**
- ✅ Styles follow Xibalba brand identity
- ✅ Styles are accessible (contrast, etc.)
- ✅ Styles are consistent
- ✅ Styles can be customized (themes)
- ✅ Styles are documented

**MAI Surfacing:**
- **P0:** Styles for primary UI elements
- **P1:** Styles for secondary elements
- **P2:** All styles in design system
- **P3:** Custom styles

### N. Interactions

**Who:** All users (usability needs)  
**What:** Click, drag, keyboard, touch, voice interactions  
**When:** Always (all user actions)  
**Where:** All interactive elements  
**Why:** Users need intuitive, responsive, accessible interactions

**How Validation:**
- ✅ Interactions are intuitive
- ✅ Interactions provide feedback
- ✅ Interactions are accessible
- ✅ Interactions support multiple input methods
- ✅ Interactions are documented

**MAI Surfacing:**
- **P0:** Primary interactions for current task
- **P1:** Common interactions
- **P2:** All interactions available
- **P3:** Advanced interactions

### O. Features

**Who:** All users (functionality needs)  
**What:** Application features, tools, capabilities  
**When:** Contextually based on user needs  
**Where:** Throughout application  
**Why:** Users need features to accomplish their goals

**How Validation:**
- ✅ Features are discoverable
- ✅ Features are accessible
- ✅ Features are documented
- ✅ Features work as expected
- ✅ Features are tested

**MAI Surfacing:**
- **P0:** Features needed for current workflow
- **P1:** Commonly used features
- **P2:** All features available
- **P3:** Advanced/experimental features

### P. Help Options

**Who:** All users (learning and support needs)  
**What:** Help documentation, tutorials, contextual help, tooltips  
**When:** On demand, contextually when needed  
**Where:** Help menu, Help panel, Contextual help, Tooltips  
**Why:** Users need to learn and get support

**How Validation:**
- ✅ Help is easily accessible
- ✅ Help is contextual
- ✅ Help is searchable
- ✅ Help is up-to-date
- ✅ Help is accessible

**MAI Surfacing:**
- **P0:** Help for current task/error
- **P1:** Help for current tool/feature
- **P2:** All help in Help panel
- **P3:** Advanced help resources

### Q. Support Options

**Who:** All users (problem-solving needs)  
**What:** Bug reporting, feature requests, community support, tickets  
**When:** When users encounter issues or have suggestions  
**Where:** Support menu, Bug Reporter, Feature Request, Community  
**Why:** Users need to report issues and get help

**How Validation:**
- ✅ Support options are easily accessible
- ✅ Support forms are easy to use
- ✅ Support provides feedback
- ✅ Support is responsive
- ✅ Support is documented

**MAI Surfacing:**
- **P0:** Support for critical issues
- **P1:** Support for common issues
- **P2:** All support options available
- **P3:** Advanced support features

### R. Automation Features

**Who:** Power users, developers (efficiency needs)  
**What:** Scripts, macros, AI automation, batch operations  
**When:** When automating repetitive tasks  
**Where:** Scripts panel, Automation menu, AI Chat  
**Why:** Users need to automate repetitive tasks

**How Validation:**
- ✅ Automation is accessible
- ✅ Automation is documented
- ✅ Automation is safe (undoable)
- ✅ Automation is testable
- ✅ Automation is customizable

**MAI Surfacing:**
- **P0:** Automation for current repetitive task
- **P1:** Commonly used automations
- **P2:** All automation options
- **P3:** Advanced automation features

### S. MCP Protocols

**Who:** Developers, power users (integration needs)  
**What:** Model Context Protocol integrations, AI agent connections  
**When:** When using AI features, when integrating external services  
**Where:** Settings, AI Chat, Developer tools  
**Why:** Users need to connect to AI services and external tools

**How Validation:**
- ✅ MCP protocols are configurable
- ✅ MCP protocols are documented
- ✅ MCP protocols are secure
- ✅ MCP protocols provide feedback
- ✅ MCP protocols are testable

**MAI Surfacing:**
- **P0:** MCP protocols for current AI feature
- **P1:** Commonly used MCP protocols
- **P2:** All MCP protocols in settings
- **P3:** Advanced MCP configurations

### T. GitHub Actions

**Who:** Developers, administrators (CI/CD needs)  
**What:** Automated workflows, testing, deployment  
**When:** On code changes, on schedule, on manual trigger  
**Where:** GitHub repository, CI/CD dashboard  
**Why:** Developers need automated testing and deployment

**How Validation:**
- ✅ GitHub Actions are configured
- ✅ GitHub Actions are documented
- ✅ GitHub Actions provide feedback
- ✅ GitHub Actions are testable
- ✅ GitHub Actions are secure

**MAI Surfacing:**
- **P0:** GitHub Actions for current workflow
- **P1:** Commonly used actions
- **P2:** All actions in repository
- **P3:** Advanced action configurations

### U. 3rd Party Addons

**Who:** All users (extension needs)  
**What:** Plugins, extensions, integrations  
**When:** When extending functionality  
**Where:** Marketplace, Addons menu, Settings  
**Why:** Users need to extend application functionality

**How Validation:**
- ✅ Addons are discoverable
- ✅ Addons are installable
- ✅ Addons are documented
- ✅ Addons are secure
- ✅ Addons are manageable

**MAI Surfacing:**
- **P0:** Addons relevant to current task
- **P1:** Installed addons
- **P2:** All addons in marketplace
- **P3:** Advanced addon configurations

### V. Marketplace Integrations

**Who:** All users (asset and tool needs)  
**What:** Asset marketplace, script marketplace, template marketplace  
**When:** When searching for assets, scripts, templates  
**Where:** Marketplace panel, Import dialogs  
**Why:** Users need to find and use community resources

**How Validation:**
- ✅ Marketplace is accessible
- ✅ Marketplace is searchable
- ✅ Marketplace is categorized
- ✅ Marketplace provides previews
- ✅ Marketplace supports transactions

**MAI Surfacing:**
- **P0:** Marketplace for current need (assets, scripts, etc.)
- **P1:** Recently used marketplace items
- **P2:** All marketplace categories
- **P3:** Advanced marketplace features

### W. Business Plan Integrations

**Who:** Administrators, business users (business needs)  
**What:** Business plan features, enterprise features, licensing  
**When:** When managing business aspects  
**Where:** Admin panel, Settings, Business menu  
**Why:** Business users need to manage plans and features

**How Validation:**
- ✅ Business features are accessible to authorized users
- ✅ Business features are documented
- ✅ Business features are secure
- ✅ Business features provide reporting
- ✅ Business features are manageable

**MAI Surfacing:**
- **P0:** Business features for current plan
- **P1:** Available business features
- **P2:** All business features in admin
- **P3:** Advanced business configurations

### X. Distribution Integrations

**Who:** Administrators, content creators (distribution needs)  
**What:** Export formats, publishing, sharing  
**When:** When exporting or sharing work  
**Where:** Export dialogs, Share menu, Publish options  
**Why:** Users need to distribute their work

**How Validation:**
- ✅ Distribution options are accessible
- ✅ Distribution options are documented
- ✅ Distribution options validate formats
- ✅ Distribution options provide feedback
- ✅ Distribution options are secure

**MAI Surfacing:**
- **P0:** Distribution options for current export
- **P1:** Commonly used distribution options
- **P2:** All distribution options
- **P3:** Advanced distribution features

### Y. Subscription and Finance Options

**Who:** All users (account management needs)  
**What:** Subscription management, billing, payment methods  
**When:** When managing account, when upgrading  
**Where:** Account menu, Billing panel, Upgrade prompts  
**Why:** Users need to manage their subscription and payments

**How Validation:**
- ✅ Subscription options are accessible
- ✅ Subscription options are clear
- ✅ Subscription options are secure
- ✅ Subscription options provide feedback
- ✅ Subscription options are manageable

**MAI Surfacing:**
- **P0:** Current subscription status
- **P1:** Upgrade options for locked features
- **P2:** All subscription options
- **P3:** Advanced subscription features

### Z. Selling Options

**Who:** Content creators, marketplace sellers (monetization needs)  
**What:** Marketplace selling, asset licensing, revenue sharing  
**When:** When selling assets, scripts, templates  
**Where:** Marketplace, Seller dashboard, Asset settings  
**Why:** Users need to monetize their work

**How Validation:**
- ✅ Selling options are accessible
- ✅ Selling options are documented
- ✅ Selling options are secure
- ✅ Selling options provide reporting
- ✅ Selling options are manageable

**MAI Surfacing:**
- **P0:** Selling options for current asset
- **P1:** Seller dashboard
- **P2:** All selling options
- **P3:** Advanced selling features

### AA. Marketing Options

**Who:** Administrators, marketers (promotion needs)  
**What:** Promotional features, announcements, campaigns  
**When:** When promoting features or content  
**Where:** Admin panel, Marketing dashboard  
**Why:** Administrators need to promote features and content

**How Validation:**
- ✅ Marketing options are accessible to authorized users
- ✅ Marketing options are documented
- ✅ Marketing options are manageable
- ✅ Marketing options provide analytics
- ✅ Marketing options are testable

**MAI Surfacing:**
- **P0:** Marketing options for current campaign
- **P1:** Active marketing campaigns
- **P2:** All marketing options
- **P3:** Advanced marketing features

### AB. Social Media Options

**Who:** All users (sharing needs)  
**What:** Social media sharing, integration, posting  
**When:** When sharing work on social media  
**Where:** Share menu, Export dialogs, Social media panel  
**Why:** Users need to share their work on social media

**How Validation:**
- ✅ Social media options are accessible
- ✅ Social media options are documented
- ✅ Social media options are secure
- ✅ Social media options provide previews
- ✅ Social media options are manageable

**MAI Surfacing:**
- **P0:** Social media options for current share
- **P1:** Connected social media accounts
- **P2:** All social media options
- **P3:** Advanced social media features

## III. Contextual UI System Architecture

### A. Context Detection

1. **User Context**
   - Current tool
   - Selected object
   - Active workflow
   - User skill level
   - User preferences

2. **Document Context**
   - Document type
   - Document state
   - Document history
   - Document settings

3. **System Context**
   - Available features
   - Subscription tier
   - System state
   - Error state

### B. MAI Calculation Engine

1. **Priority Scoring**
   - Context relevance (0-100)
   - User frequency (0-100)
   - Workflow importance (0-100)
   - Feature availability (0-100)
   - Total score = weighted average

2. **Surfacing Rules**
   - P0: Score > 80, always visible
   - P1: Score 60-80, contextually visible
   - P2: Score 40-60, discoverable
   - P3: Score < 40, hidden until needed

### C. UI Component Hierarchy

1. **Primary Surface (Always Visible)**
   - File menu
   - Toolbar
   - Canvas
   - Active tool properties

2. **Secondary Surface (Contextually Visible)**
   - Right sidebar panels
   - Left sidebar tools
   - Timeline
   - Power user toolbar

3. **Tertiary Surface (Discoverable)**
   - Preferences
   - Settings
   - Help
   - Support

4. **Quaternary Surface (Hidden Until Needed)**
   - Advanced settings
   - Developer tools
   - Admin panel
   - Debug tools

## IV. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- Implement context detection system
- Create MAI calculation engine
- Build contextual UI component
- Test with core workflows

### Phase 2: Integration (Week 3-4)
- Integrate with all UI components
- Add contextual help system
- Implement user preference learning
- Test with real users

### Phase 3: Advanced Features (Week 5-8)
- Add AI-powered suggestions
- Implement workflow optimization
- Add analytics and reporting
- Continuous improvement

## V. Success Metrics

1. **Usability Metrics**
   - Time to find needed feature
   - Number of clicks to complete task
   - User satisfaction scores
   - Error rates

2. **Performance Metrics**
   - UI render time
   - Context detection speed
   - MAI calculation time
   - System responsiveness

3. **Business Metrics**
   - Feature discovery rate
   - Feature usage rate
   - Subscription upgrade rate
   - User retention

---

**This framework is a living document. Update as we learn from user behavior and feedback.**

