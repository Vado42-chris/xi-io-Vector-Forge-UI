# ✅ Tech Lead Verification Checklist - Dev Chat

## **My Job: Test Until It Works**

As tech lead, I need to verify Dev Chat is:
1. ✅ **Visible** - Can be seen in the UI
2. ✅ **Accessible** - Can be reached via all 6 methods
3. ✅ **Functional** - Can perform code edits
4. ✅ **Self-Modifying** - Can edit its own code

---

## **Verification Steps:**

### **1. Dev Server Status**
- [ ] Server running on port 3000
- [ ] No build errors in terminal
- [ ] Server responding to requests

**Command:**
```bash
npm run dev
# OR
./START_AND_VERIFY.sh
```

**Expected:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### **2. Browser Access**
- [ ] Can open `http://localhost:3000`
- [ ] App loads (not blank/loading spinner)
- [ ] No console errors (F12)

**Expected Console Messages:**
```
📦 Starting module load...
✅ App.hardened loaded successfully
✅ App mounted - Right Sidebar visibility: true
✅ RightSidebar mounted - Dev Chat tab should be active
✅ Active tab: devchat
✅ DevChatbot mounted and ready
```

### **3. Right Sidebar Visibility**
- [ ] Right Sidebar visible on right side of screen
- [ ] Panel is not collapsed
- [ ] Tabs are visible at top

**Visual Check:**
- Look at **right side** of screen
- Should see dark grey panel
- Should see tab bar with multiple tabs

### **4. Dev Chat Tab**
- [ ] "💬 Dev Chat" tab exists
- [ ] Tab is FIRST in the list
- [ ] Tab is ACTIVE (highlighted)
- [ ] Tab is clickable

**Visual Check:**
- First tab should be "💬 Dev Chat"
- Should be highlighted/active
- Should be clickable

### **5. Dev Chat Component**
- [ ] Dev Chat interface is visible
- [ ] Welcome message is displayed
- [ ] Service status indicators visible (📁 💻)
- [ ] Input field is visible
- [ ] Send button is visible

**Visual Check:**
- Should see header: "💬 Dev Chat - Self-Modifying AI"
- Should see service status icons
- Should see message area
- Should see input field at bottom

### **6. All 6 Access Methods**

#### **Method 1: Right Sidebar Tab**
- [ ] Click "💬 Dev Chat" tab
- [ ] Dev Chat interface appears
- [ ] Can type in input field

#### **Method 2: Floating Button**
- [ ] Orange button visible (bottom right)
- [ ] Button is clickable
- [ ] Clicking opens Dev Chat

#### **Method 3: Keyboard Shortcut**
- [ ] Press `Ctrl+K` (or `Cmd+K` on Mac)
- [ ] Right Sidebar opens (if collapsed)
- [ ] Dev Chat tab becomes active

#### **Method 4: View Menu**
- [ ] Click "View" → "Dev Chat"
- [ ] Dev Chat opens

#### **Method 5: Window Menu**
- [ ] Click "Window" → "Dev Chat"
- [ ] Dev Chat opens

#### **Method 6: Direct URL**
- [ ] Navigate to `http://localhost:3000/devchat`
- [ ] Standalone Dev Chat page loads
- [ ] Can interact with Dev Chat

### **7. Functionality Test**
- [ ] Type "test" in input
- [ ] Press Enter or click Send
- [ ] See response from Dev Chat
- [ ] Service status is displayed

**Expected Response:**
```
✅ System Status: ONLINE

📁 File System: Online
💻 Terminal: Online

I'm ready to help! What would you like to do?
```

### **8. Self-Modification Test**
- [ ] Type "test molting system"
- [ ] See diagnostic response
- [ ] All services report as available

---

## **If Any Step Fails:**

### **Server Not Running:**
```bash
npm run dev
```

### **Build Errors:**
```bash
npm run type-check
npm run build
```

### **Runtime Errors:**
- Check browser console (F12)
- Share error messages
- Fix root cause

### **Component Not Visible:**
- Check `panelVisibility['right-sidebar']` in state
- Check `activeRightTab === 'devchat'`
- Check console for mounting messages

---

## **Status Report:**

After verification, report:
1. ✅/❌ Dev server running
2. ✅/❌ App loads in browser
3. ✅/❌ Right Sidebar visible
4. ✅/❌ Dev Chat tab visible and active
5. ✅/❌ Dev Chat component rendering
6. ✅/❌ All 6 access methods working
7. ✅/❌ Functionality tested
8. ✅/❌ Self-modification tested

---

**Next:** Once all checks pass, Dev Chat is ready for use.

