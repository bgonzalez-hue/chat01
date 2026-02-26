# AI Chat Application

A modern AI chat application using Google Gemini API with a beautiful, responsive interface.

## What's New

### 2026-02-26 (Latest)
- **🔒 Enhanced Security**: Improved API key management system
  - API keys stored in `config.local.js` (never uploaded to GitHub)
  - Removed intrusive startup prompt for better UX
  - Added `config.local.example.js` template for easy setup
  - Users can clone and set up their own keys without prompts
  - Supports both local file and browser storage methods
  - Clear setup instructions shown in welcome message

### 2026-02-26 (Earlier)
- **🔒 Secure API Key Prompt**: Added startup prompt for API key entry
  - No need to store API key in files
  - Key stored only in browser's localStorage
  - Safe to commit all files to Git without exposing credentials
  - "Configure API Key" button for easy key management
  - Prevents accidental API key leaks in repositories

### 2026-02-18
- Added active visual indicators for selected controls:
	- Last-used prompt template stays highlighted
	- Current font size is shown with an inline active badge
- Updated README documentation to reflect all recent UI and UX updates

### 2026-02-17
- Added keyboard send enhancement: press `Enter` to send (`Shift+Enter` for new line)
- Added message actions:
	- `Copy` for user and assistant messages
	- `Edit` for user messages
	- `Regenerate` for assistant messages
- Added inline copy button feedback (`Copied!` / `Failed`)
- Added prompt templates (Summarize, Explain simply, Rewrite, Step-by-step)
- Added theme toggle (Light/Dark) with localStorage persistence
- Added font size control (Small/Medium/Large) with localStorage persistence
- Improved export to generate a user chat history `.txt` file with date-based filename

## Features

- 🤖 AI-powered chat using Google Gemini 2.5 Flash
- 🔒 **Secure API Key Prompt** - Enter your key on startup (stored only in browser)
- 🎨 Modern, responsive UI design with gradient styling
- 💾 Conversation history (localStorage)
- 🧩 Prompt templates for faster message composition
- 🌓 Theme toggle with saved preference (Light/Dark)
- 🔤 Font size control with saved preference (Small/Medium/Large)
- ⚡ Message actions: Copy, Edit (user), Regenerate (assistant)
- 📤 Export chat history to `.txt` (from current user session)
- 🔄 Clear chat option
- ⚡ Real-time status indicators
- 📱 Mobile-friendly responsive design
- 🚀 Fast and lightweight (secure backend proxy)

## Setup Instructions

### Quick Start (Recommended)

**Option 1: Local Configuration File (Best for developers)**

1. **Get a FREE Google Gemini API key**:
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Set up local configuration**:
   ```bash
   # Copy the example file
   copy config.local.example.js config.local.js
   
   # Or on Mac/Linux:
   cp config.local.example.js config.local.js
   ```

3. **Add your API key**:
   - Open `config.local.js` in any text editor
   - Replace `'your-google-gemini-api-key-here'` with your actual API key
   - Save the file

4. **Start using**:
   - Open `index.html` in your web browser
   - Start chatting immediately!

**Why this method?**
- ✅ API key stays in `config.local.js` (never uploaded to GitHub)
- ✅ No prompts or popups
- ✅ Safe for team environments
- ✅ Easy to update or rotate keys
- ✅ Works offline after setup

---

**Option 2: Browser Storage (Quick for personal use)**

1. **Open the app**: Open `index.html` in your browser
2. **Click "Configure API Key"** button in the footer
3. **Get your key**: Visit https://aistudio.google.com/app/apikey
4. **Enter your key**: Paste it in the prompt
5. **Start chatting**: Key is saved in browser localStorage

**Why this method?**
- ✅ Quick setup (no file editing)
- ✅ Works on any device
- ✅ Key stored only in your browser

---

### For Users Cloning from GitHub

When you clone this repository:

1. The `config.local.js` file won't exist (it's in `.gitignore`)
2. You'll see a welcome message with setup instructions
3. Follow either setup option above
4. Refresh the page after configuration

**Files you'll see:**
- ✅ `config.local.example.js` - Template to copy
- ❌ `config.local.js` - You need to create this with your key

---

### Alternative: Backend Setup (Optional)

If you prefer using a backend server with the `.env` file:

