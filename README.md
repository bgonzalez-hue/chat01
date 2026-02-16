# AI Chat Application

A modern AI chat application using Google Gemini API with a beautiful, responsive interface.

## Features

- 🤖 AI-powered chat using Google Gemini 2.5 Flash
- 🎨 Modern, responsive UI design with gradient styling
- 💾 Conversation history (localStorage)
- 📤 Export chat functionality to text file
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

### Conversation Management
- **Clear Chat**: Removes all messages except the welcome message
- **Export Chat**: Downloads conversation as a .txt file with timestamps
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

