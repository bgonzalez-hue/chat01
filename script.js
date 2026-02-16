// Chat Application Class
class ChatApp {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.chatForm = document.getElementById('chatForm');
        this.sendButton = document.getElementById('sendButton');
        this.clearChatBtn = document.getElementById('clearChat');
        this.exportChatBtn = document.getElementById('exportChat');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.statusText = document.getElementById('statusText');
        this.statusDot = document.getElementById('statusDot');
        this.charCount = document.getElementById('charCount');
        
        this.conversationHistory = [];
        this.maxCharacters = 2000;
        
        this.init();
    }

    init() {
        // Event Listeners
        this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.exportChatBtn.addEventListener('click', () => this.exportChat());
        this.messageInput.addEventListener('input', () => this.updateCharCount());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        
        // Load conversation from localStorage
        this.loadConversation();
        
        // Check API configuration
        this.checkAPIConfiguration();
    }

    checkAPIConfiguration() {
        if (!CONFIG.API_KEY || CONFIG.API_KEY === 'your-api-key-here') {
            this.updateStatus('error', 'API key not configured');
            this.addMessage('assistant', 'Warning: Please configure your API key in the .env file to use the AI chat functionality.', true);
        } else {
            this.updateStatus('ready', 'Ready');
        }
    }

    updateStatus(status, text) {
        this.statusText.textContent = text;
        this.statusDot.style.background = status === 'ready' ? '#28a745' : status === 'error' ? '#dc3545' : '#ffc107';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        this.messageInput.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();

        // Show loading state
        this.setLoading(true);
        this.updateStatus('processing', 'Thinking...');

        try {
            // Call AI API
            const response = await this.callAI(message);
            this.addMessage('assistant', response);
            this.updateStatus('ready', 'Ready');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('error', `Error: ${error.message}. Please check your API configuration.`, true);
            this.updateStatus('error', 'Error occurred');
        } finally {
            this.setLoading(false);
        }

        // Save conversation
        this.saveConversation();
    }

    async callAI(message) {
        // Add message to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // Check API configuration
        if (!CONFIG.API_KEY || CONFIG.API_KEY === 'your-api-key-here') {
            throw new Error('API key not configured. Please add your API key to the .env file.');
        }

        try {
            // Using Google Gemini API
            const url = `${CONFIG.API_ENDPOINT}?key=${CONFIG.API_KEY}`;
            
            // Convert conversation history to Gemini format
            const contents = [];
            for (const msg of this.conversationHistory) {
                contents.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                });
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: CONFIG.TEMPERATURE,
                        maxOutputTokens: CONFIG.MAX_TOKENS
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.candidates[0].content.parts[0].text;

            // Add assistant response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            return assistantMessage;
        } catch (error) {
            // Remove the user message from history if the API call fails
            this.conversationHistory.pop();
            throw error;
        }
    }

    addMessage(type, text, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isError ? 'error' : type}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textP = document.createElement('p');
        textP.textContent = text;
        contentDiv.appendChild(textP);
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(new Date());
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    setLoading(isLoading) {
        this.loadingOverlay.classList.toggle('active', isLoading);
        this.sendButton.disabled = isLoading;
        this.messageInput.disabled = isLoading;
    }

    updateCharCount() {
        const length = this.messageInput.value.length;
        this.charCount.textContent = `${length}/${this.maxCharacters}`;
        
        if (length > this.maxCharacters) {
            this.charCount.style.color = '#dc3545';
            this.messageInput.value = this.messageInput.value.substring(0, this.maxCharacters);
        } else {
            this.charCount.style.color = '#6c757d';
        }
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 150) + 'px';
    }

    handleKeyDown(e) {
        // Submit on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.chatForm.dispatchEvent(new Event('submit'));
        }
    }

    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            // Keep only the welcome message
            const messages = this.chatMessages.querySelectorAll('.message');
            messages.forEach((msg, index) => {
                if (index > 0) msg.remove();
            });
            
            this.conversationHistory = [];
            this.saveConversation();
            this.updateStatus('ready', 'Chat cleared');
        }
    }

    exportChat() {
        const messages = this.chatMessages.querySelectorAll('.message');
        let chatText = 'AI Chat Export\n';
        chatText += `Date: ${new Date().toLocaleString()}\n`;
        chatText += '=' .repeat(50) + '\n\n';

        messages.forEach(msg => {
            const type = msg.classList.contains('user') ? 'You' : 'AI Assistant';
            const content = msg.querySelector('.message-content p').textContent;
            const time = msg.querySelector('.message-time').textContent;
            chatText += `[${time}] ${type}:\n${content}\n\n`;
        });

        // Create and download file
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    saveConversation() {
        try {
            localStorage.setItem('chatConversation', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    }

    loadConversation() {
        try {
            const saved = localStorage.getItem('chatConversation');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
                
                // Reload messages (skip initial welcome message)
                this.conversationHistory.forEach(msg => {
                    this.addMessage(msg.role === 'user' ? 'user' : 'assistant', msg.content);
                });
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    }
}

// Initialize the chat app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