Create a `.env` file in the project root (or copy `.env.example`) and add your key:

```
API_KEY=your-api-key-here
MODEL=gemini-2.5-flash
PORT=3000
```

### 3. Run the Application

Install dependencies, then run the local server:

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

### 4. Start Chatting

The app will show a "Ready" status with a green indicator when configured correctly. Type your message and press Enter or click Send.

## Managing Your API Key

### Where is my API key stored?

**Method 1: Local File (`config.local.js`)**
- Stored in `config.local.js` file (ignored by Git)
- Never uploaded to GitHub or any repository
- Persists across browser sessions and devices
- Edit the file directly to update

**Method 2: Browser Storage**
- Stored in browser's localStorage under `gemini_api_key`
- Only exists in your specific browser
- Never leaves your device except to call Google's API
- Manage via "Configure API Key" button

### Update or Change Your Key

**For local file method:**
1. Open `config.local.js` in a text editor
2. Replace the API key value
3. Save and refresh the browser

**For browser storage method:**
1. Click "Configure API Key" button
2. Enter new API key in the prompt
3. Key is automatically updated

### Clear Your Key

**Local file method:**
- Delete or edit `config.local.js` file

**Browser storage method:**
- Click "Configure API Key" → Enter empty value, OR
- Open DevTools Console → Run: `localStorage.removeItem('gemini_api_key')`

### Which Method Should I Use?

**Use Local File (`config.local.js`) if you:**
- Are a developer working with version control
- Want persistent setup across browsers/devices
- Prefer file-based configuration
- Work in a team environment

**Use Browser Storage if you:**
- Want quick, no-file-edit setup
- Use a single browser/device
- Prefer UI-based configuration
- Are testing or doing personal projects

### Security Best Practices

- ✅ Never commit `config.local.js` to Git (already in `.gitignore`)
- ✅ Never share your API key with anyone
- ✅ Don't paste your API key in public forums or chats
- ✅ If you accidentally expose your key, regenerate it at https://aistudio.google.com/app/apikey
- ✅ Use different API keys for different projects
- ✅ Monitor your usage at https://aistudio.google.com/
- ✅ Verify `config.local.js` is listed in `.gitignore`

## Testing (Jest)

This project now includes Jest for unit testing.

### Prerequisite

Install Node.js (which includes `npm`) from https://nodejs.org/

### Install dependencies

```bash
npm install
```

### Run tests

```bash
npm test
```

If PowerShell blocks `npm` scripts on your machine, use:

```bash
npm.cmd test
```

### Watch mode

```bash
npm run test:watch
```

### How to add new Jest tests

1. Create or update a test file inside `__tests__/` using the `.test.js` suffix (example: `feature-name.test.js`).
2. Import the class or function you want to test (for app behavior, this project imports `ChatApp` from `script.js`).
3. Build a minimal DOM fixture in the test before each case (using `document.body.innerHTML`) so the app can find required elements.
4. Set any required globals/mocks (for example `global.CONFIG`, `localStorage`, `fetch`, or clipboard APIs).
5. Instantiate the app and execute one behavior per test.
6. Assert expected state changes using Jest expectations (`expect(...)`) for DOM values, storage values, and method outputs.
7. Run tests with `npm test` (or `npm.cmd test` on PowerShell if needed).

## Test Results (2026-02-25)

Jest was executed successfully and all tests passed.

- **Suite:** `__tests__/chatapp.test.js`
- **Result:** 1 suite passed, 6 tests passed, 0 failed

### What was tested and why it passed

1. **Theme application (`applyTheme`)**
	- Verifies that selecting `dark` sets `document.body.dataset.theme` to `dark`.
	- Verifies the toggle button label changes to `Light Mode`.
	- Verifies the preference is persisted in `localStorage` under `chatTheme`.
	- **Why it passed:** `applyTheme` updates all three values exactly as expected.

2. **Font size fallback (`applyFontSize`)**
	- Verifies invalid input falls back to `medium`.
	- Verifies the select control reflects `medium`.
	- Verifies the active badge text becomes `Medium`.
	- Verifies persistence in `localStorage` under `chatFontSize`.
	- **Why it passed:** `applyFontSize` guards unsupported values and applies the default `medium` state.

