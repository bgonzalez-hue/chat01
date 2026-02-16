// Configuration File
// This file loads environment variables and sets up the application configuration

const CONFIG = {
    // API Configuration - Replace these with your actual API credentials
    API_KEY: 'AIzaSyCIlIZes0RExeFp24P4momtWJn6j9la95s',
    API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', // Google Gemini endpoint
    
    // Model Settings
    MODEL: 'gemini-2.5-flash', // AI model to use
    MAX_TOKENS: 1000, // Maximum tokens in response
    TEMPERATURE: 0.7, // Creativity level (0.0 - 2.0)
    
    // Application Settings
    MAX_MESSAGE_LENGTH: 2000,
    SAVE_CONVERSATION: true
};

// No need to load environment variables in frontend
// API key is now safely stored on the backend server
