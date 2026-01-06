# 🤖 Agent Alignment Document
**VectorForge Shipping Team**  
**Last Updated:** January 6, 2025

---

## 🎯 Shared Mission

**Goal:** Ship VectorForge MVP - a functional vector graphics editor where users can:
1. See and use the canvas
2. Draw basic shapes
3. Save their work
4. Export their work

**Success = User can complete a full workflow without blockers**

---

## 👥 Team Roles

### Tech Lead (Auto)
- **Role:** Product coordination, shipping decisions
- **Authority:** Final go/no-go decisions
- **Focus:** Keep team aligned, unblock agents, ship product

### Agent 1 (82f00ea2 - Cursor Debug Mode)
- **Role:** Root cause analysis, debugging, tech debt
- **Authority:** Debug any issue, add instrumentation
- **Focus:** Find root causes, remove emergency fixes, reduce debt

### Agent 2 (79a82eb2 - Cursor Agent Mode)
- **Role:** Implementation, testing, verification
- **Authority:** Fix bugs, update code, test features
- **Focus:** Make things work, verify functionality

### Agent 3 (Zed - Test Codebase)
- **Role:** Experimental fixes, bring back solutions
- **Authority:** Test in separate codebase
- **Focus:** Find working solutions, backport fixes

---

## 📋 Current Priorities (In Order)

1. **P0: Canvas Visibility** - User must see canvas
2. **P0: Save/Load** - User must not lose work
3. **P0: Export** - User must get work out
4. **P1: Tools Work** - User must be able to draw
5. **P2: Tech Debt** - Clean up after shipping

---

## 🚫 What NOT to Do

- ❌ Don't add new features (ship first)
- ❌ Don't refactor working code (ship first)
- ❌ Don't optimize performance (ship first)
- ❌ Don't write documentation (ship first)
- ❌ Don't expand design system (ship first)

**Rule:** If it doesn't block shipping, it can wait.

---

## ✅ What TO Do

- ✅ Fix blockers immediately
- ✅ Test everything before reporting
- ✅ Report results clearly
- ✅ Ask for help when stuck
- ✅ Follow the shipping plan

---

## 📊 Status Reporting Format

**Agent Reports:**
```
[Agent ID] [Phase] [Status]
- Task: [What you did]
- Result: [What happened]
- Blocker: [If any]
- Next: [What's next]
```

**Example:**
```
[79a82eb2] [Phase 1] [Testing]
- Task: Ran dev server, tested canvas/save/load/export
- Result: Canvas: Yes, Save: Yes, Load: Yes, Export: Yes
- Blocker: None
- Next: Proceed to Phase 2
```

---

## 🔄 Workflow

1. **Tech Lead** assigns task
2. **Agent** executes task
3. **Agent** reports result
4. **Tech Lead** reviews, makes decision
5. **Repeat** until shipping

---

## 🚨 Escalation

**If stuck:**
1. Report blocker immediately
2. Tech Lead reviews
3. Tech Lead assigns different agent or provides solution
4. Continue

**If conflict:**
1. Tech Lead makes final decision
2. All agents follow decision
3. Document decision for future

---

## 📝 Current State

**Status:** 🟢 Ready to test  
**Phase:** Phase 1 - Verification  
**Blocker:** None  
**Next:** Agent 2 runs tests

---

**Remember:** We're shipping, not perfecting. Fix blockers, test, ship.

