# ⚠️ IMPORTANT: Correct Port Number

**VectorForge runs on port 3000, NOT 5173!**

---

## ✅ Correct URL

**Use:** `http://localhost:3000`

**NOT:** `http://localhost:5173` ❌

---

## 🚀 Quick Start

1. **Start server:**
   ```bash
   cd /home/chrishallberg/xi-io-Vector-Forge-UI
   npm run dev
   ```

2. **Open browser:**
   Navigate to: **http://localhost:3000**

3. **You should see:**
   - VectorForge UI loads
   - Dark grey theme
   - File menu at top

---

## 📋 Why Port 3000?

The `vite.config.ts` file is configured with:
```typescript
server: {
  port: 3000,
  host: '0.0.0.0',
}
```

This means the dev server runs on port 3000 by default.

---

## 🔧 To Change Port (Optional)

If you want to use port 5173 instead, edit `vite.config.ts`:
```typescript
server: {
  port: 5173,  // Change from 3000 to 5173
  host: '0.0.0.0',
}
```

Then restart the server.

---

**Use http://localhost:3000 to access VectorForge!**

