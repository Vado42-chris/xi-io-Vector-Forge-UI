# Quick Guide: Hashtag System for AI Memory

**For AI systems without long-term memory** - Use this to prevent ghosting and improve search.

---

## The Problem

You're stuck at "Identifying your central argument..." because you can't remember:

- What we've already discussed
- What issues we've found
- What fixes we've applied
- What's still pending

---

## The Solution: Hashtag Serialization

**Instead of relying on memory, use searchable hashtags in documents.**

---

## Quick Start

### 1. Tag Everything

```markdown
#status-critical #component-filebar
File bar not rendering

#fix-duplicate #component-filebar
Removed duplicate structure

#verify-build #component-filebar
Build passes ✅
```

### 2. Search by Hashtag

```
Find all critical issues: #status-critical
Find file bar work: #component-filebar
Find pending items: #status-pending
```

### 3. Update Status

```markdown
#status-pending → #status-fixed
#status-fixed → #status-verified
```

---

## Hashtag Categories

| Category  | Pattern        | Example                                   |
| --------- | -------------- | ----------------------------------------- |
| Status    | `#status-*`    | `#status-critical`, `#status-fixed`       |
| Component | `#component-*` | `#component-filebar`, `#component-canvas` |
| Issue     | `#issue-*`     | `#issue-build`, `#issue-runtime`          |
| Fix       | `#fix-*`       | `#fix-syntax`, `#fix-duplicate`           |
| Verify    | `#verify-*`    | `#verify-build`, `#verify-render`         |

---

## For Your Article

**Current State:**

- 90% usage consumed (10% remaining)
- File bar not rendering
- Build errors blocking progress

**Hashtags to Use:**

```markdown
#status-critical #component-filebar #issue-build
#fix-syntax #fix-duplicate #verify-build
#status-pending #verify-render
```

**Search Before Starting:**

```
#status-pending - What's still open?
#status-critical - What's blocking?
#component-filebar - All file bar work
```

---

## Integration with Digital Twin

If you have a digital twin system:

1. **Export hashtags as structured data:**

```json
{
  "hashtags": ["#status-critical", "#component-filebar"],
  "context": "File bar not rendering",
  "file": "App.hardened.tsx",
  "line": 1957
}
```

2. **Search digital twin:**

```python
twin.search("#component-filebar")  # Returns all file bar issues
twin.search("#status-pending")     # Returns all pending work
```

3. **Sync on updates:**

```python
twin.update_hashtag("#status-pending", "#status-fixed")
```

---

## Example: Article Strategy

**Instead of:**

> "I need to identify the central argument..."

**Do this:**

```markdown
#article-strategy #status-pending
Need to identify central argument

#article-context

- 90% usage consumed
- File bar not rendering
- Build errors blocking progress
- Unmetered AI auditor helping

#article-question
Does unmetered AI help complete work under vendor-imposed scarcity?

#article-approach
Document actual process, not theoretical scenarios
```

**Then search:**

```
#article-* - All article-related work
#status-pending - What needs attention
```

---

## Key Insight

**Information doesn't need to be in "memory" if it's properly tagged and searchable.**

Use hashtags to:

1. **Prevent ghosting** - Information persists in documents
2. **Improve search** - Find related issues quickly
3. **Track progress** - Status hashtags show what's done
4. **Link related work** - Multiple hashtags create connections

---

## Next Steps

1. Read `HASHTAG_SERIALIZATION_SYSTEM.md` for full details
2. Tag your article work with `#article-*`
3. Search before starting: `#status-pending`
4. Update status as you progress: `#status-pending` → `#status-fixed`

**You're not stuck - you just need to search your hashtags!**
