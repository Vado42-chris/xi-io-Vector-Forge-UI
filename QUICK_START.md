# Quick Start - VectorForge UI Preview

**For External Reviewers:** This guide will help you preview the VectorForge UI locally.

---

## 🚀 **Quick Setup (5 minutes)**

### **Prerequisites:**

- Node.js 18+ installed
- npm or yarn installed
- Git installed

### **Steps:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Vado42-chris/xi-io-Vector-Forge-UI.git
   cd xi-io-Vector-Forge-UI
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Navigate to: `http://localhost:3000`
   - You should see the VectorForge UI

---

## ✅ **What You Should See**

- **Dark theme** - Professional dark grey interface
- **Header** - File menu and tool icons
- **Left Sidebar** - Layers panel
- **Center Canvas** - Drawing workspace
- **Right Sidebar** - Properties/panels
- **Footer** - Status bar

---

## 🐛 **Troubleshooting**

### **Port 3000 Already in Use:**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### **Dependencies Not Installing:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Server Won't Start:**

```bash
# Check Node.js version
node --version  # Should be 18+

# Check for errors
npm run dev 2>&1 | tee dev-server.log
```

---

## 📋 **What to Review**

1. **UI Functionality:**
   - Does the UI load correctly?
   - Are all panels visible?
   - Can you interact with the interface?

2. **Code Quality:**
   - Is the code clean and organized?
   - Are there obvious bugs or issues?
   - Is the architecture sound?

3. **Missing Features:**
   - What features are missing?
   - What would make this better?
   - What's confusing or unclear?

4. **Professional Presentation:**
   - Does it look professional?
   - Is the branding clear?
   - Are there any obvious issues?

---

## 🔗 **Additional Resources**

- **Main README:** `README.md` - Full project documentation
- **API Documentation:** `docs/COMPLETE_API_REFERENCE.md` - Backend API docs
- **Architecture:** `docs/DEVELOPER_GUIDE.md` - System architecture

---

## 📞 **Questions?**

If you encounter issues or have questions:

- Check the main `README.md` for detailed documentation
- Review `docs/` folder for additional guides
- Open an issue on GitHub if you find bugs

---

**Status:** ✅ Ready for review - UI should be visible at `http://localhost:3000`
