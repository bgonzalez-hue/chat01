const CONFIG = {
    // API key will be requested on startup and stored in localStorage
    get API_KEY() {
        return localStorage.getItem('gemini_api_key') || '';
    },
    set API_KEY(value) {
        localStorage.setItem('gemini_api_key', value);
    },
    API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    MODEL: 'gemini-2.5-flash',
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7,
    MAX_MESSAGE_LENGTH: 2000,
    SAVE_CONVERSATION: true
};

// Helper functions for API key management
function setAPIKey(key) {
    localStorage.setItem('gemini_api_key', key);
}

function getAPIKey() {
    return localStorage.getItem('gemini_api_key') || '';
}

function clearAPIKey() {
    localStorage.removeItem('gemini_api_key');
}
