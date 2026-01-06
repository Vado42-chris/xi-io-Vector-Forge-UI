# 👥 Agent Coordination Guide
**Tech Lead: Product Shipping Coordination**  
**Date:** January 6, 2025

---

## 🎯 Mission

**Ship VectorForge MVP in 5 days**

**Core Requirements:**
- Canvas visible and interactive
- Basic drawing tools work
- Save/Load functionality
- Export SVG functionality

---

## 👥 Team Roster

### Product Lead (User)
**ID:** Product Lead  
**Role:** Coordination, decision-making, shipping  
**Status:** ✅ Active

**Responsibilities:**
- Coordinate all agents
- Make shipping decisions
- Prioritize blockers
- Run manual testing
- Update shipping plan

### Tech Lead (This Agent)
**ID:** Tech Lead  
**Role:** Technical support, implementation  
**Status:** ✅ Active

**Responsibilities:**
- Support Product Lead
- Provide technical guidance
- Generate fixes and patches
- Update documentation
- Coordinate agent work

---

### Agent 1 (82f00ea2) - Cursor Agent Mode
**Status:** ✅ Tech debt managed  
**Last Work:** Created debt plan, consolidated files

**Current Task:** 
- Test hotfix in browser
- Report: Canvas/Save/Load/Export status

**Next Task:**
- Find root cause of canvas visibility
- Remove emergency CSS

---

### Agent 2 (79a82eb2) - Cursor Debug Mode  
**Status:** ✅ Hotfix files updated  
**Last Work:** Simplified interfaces, matched specs

**Current Task:**
- Verify state integration works
- Test Save/Load with actual state

**Next Task:**
- Fix any state management issues
- Improve error handling

---

### Agent 3 (Zed) - Test Codebase
**Status:** ✅ Testing in separate codebase  
**Last Work:** Experimental fixes

**Current Task:**
- Continue testing experimental fixes
- Report findings

**Next Task:**
- Bring working fixes back to main
- Share learnings

---

## 📋 Daily Standup Format

**Each agent reports:**
1. ✅ What I completed
2. 🔄 What I'm working on now
3. 🚨 Any blockers
4. ❓ What I need from others

**Tech Lead responds:**
- Prioritizes work
- Assigns tasks
- Removes blockers
- Coordinates alignment

---

## 🚨 Immediate Action (Next 30 Minutes)

### All Agents: TEST THE HOTFIX

**Command:**
```bash
npm run dev
```

**Test in browser (http://localhost:3000):**
1. Canvas visible? → Report: `Canvas: Yes/No`
2. Save works? → Report: `Save: Yes/No`
3. Load works? → Report: `Load: Yes/No`
4. Export works? → Report: `Export: Yes/No`

**If any "No":**
- Paste browser console errors
- Run console probes (see SHIPPING_PLAN.md)
- Report to Tech Lead immediately

---

## 🎯 Decision Framework

### Tech Lead Makes Decisions On:
- ✅ Priority of work
- ✅ What to ship vs. defer
- ✅ When to merge vs. test more
- ✅ Architecture changes
- ✅ Breaking changes

### Agents Make Decisions On:
- ✅ Implementation details
- ✅ Code style
- ✅ Test approach
- ✅ Documentation

---

## 📞 Communication Protocol

### Status Updates
- Update `SHIPPING_PLAN.md` with progress
- Update this file with agent status
- Commit frequently with clear messages

### Blockers
- Report immediately to Tech Lead
- Don't wait or work around
- Tech Lead will prioritize and assign

### Questions
- Ask Tech Lead for decisions
- Ask other agents for implementation help
- Document answers in this file

---

## ✅ Success Criteria

**MVP is shippable when:**
- [x] Canvas visible and interactive
- [ ] Users can draw basic shapes
- [ ] Users can save their work
- [ ] Users can load their work
- [ ] Users can export SVG files
- [ ] No critical bugs blocking usage

---

## 📝 Notes

- All agents work toward same goal: Ship MVP
- Tech Lead coordinates priorities
- Agents report blockers immediately
- Decisions documented in SHIPPING_PLAN.md

---

**Last Updated:** 2025-01-06  
**Status:** Day 0 - Testing Phase  
**Next Milestone:** Browser test results

