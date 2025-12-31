# ✅ Visual Verification Checklist - Dev Chat

## 🎯 **Complete UI Verification**

Follow this checklist to verify Dev Chat is working in all quadrants and access methods.

---

## 📍 **Quadrant 1: Right Sidebar (Primary Location)**

### **Visual Check:**
- [ ] Right Sidebar is visible on the right side of screen
- [ ] "Dev Chat" tab is visible in the tab bar
- [ ] "Dev Chat" tab shows as active (highlighted)
- [ ] Chat interface is visible with:
  - [ ] Header showing "💬 Dev Chat - Self-Modifying AI"
  - [ ] Service status indicators (📁 File System, 💻 Terminal)
  - [ ] Message area with welcome message
  - [ ] Input field at bottom
  - [ ] Send button

### **Interaction Check:**
- [ ] Click "Dev Chat" tab → Tab becomes active
- [ ] Type "test" in input field
- [ ] Press Enter or click Send
- [ ] See response: "✅ System Status: ONLINE"
- [ ] Service indicators show green (✅) when online

---

## 📍 **Quadrant 2: Top-Right Button (Always-Visible Access)**

### **Visual Check:**
- [ ] Orange "💬 Dev Chat" button visible in top-right corner
- [ ] Button has proper styling (orange background, white text)
- [ ] Button is above all other content (z-index 99999)

### **Interaction Check:**
- [ ] Click orange button
- [ ] Navigate to `/devchat` route OR Right Sidebar opens
- [ ] Dev Chat interface appears
- [ ] Can type and send messages

---

## 📍 **Quadrant 3: Menu Access (View & Window)**

### **Visual Check:**
- [ ] "View" menu visible in top menu bar
- [ ] "Window" menu visible in top menu bar
- [ ] "💬 Dev Chat" option visible in both menus
- [ ] Shortcut "Ctrl+K" shown next to menu item

### **Interaction Check:**
- [ ] Click "View" → "💬 Dev Chat"
- [ ] Right Sidebar opens
- [ ] Dev Chat tab becomes active
- [ ] Toast notification appears: "Opening Dev Chat (Ctrl+K)"
- [ ] Repeat for "Window" menu

---

## 📍 **Quadrant 4: Keyboard Shortcut**

### **Visual Check:**
- [ ] No visual check needed (keyboard only)

### **Interaction Check:**
- [ ] Press `Ctrl+K` (or `Cmd+K` on Mac)
- [ ] Right Sidebar opens (if closed)
- [ ] Dev Chat tab becomes active
- [ ] Toast notification appears
- [ ] Can immediately type messages

---

## 📍 **Quadrant 5: Direct URL Route**

### **Visual Check:**
- [ ] Navigate to `http://localhost:3000/devchat`
- [ ] Full-screen Dev Chat page appears
- [ ] Header shows "💬 Dev Chat - Self-Modifying AI"
- [ ] "Back to App" button visible
- [ ] Chat interface fills screen

### **Interaction Check:**
- [ ] Type "test" in input field
- [ ] Press Enter
- [ ] See response
- [ ] Click "Back to App" button
- [ ] Navigate back to main app

---

## 📍 **Quadrant 6: Floating Button (Bottom-Right)**

### **Visual Check:**
- [ ] Orange circular button visible in bottom-right
- [ ] Button shows chat icon
- [ ] Button is above other content
- [ ] Hover shows tooltip: "Dev Chat (Ctrl+K)"

### **Interaction Check:**
- [ ] Click floating button
- [ ] Right Sidebar opens
- [ ] Dev Chat tab becomes active
- [ ] Can type and send messages

---

## 🧪 **Functionality Tests**

### **Test 1: Basic Connectivity**
- [ ] Type: `test`
- [ ] See: Service status with File System and Terminal indicators
- [ ] Verify: Both services show ✅ if online

### **Test 2: File Reading**
- [ ] Type: `read package.json`
- [ ] See: File contents displayed
- [ ] Verify: Content is readable and formatted

### **Test 3: Command Execution**
- [ ] Type: `run echo "Hello World"`
- [ ] See: Command output displayed
- [ ] Verify: Output is correct

### **Test 4: Service Status**
- [ ] Check service indicators in header
- [ ] Green (✅) = Online
- [ ] Red (⚠️) = Offline
- [ ] Verify: Status matches actual service availability

---

## 🎨 **Design System Compliance**

### **Check:**
- [ ] Follows grey-on-grey foundation
- [ ] No unnecessary borders
- [ ] Proper use of accent color (orange) for interactive elements
- [ ] Text colors follow Xibalba standards
- [ ] Proper spacing using Hallberg Maths units
- [ ] Components positioned in correct quadrants

---

## ✅ **Success Criteria**

All of the following must be true:

1. ✅ Dev Chat visible in Right Sidebar (default tab)
2. ✅ All 6 access methods work
3. ✅ Service status indicators show correct state
4. ✅ Can type and send messages
5. ✅ File reading works
6. ✅ Command execution works
7. ✅ Error messages are helpful
8. ✅ UI follows design system
9. ✅ All quadrants properly mapped
10. ✅ Visual verification passes

---

**Status:** Ready for comprehensive visual verification

**Next:** Test each quadrant and access method, verify functionality

