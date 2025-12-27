# Component Specifications
## Detailed Specs for MVP UI Components

**Date:** 2025-01-XX  
**Status:** 📐 Specifications  
**Hashtag:** #component-specs #ui-design

---

## 1. ActionCenter Component

### 1.1 Purpose
Surface the single most actionable item for the user at any given moment.

### 1.2 5Ws

**Who:** All users (Designers, Animators, PMs, Developers)  
**What:** Single prominent CTA with context  
**When:** Always visible, updates in real-time  
**Where:** Top-right of workspace (global)  
**Why:** Reduce friction, speed up decision-making, clear priority

**How to Validate:**
- ✅ Action is always the most relevant (test with different user states)
- ✅ Action executes in < 100ms
- ✅ Action context is clear (user understands why)
- ✅ Notification count is accurate
- ✅ Secondary actions accessible on click
- ✅ Keyboard accessible (Enter to execute)

### 1.3 Visual Specs

**Size:** 
- Width: 200-300px (responsive)
- Height: 48px (matches header height)

**Visual Weight:** High
- Orange accent background (#ff9800)
- White text
- Prominent shadow
- Subtle pulse animation when urgent

**Position:** 
- Top-right, below header
- Fixed position
- Z-index: 100

**States:**
- **Default:** Show primary action
- **Hover:** Show context tooltip
- **Click:** Execute action or show secondary actions
- **Urgent:** Pulse animation, red accent

### 1.4 Interaction Specs

**Click Behavior:**
- Primary action: Execute immediately
- Secondary actions: Expand dropdown
- Notification count: Open notification center

**Keyboard:**
- Tab: Focus Action Center
- Enter: Execute primary action
- Arrow Down: Expand secondary actions
- Escape: Close dropdown

**Accessibility:**
- ARIA label: "Action Center: {action description}"
- Role: button
- Live region for updates

### 1.5 API Integration

```typescript
interface ActionCenterProps {
  userId: string;
  onAction: (action: Action) => void;
}

interface Action {
  id: string;
  label: string;
  description: string;
  action: () => void;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  context: string;
  icon?: string;
}
```

---

## 2. TaskCard Component

### 2.1 Purpose
Represent a task in the SprintBoard with essential information and quick actions.

### 2.2 5Ws

**Who:** All users viewing tasks  
**What:** Task card with title, assignee, status, priority  
**When:** When viewing SprintBoard  
**Where:** SprintBoard columns  
**Why:** Primary task interaction, quick actions

**How to Validate:**
- ✅ Shows all essential info (title, assignee, status, priority)
- ✅ Blocked indicator visible when blocked
- ✅ Quick assign works (click assignee)
- ✅ Solve-blocker CTA visible when blocked
- ✅ Drag-and-drop works smoothly
- ✅ Click opens task details
- ✅ Hover shows tooltip with description

### 2.3 Visual Specs

**Size:**
- Width: Column width minus padding
- Height: Auto (min 80px)
- Padding: 12px

**Visual Weight:** Medium
- Background: var(--xibalba-grey-100)
- Border: 1px solid rgba(255,255,255,0.1)
- Hover: Border color to orange, slight elevation

**Layout:**
- Header: Title, Priority badge
- Body: Description (truncated), Tags
- Footer: Assignee avatar, Status, Quick actions

**Priority Colors:**
- Critical: Red accent
- High: Orange accent
- Medium: Yellow accent
- Low: Grey

### 2.4 Interaction Specs

**Drag:**
- Drag handle: Entire card
- Visual feedback: Slight scale, shadow
- Drop zones: Column highlights

**Click:**
- Card: Open task details in Inspector
- Assignee: Quick assign dropdown
- Status: Quick status change
- Blocked icon: Show blocker details

**Keyboard:**
- Tab: Focus card
- Enter: Open details
- Space: Select for multi-select

**Accessibility:**
- ARIA label: "Task: {title}, {status}, {priority}"
- Role: button
- Drag handle has aria-grabbed

### 2.5 API Integration

```typescript
interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onAssign: (taskId: string, userId: string) => void;
  onSolveBlocker: (taskId: string) => void;
}
```

---

## 3. SprintBoard Component

### 3.1 Purpose
Primary kanban board for sprint management with drag-and-drop.

### 3.2 5Ws

**Who:** Project Managers, Team Members  
**What:** Kanban board with columns (Backlog, Planning, In Progress, Review, Done)  
**When:** During sprint planning and execution  
**Where:** Center workspace  
**Why:** Primary project management interface

**How to Validate:**
- ✅ Drag-and-drop between columns works
- ✅ Columns are clearly labeled
- ✅ Task count per column is accurate
- ✅ Filters work correctly
- ✅ Real-time updates work
- ✅ Column widths are adjustable
- ✅ Scroll works for long columns

### 3.3 Visual Specs

**Size:**
- Width: 100% of center workspace
- Height: 100% of workspace (minus header/footer)
- Column width: Equal distribution (adjustable)

**Visual Weight:** Heavy (primary work surface)

**Layout:**
- Horizontal columns
- Column headers with counts
- Task cards in columns
- Drag-and-drop zones

**Column Colors:**
- Backlog: #666 (grey)
- Planning: #ff9800 (orange)
- In Progress: #0066ff (blue - but we use grey, so adjust)
- Review: #9c27b0 (purple - adjust to grey scale)
- Done: #4caf50 (green - adjust to grey scale)

**Note:** Adjust colors to grey-on-grey with orange accent only

### 3.4 Interaction Specs

**Drag-and-Drop:**
- Drag: Task card
- Drop: Column
- Visual feedback: Column highlight, card preview
- Animation: Smooth (0.2s)

**Click:**
- Column header: Filter by column
- Task card: Select task
- Empty column: Add task to column

**Keyboard:**
- Arrow keys: Navigate tasks
- Enter: Open selected task
- Delete: Delete selected task (with confirmation)

**Accessibility:**
- ARIA labels for columns
- Keyboard navigation
- Screen reader announcements for moves

### 3.5 API Integration

```typescript
interface SprintBoardProps {
  sprintId?: string;
  projectId?: string;
  filters?: TaskFilters;
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onTaskSelect: (task: Task) => void;
  onTaskCreate: (column: string) => void;
}
```

---

## 4. InspectorPanel Component

### 4.1 Purpose
Show detailed information about selected task, timeline item, or VectorForge item.

### 4.2 5Ws

**Who:** All users  
**What:** Detailed metadata inspector  
**When:** When item is selected  
**Where:** Right dock  
**Why:** Detailed information, timeline mapping, VectorForge links

**How to Validate:**
- ✅ Shows all relevant metadata
- ✅ Timeline mapping works
- ✅ VectorForge links work
- ✅ Edit capabilities work
- ✅ Comments visible
- ✅ Attachments accessible
- ✅ Dependencies shown

### 4.3 Visual Specs

**Size:**
- Width: 360px (default, resizable 200-600px)
- Height: 100% of right dock

**Visual Weight:** Medium (context, not primary)

**Layout:**
- Tabs: Details, Timeline, Comments, Attachments
- Scrollable content
- Action buttons at bottom

**Sections:**
- Header: Item name, status
- Metadata: Assignee, due date, priority
- Description: Full description
- Timeline: Linked timeline items
- VectorForge: Linked layers/keyframes
- Comments: Threaded comments
- Attachments: File list

### 4.4 Interaction Specs

**Tabs:**
- Click: Switch tab
- Keyboard: Arrow keys to navigate

**Edit:**
- Click edit icon: Enter edit mode
- Save: Update via API
- Cancel: Discard changes

**Links:**
- VectorForge link: Open in VectorForge
- Timeline link: Jump to timeline
- Task link: Jump to task

**Accessibility:**
- ARIA tabs
- Keyboard navigation
- Focus management

### 4.5 API Integration

```typescript
interface InspectorPanelProps {
  item: Task | VectorForgeItem | TimelineItem;
  onUpdate: (updates: Partial<Item>) => void;
  onLink: (item: Item, target: Item) => void;
}
```

---

## 5. BaselineModal Component

### 5.1 Purpose
Approve sprint baseline with blockchain anchor for tamper-evident proof.

### 5.2 5Ws

**Who:** Project Managers, QA  
**What:** Baseline approval dialog with snapshot preview  
**When:** Before sprint release, after sign-off  
**Where:** Modal overlay  
**Why:** Tamper-evident evidence, legal proof, audit trail

**How to Validate:**
- ✅ Snapshot preview is accurate
- ✅ Blockchain anchor completes in < 30s
- ✅ Anchor verification works
- ✅ Audit trail is created
- ✅ Confirmation message shown
- ✅ Error handling works

### 5.3 Visual Specs

**Size:**
- Width: 800px (max)
- Height: 600px (max, scrollable)
- Centered on screen

**Visual Weight:** Heavy (when open, blocks background)

**Layout:**
- Header: "Baseline Sprint: {sprint name}"
- Preview: Snapshot of current state
- Details: Task count, completion stats
- Actions: Cancel, Anchor & Baseline

**States:**
- Loading: Show progress
- Success: Show confirmation
- Error: Show error message

### 5.4 Interaction Specs

**Preview:**
- Scrollable snapshot
- Expandable sections
- Task list with status

**Actions:**
- Cancel: Close modal
- Anchor & Baseline: Create anchor, save baseline
- Keyboard: ESC to cancel, Enter to confirm

**Accessibility:**
- ARIA modal
- Focus trap
- Screen reader announcements

### 5.5 API Integration

```typescript
interface BaselineModalProps {
  sprint: Sprint;
  onBaseline: (sprintId: string, anchorHash: string) => void;
  onCancel: () => void;
}
```

---

## 6. Validation Test Cases

### 6.1 ActionCenter Tests

```typescript
describe('ActionCenter', () => {
  it('shows highest priority action', () => {
    // Test: Blocked task shows "Resolve blocker"
    // Test: Pending approval shows "Approve"
    // Test: Due today shows "Complete task"
  });
  
  it('executes action on click', () => {
    // Test: Click executes action
    // Test: Action completes in < 100ms
  });
  
  it('updates in real-time', () => {
    // Test: New blocker updates action
    // Test: Action cleared when resolved
  });
});
```

### 6.2 TaskCard Tests

```typescript
describe('TaskCard', () => {
  it('displays task information', () => {
    // Test: Title, assignee, status, priority visible
  });
  
  it('shows blocked indicator', () => {
    // Test: Blocked tasks show indicator
    // Test: Solve-blocker CTA visible
  });
  
  it('handles drag-and-drop', () => {
    // Test: Drag works smoothly
    // Test: Drop updates status
  });
});
```

### 6.3 SprintBoard Tests

```typescript
describe('SprintBoard', () => {
  it('displays tasks in columns', () => {
    // Test: Tasks in correct columns
    // Test: Column counts accurate
  });
  
  it('handles drag-and-drop', () => {
    // Test: Drag between columns works
    // Test: Status updates correctly
  });
  
  it('filters tasks', () => {
    // Test: Filters work correctly
    // Test: Filter state persists
  });
});
```

---

## 7. Visual Regression Tests

### 7.1 Golden Images

**States to Capture:**
- ActionCenter: Default, Urgent, With notifications
- TaskCard: Default, Blocked, Assigned, High priority
- SprintBoard: Empty, With tasks, Filtered
- InspectorPanel: Task selected, Timeline selected, VectorForge selected
- BaselineModal: Default, Loading, Success, Error

### 7.2 Responsive Breakpoints

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Test Each Component:**
- Layout adapts correctly
- Text remains readable
- Interactions work
- No horizontal scroll

---

## 8. Accessibility Checklist

For each component:

- [ ] **Keyboard Navigation:** All interactions keyboard accessible
- [ ] **Screen Reader:** ARIA labels and roles
- [ ] **Focus Management:** Focus trap in modals
- [ ] **Color Contrast:** WCAG 2.1 AA compliant
- [ ] **Motion:** Respect prefers-reduced-motion
- [ ] **Touch Targets:** Minimum 44x44px
- [ ] **Error Messages:** Clear and actionable

---

**Document Status:** Specifications Complete  
**Next Action:** Begin implementation of ActionCenter component