3. **Prompt template insertion (`handleTemplateClick`)**
	- Verifies clicking a template appends it to existing textarea content on a new line.
	- Verifies the clicked template button receives the `is-active` class.
	- Verifies the selected template is saved in `localStorage` under `chatLastTemplate`.
	- **Why it passed:** `handleTemplateClick` appends text, stores the template, and calls active-state logic correctly.

4. **Proxy configuration ready path (`checkAPIConfiguration`)**
	- Verifies status text is set to `Ready` for the backend-proxy flow.
	- **Why it passed:** `checkAPIConfiguration` now validates client readiness without exposing API keys.

5. **Template active-state exclusivity (`applyTemplateActiveState`)**
	- Verifies selecting one template marks it active and unmarks the other templates.
	- **Why it passed:** `applyTemplateActiveState` toggles `is-active` based on an exact template match.

6. **Template click guard clause (`handleTemplateClick`)**
	- Verifies clicks outside `.template-button` are ignored.
	- Verifies message input and saved template value are unchanged.
	- **Why it passed:** `handleTemplateClick` returns early when no valid template button is detected.

## How It Works

- **Frontend + backend proxy**: Browser sends prompts to a local Node/Express server
- **Google Gemini API**: Server calls Gemini using API key stored only in `.env`
- **localStorage**: Saves conversation history locally in your browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
chat01/
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── script.js           # Frontend logic and API integration
├── config.js           # Frontend-safe configuration
├── server.js           # Backend proxy for Gemini API
├── .env.example        # Environment variable template
├── .env                # Local secrets (ignored by git)
├── .gitignore          # Git ignore rules (protects API keys)
└── README.md           # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Provider**: Google Gemini API (gemini-2.5-flash model)
- **Styling**: Custom CSS with gradients and smooth animations
- **Storage**: Browser localStorage for conversation persistence

## Available Gemini Models

You can switch models by changing `MODEL` in `.env`:

- **gemini-2.5-flash** (Recommended) - Fast and efficient
- **gemini-2.5-pro** - More powerful, better quality
- **gemini-2.0-flash** - Reliable alternative
- **gemini-flash-latest** - Always uses the latest version

## Features Explained

### Chat Interface
- Auto-resizing textarea (up to 150px height)
- Character counter (2000 character limit)
- Send on Enter key (Shift+Enter for new line)
- Smooth scrolling and animations
- Prompt template chips (Summarize, Explain simply, Rewrite, Step-by-step)

### Message Actions
- **Copy**: Available on user and assistant messages
- **Edit**: Available on user messages to quickly resend modified prompts
- **Regenerate**: Available on assistant messages to generate a fresh response
- Inline copy feedback (`Copied!` / `Failed`) on the action button

### Personalization
- **Theme Toggle**: Switch between Light and Dark mode
- **Font Size Control**: Select Small, Medium, or Large
- Preferences are saved automatically in browser localStorage
- Active UI indicators show the last selected template and current font size

### Conversation Management
- **Clear Chat**: Removes all messages except the welcome message
- **Export Chat**: Downloads conversation as a `.txt` file with a date-based filename
- **Auto-save**: Conversation persists in browser localStorage

### Error Handling
- Backend configuration validation
- Network error detection
- Rate limit handling
- User-friendly error messages

## Troubleshooting

**"API key not configured" warning:**
- Make sure `.env` exists and contains `API_KEY`
- Restart the server after updating `.env`

**API errors after adding key:**
- Verify your API key is valid at https://aistudio.google.com/app/apikey
- Check if the key has any restrictions
- Ensure you're using a supported model (gemini-2.5-flash recommended)

**Model not found errors:**
- Use the ListModels command to see available models
- Update to gemini-2.5-flash or gemini-2.5-pro
- Make sure the endpoint URL matches the model name

**Quota exceeded:**
- Free tier has rate limits (check Google AI Studio for details)
- Wait a few minutes before trying again
- Consider upgrading if you need higher limits

## Security Notes

- ⚠️ **Never commit `.env` with real API keys to public repositories**
- The `.gitignore` file is configured to protect sensitive files
- API calls now go through `server.js`, so the key is not exposed in the browser
- Rotate leaked keys immediately and replace with a new key

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## License

ISC

---

**Note**: This app uses a backend proxy so your Gemini API key stays on the server side.

