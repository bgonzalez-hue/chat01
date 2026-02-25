# AI Chat Application

A modern AI chat application using Google Gemini API with a beautiful, responsive interface.

## What's New

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
- 🚀 Fast and lightweight (no backend required)

## Setup Instructions

### 1. Get a Google Gemini API Key

1. Visit https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure the API Key

Open `config.js` and replace the API_KEY value with your key:

```javascript
API_KEY: 'your-api-key-here'
```

Alternatively, you can also update the `.env` file (for reference):

```
API_KEY=your-api-key-here
API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
MODEL=gemini-2.5-flash
```

### 3. Run the Application

Simply open `index.html` in your web browser. No server required!

**Or** use a local server:
- Python: `python -m http.server 8000`
- VS Code: Use Live Server extension
- Any other local web server

### 4. Start Chatting

The app will show a "Ready" status with a green indicator when configured correctly. Type your message and press Enter or click Send.

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

4. **API key validation error path (`checkAPIConfiguration`)**
	- Verifies missing/placeholder API key sets status text to `API key not configured`.
	- Verifies a warning message is rendered in the chat area.
	- **Why it passed:** `checkAPIConfiguration` explicitly routes invalid keys to error status and warning output.

5. **Template active-state exclusivity (`applyTemplateActiveState`)**
	- Verifies selecting one template marks it active and unmarks the other templates.
	- **Why it passed:** `applyTemplateActiveState` toggles `is-active` based on an exact template match.

6. **Template click guard clause (`handleTemplateClick`)**
	- Verifies clicks outside `.template-button` are ignored.
	- Verifies message input and saved template value are unchanged.
	- **Why it passed:** `handleTemplateClick` returns early when no valid template button is detected.

## How It Works

- **Frontend-only application**: Pure HTML, CSS, and JavaScript
- **Google Gemini API**: Directly calls Google's AI API for responses
- **localStorage**: Saves conversation history locally in your browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
chat01/
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── script.js           # Frontend logic and API integration
├── config.js           # Configuration (API key, endpoint)
├── .env                # Environment variables reference
├── .gitignore          # Git ignore rules (protects API keys)
└── README.md           # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Provider**: Google Gemini API (gemini-2.5-flash model)
- **Styling**: Custom CSS with gradients and smooth animations
- **Storage**: Browser localStorage for conversation persistence

## Available Gemini Models

You can switch models by changing the API_ENDPOINT in config.js:

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
- API key validation
- Network error detection
- Rate limit handling
- User-friendly error messages

## Troubleshooting

**"API key not configured" warning:**
- Make sure you've updated the API_KEY in `config.js`
- The key should not be 'your-api-key-here'

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

- ⚠️ **Never commit `.env` or `config.js` with real API keys to public repositories**
- The `.gitignore` file is configured to protect sensitive files
- For production apps, use a backend server to secure API keys
- Current setup is suitable for personal use and development

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## License

ISC

---

**Note**: This is a client-side application that directly calls the Google Gemini API. For production use, consider implementing a backend proxy to keep your API key secure.

