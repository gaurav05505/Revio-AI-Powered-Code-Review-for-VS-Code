# Revio – AI Code Reviewer

Revio is an AI-powered code reviewer extension for Visual Studio Code.  
It helps you analyze and improve your code using AI models like **Gemini** and **Ollama**.

---

## ✨ Features
- 🤖 AI-based code review inside VS Code
- ☁️ Supports **Gemini** (cloud-based, recommended for best results)
- 💻 Supports **Ollama** (local models, no API key needed)
- 🔍 Automatic project scanning and code analysis
- 📊 Real-time progress tracking in Output panel
- 🔐 Secure API key storage
- 📝 Supports JavaScript, TypeScript, HTML, CSS, React and more

---

## 🚀 Quick Start

### 1. Install the Extension
Install Revio from the VS Code Marketplace.

### 2. Choose Your AI Provider

#### Option A: Gemini (Recommended) ⭐
**Best for:** High-quality code reviews with detailed suggestions

**Setup:**
1. Get a free API key from [Google AI Studio]
2. Run `Revio: Check` command
3. Select "Gemini" as provider
4. Enter your API key (it will be saved securely)

**Pros:**
- ✅ Better code analysis quality
- ✅ More detailed suggestions
- ✅ No local setup required
- ✅ Faster processing

**Cons:**
- ❌ Requires API key
- ❌ Needs internet connection

---

#### Option B: Ollama (Local & Free) 🆓
**Best for:** Privacy-focused users or offline usage

**Setup:**
1. Install Ollama from [ollama.ai](https://ollama.ai/)
2. Download the CodeLlama model:
```bash
   ollama pull codellama:7b
```
3. Make sure Ollama is running:
```bash
   ollama serve
```
4. Run `Revio: Check` command
5. Select "Ollama" as provider

**Pros:**
- ✅ No API key needed
- ✅ Works offline
- ✅ Free to use
- ✅ Privacy-friendly (data stays local)

**Cons:**
- ❌ Requires installation and setup
- ❌ Lower quality than Gemini
- ❌ Slower on some systems
- ❌ Requires ~4GB disk space for model

**Note:** We recommend using **Gemini** for the best code review experience, but Ollama is great if you prefer local processing or don't want to use an API key.

---

## 📖 How to Use

### Step 1: Open Command Palette
Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and type **"Revio: Check"**

![Step 1 - Command Palette](images/first.png)

### Step 2: Select AI Provider
Choose between Ollama or Gemini

![Step 2 - Select Provider](images/second.png)

### Step 3: Select Folder
Choose the folder you want to review

![Step 3 - Select Folder](images/third.png)

### Step 4: Watch the Magic!
View progress in the Output panel (View → Output → select "Revio")

![Step 4 - Scanning Progress](images/fourth.png)

---

## 🔑 Managing API Keys

### Setting Up Gemini API Key
- You will be prompted to enter your Gemini API key on first use
- The API key is stored **securely** in VS Code's Secret Storage
- The key is never exposed in settings or logs

### Reset Gemini API Key
If you need to change your API key:
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: **Revio: Reset Gemini API Key**
3. Next time you run a review, you'll be prompted for a new key

---

## ⚙️ Available Commands

| Command | Description |
|---------|-------------|
| `Revio: Check` | Reviews the current project folder |
| `Revio: Reset Gemini API Key` | Clears the saved Gemini API key |

---

## 🛠 Requirements

### For All Users
- Visual Studio Code version **1.90.0** or higher

### For Gemini Users
- Internet connection
- Free API key from [Google AI Studio]

### For Ollama Users
- [Ollama](https://ollama.ai/) installed and running
- CodeLlama model: `ollama pull codellama:7b`
- ~4GB free disk space for the model
- No internet connection required

---

## 🎯 Tips for Best Results

1. **Use Gemini for production code** - Better quality reviews
2. **Use Ollama for quick checks** - Fast local reviews
3. **Review smaller projects first** - Large projects take longer
4. **Check the Output panel** - See detailed progress and logs
5. **Keep Ollama running** - If using local models

---

## ❓ Troubleshooting

### "Command not found" error
- Make sure the extension is installed and enabled
- Reload VS Code window (`Ctrl+R` or `Cmd+R`)

### Ollama not working
- Check if Ollama is running: `ollama serve`
- Verify CodeLlama is installed: `ollama list`
- Re-download if needed: `ollama pull codellama:7b`

### Gemini API errors
- Verify your API key is valid
- Check your internet connection
- Make sure you haven't exceeded API quota

### No files being analyzed
- Check if your file types are supported (see Supported File Types)
- Make sure you selected the correct folder

---

## 📦 Release Notes

### 0.0.1 (Initial Release)
- ✨ AI-powered code review
- 🤖 Gemini and Ollama support
- 📊 Real-time progress tracking
- 🔐 Secure API key storage

---

## 🤝 Contributing

Found a bug or have a suggestion? Please open an issue on [GitHub](https://github.com/gaurav05505/Revio-AI-Powered-Code-Review-for-VS-Code).

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Powered by Google Gemini and Ollama
- Built with ❤️ for the VS Code community

---

**Enjoy using Revio!** 🎉  
If you find it helpful, please consider leaving a ⭐ rating on the marketplace!
