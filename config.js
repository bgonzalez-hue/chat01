const CONFIG = {
    // API key priority: 1) LOCAL_CONFIG.API_KEY (from config.local.js file)
    //                   2) localStorage (browser storage)
    //                   3) Empty string (will show setup instructions)
    get API_KEY() {
        // Try to get from config.local.js first (not tracked by git)
        if (typeof LOCAL_CONFIG !== 'undefined' && LOCAL_CONFIG.API_KEY && LOCAL_CONFIG.API_KEY !== 'your-google-gemini-api-key-here') {
            return LOCAL_CONFIG.API_KEY;
        }
        // Fall back to localStorage
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
    // Try config.local.js first
    if (typeof LOCAL_CONFIG !== 'undefined' && LOCAL_CONFIG.API_KEY && LOCAL_CONFIG.API_KEY !== 'your-google-gemini-api-key-here') {
        return LOCAL_CONFIG.API_KEY;
    }
    // Fall back to localStorage
    return localStorage.getItem('gemini_api_key') || '';
}

function clearAPIKey() {
    localStorage.removeItem('gemini_api_key');
}
