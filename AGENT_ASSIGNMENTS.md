# 👥 Agent Assignments
**Product Lead Coordination**  
**Date:** January 6, 2025

---

## 🎯 Current Phase: Testing & Verification

### Product Lead (You)
**Status:** ✅ Active  
**Current Task:** Run manual browser tests

**Actions:**
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Test Canvas/Save/Load/Export
4. Report 4-line status
5. Paste console errors if any failures

---

### Cursor Agent 1 (Debug Mode)
**Status:** ⏳ Standby  
**Focus:** Root cause analysis

**Current Assignment:**
- **If tests pass:** Begin root cause analysis (why canvas was hidden)
- **If tests fail:** Analyze console logs and probe output
- **Console commands to try (if canvas black):**
  ```javascript
  // Hide overlays
  document.querySelectorAll('.overlay, .loading-overlay').forEach(e => e.style.display = 'none');
  
  // Reset canvas style
  const el = document.querySelector('.canvas-viewport, .canvas-container, svg, canvas');
  if (el) Object.assign(el.style, { transform: 'none', opacity: '1', visibility: 'visible', display: 'block' });
  console.log('applied reset to', el);
  ```

**Next Task:**
- Create branch: `fix/canvas-rootcause`
- Implement permanent fix
- Open PR after verification

---

### Cursor Agent 2 (Agent Mode)
**Status:** ⏳ Standby  
**Focus:** Feature completion

**Current Assignment:**
- **If tests pass:** Stand by to commit hotfix, then move to P1 tech debt
- **If tests fail:** Apply exact patches provided by Tech Lead
- **After hotfix verified:** Implement P1 items (placeholder exports, TODOs)

**Next Task:**
- Apply patches as directed
- Commit hotfix when verified
- Begin P1 work (tools/UX improvements)

---

### Zed Agent (Test Codebase)
**Status:** ✅ Active  
**Focus:** Experimental testing

**Current Assignment:**
- Continue experimenting in test codebase
- **If tests fail:** Reproduce failure in sandbox
- Test candidate fixes
- Send validated change patch or test case back to main

**Next Task:**
- Reproduce any failures in test environment
- Validate fixes before bringing to main
- Create regression tests

---

### Tech Lead (This Agent)
**Status:** ✅ Active  
**Focus:** Coordination & technical support

**Current Assignment:**
- Wait for Product Lead test results
- **If all Yes:**
  - Generate CI workflow (`.github/workflows/ci.yml`)
  - Generate PR body for hotfix
  - Create unified git patch (optional)
  - Move P0 items to issues
  - Schedule P1 work
- **If any No:**
  - Analyze console logs/probe output
  - Produce exact code changes (one-line or small patch)
  - Coordinate with Debug Agent for root cause
  - Provide fixes to Agent Mode for application

**Next Task:**
- Coordinate based on test results
- Generate required materials
- Ensure agent alignment

---

## 📋 Decision Tree

### All Tests Pass → Merge & Continue
1. Tech Lead: Generate CI + PR materials
2. Agent 2: Commit hotfix to main
3. Agent 1: Begin root cause analysis
4. All: Move to P1 tech debt work

### Any Test Fails → Diagnose & Fix
1. Tech Lead: Analyze failure, produce patch
2. Agent 2: Apply patch
3. Product Lead: Retest
4. Repeat until all pass

---

## 📝 Communication Protocol

**Product Lead reports:**
- Test results (4-line format)
- Console errors (if any)
- Probe outputs (if canvas black)

**Tech Lead responds:**
- CI/PR materials (if all pass)
- Exact patches (if any fail)
- Next steps

**Agents report:**
- Work completed
- Blockers encountered
- Questions for Product Lead

---

**Last Updated:** 2025-01-06  
**Status:** Awaiting Product Lead test results

