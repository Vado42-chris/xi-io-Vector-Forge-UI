# Local GGUF Model Setup for VectorForge

## ✅ Your GGUF Models Will Work!

**Yes, your GGUF files will work perfectly with VectorForge's script editor!**

The system supports multiple local AI inference backends that can load and run GGUF models.

---

## Supported Providers

### 1. **Ollama** (Recommended - Easiest)
- **Default URL**: `http://localhost:11434`
- **How to use**: Install Ollama, load your GGUF model
- **Best for**: Quick setup, automatic model management

**Setup:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Create a Modelfile for your GGUF
# Or use: ollama create mymodel -f Modelfile
# Or: ollama pull llama2 (for pre-made models)

# Your GGUF can be converted/imported into Ollama
```

### 2. **llama-cpp-python** (OpenAI-Compatible API)
- **Default URL**: `http://localhost:8080`
- **How to use**: Run llama-cpp-python server with your GGUF file
- **Best for**: Direct GGUF file usage, OpenAI-compatible API

**Setup:**
```bash
# Install llama-cpp-python
pip install llama-cpp-python[server]

# Run server with your GGUF file
python -m llama_cpp.server --model /path/to/your/model.gguf --host 0.0.0.0 --port 8080
```

### 3. **text-generation-webui**
- **Default URL**: `http://localhost:7860`
- **How to use**: Load your GGUF in text-generation-webui
- **Best for**: If you already use text-generation-webui

**Setup:**
```bash
# Install text-generation-webui
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui
./install.sh

# Load your GGUF model in the UI
# Server runs on port 7860
```

### 4. **Custom Inference Server**
- **URL**: Your custom endpoint
- **How to use**: Point to your own inference server
- **Best for**: Custom setups, existing infrastructure

---

## Configuration in VectorForge

### Step 1: Open MCP Settings
1. Open **Left Sidebar** → **Engine** tab
2. Scroll to **MCP Protocol Settings**

### Step 2: Enable Local AI
1. ✅ Check **"Enable MCP Protocol"**
2. ✅ Check **"Use Local GGUF Models"**

### Step 3: Configure Provider
1. Click **"Auto-Detect"** to find your running server
2. Or manually select:
   - **Ollama** → `http://localhost:11434`
   - **llama-cpp-python** → `http://localhost:8080`
   - **text-generation-webui** → `http://localhost:7860`
   - **Custom** → Your server URL

### Step 4: Select Model
1. Click **Refresh** button to load available models
2. Select your GGUF model from dropdown
3. Click **Test** to verify connection

### Step 5: Save
1. Click **"Save Configuration"**
2. Your GGUF model is now powering the script editor!

---

## How It Works

### Architecture
```
Script Editor
    ↓
mcpScriptService
    ↓
localAIService (NEW)
    ↓
Your GGUF Model (via Ollama/llama-cpp/etc.)
```

### Features Powered by Your GGUF
- **Code Completion**: AI suggests next commands based on context
- **Validation**: AI checks for errors and suggests fixes
- **Documentation**: AI provides command help
- **Suggestions**: AI suggests code improvements

---

## Example: Using Ollama with Your GGUF

### 1. Convert/Import Your GGUF to Ollama

**Option A: Direct GGUF import**
```bash
# Ollama can use GGUF files directly
ollama create mymodel -f Modelfile
# In Modelfile, specify path to your GGUF
```

**Option B: Use existing GGUF with llama-cpp-python**
```bash
python -m llama_cpp.server \
  --model /path/to/your/model.gguf \
  --host 0.0.0.0 \
  --port 8080 \
  --n_ctx 4096
```

### 2. Configure VectorForge
- Provider: `llama-cpp-python`
- Server URL: `http://localhost:8080`
- Model: (auto-detected or enter model name)

### 3. Test Connection
- Click **Test** button in settings
- Should show: "Connected to llama-cpp at http://localhost:8080"

---

## Environment Variables

You can also set defaults via environment variables:

```bash
# .env.local
VITE_LOCAL_AI_URL=http://localhost:11434
VITE_LOCAL_AI_MODEL=your-model-name
VITE_LOCAL_AI_PROVIDER=ollama
VITE_GGUF_PATH=/path/to/model.gguf
```

---

## Troubleshooting

### Model Not Appearing
- **Check**: Is your inference server running?
- **Check**: Is your GGUF model loaded in the server?
- **Try**: Click "Refresh" button to reload models
- **Try**: Restart your inference server

### Connection Failed
- **Check**: Server URL is correct
- **Check**: Server is accessible (try in browser: `http://localhost:11434/api/tags`)
- **Check**: Firewall isn't blocking the port
- **Try**: Test connection button for detailed error

### Slow Responses
- **Check**: GGUF quantization level (Q4_K_M is good balance)
- **Check**: Context size (smaller = faster)
- **Check**: GPU acceleration enabled in your inference server
- **Adjust**: Temperature and other parameters in advanced settings

---

## Performance Tips

### For Best Performance
1. **Use GPU acceleration** if available
2. **Use quantized models** (Q4_K_M, Q5_K_M)
3. **Limit context size** for faster responses
4. **Use smaller models** for code completion (7B-13B work well)

### Recommended GGUF Settings
- **Quantization**: Q4_K_M or Q5_K_M
- **Context**: 2048-4096 tokens
- **Temperature**: 0.3-0.5 for code completion
- **Top P**: 0.9
- **Top K**: 40

---

## What Your GGUF Models Power

### Script Editor Features
- **Auto-completion**: Type `#` and get AI suggestions
- **Error detection**: AI finds syntax errors
- **Code suggestions**: AI suggests improvements
- **Documentation**: AI explains commands

### Example AI Interactions
```
User types: #move
AI suggests: #move layer1 x:100 y:50

User has error: #move layer1
AI detects: Missing x or y parameter
AI suggests: Add x:100 or y:50 parameter

User writes: #move layer1 x:100
AI suggests: Add duration:30 for smooth animation
```

---

## Next Steps

1. **Start your inference server** with your GGUF model
2. **Open VectorForge** → Engine tab → MCP Settings
3. **Enable Local AI** and configure
4. **Test connection** to verify it works
5. **Start scripting** - AI features activate automatically!

---

**Your GGUF models are ready to power VectorForge's AI features!** 🚀

