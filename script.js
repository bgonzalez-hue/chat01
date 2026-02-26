// Chat Application Class
class ChatApp {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.chatForm = document.getElementById('chatForm');
        this.sendButton = document.getElementById('sendButton');
        this.clearChatBtn = document.getElementById('clearChat');
        this.exportChatBtn = document.getElementById('exportChat');
        this.themeToggleBtn = document.getElementById('themeToggle');
        this.fontSizeSelect = document.getElementById('fontSizeSelect');
        this.fontSizeActive = document.getElementById('fontSizeActive');
        this.promptTemplates = document.getElementById('promptTemplates');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.statusText = document.getElementById('statusText');
        this.statusDot = document.getElementById('statusDot');
        this.charCount = document.getElementById('charCount');
        
        this.conversationHistory = [];
        this.maxCharacters = 2000;
        this.themeStorageKey = 'chatTheme';
        this.fontSizeStorageKey = 'chatFontSize';
        this.templateStorageKey = 'chatLastTemplate';
        
        this.init();
    }

    init() {
        // Event Listeners
        this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.chatMessages.addEventListener('click', (e) => this.handleMessageActionClick(e));
        this.promptTemplates.addEventListener('click', (e) => this.handleTemplateClick(e));
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.exportChatBtn.addEventListener('click', () => this.exportChat());
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        this.fontSizeSelect.addEventListener('change', (e) => this.handleFontSizeChange(e));
        this.messageInput.addEventListener('input', () => this.updateCharCount());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));

        this.loadPreferences();
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        
        // Load conversation from localStorage
        this.loadConversation();
        
        // Check API configuration
        this.checkAPIConfiguration();
    }

    loadPreferences() {
        const savedTheme = localStorage.getItem(this.themeStorageKey) || 'light';
        const savedFontSize = localStorage.getItem(this.fontSizeStorageKey) || 'medium';
        const savedTemplate = localStorage.getItem(this.templateStorageKey) || '';

        this.applyTheme(savedTheme);
        this.applyFontSize(savedFontSize);
        this.applyTemplateActiveState(savedTemplate);
    }

    toggleTheme() {
        const currentTheme = document.body.dataset.theme || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
    }

    applyTheme(theme) {
        document.body.dataset.theme = theme;
        this.themeToggleBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem(this.themeStorageKey, theme);
    }

    handleFontSizeChange(e) {
        this.applyFontSize(e.target.value);
    }

    applyFontSize(size) {
        const fontSizes = {
            small: '0.9rem',
            medium: '1rem',
            large: '1.1rem'
        };
        const fontSizeLabels = {
            small: 'Small',
            medium: 'Medium',
            large: 'Large'
        };
        const selectedSize = fontSizes[size] ? size : 'medium';

        document.documentElement.style.setProperty('--chat-font-size', fontSizes[selectedSize]);
        this.fontSizeSelect.value = selectedSize;
        this.fontSizeActive.textContent = fontSizeLabels[selectedSize];
        localStorage.setItem(this.fontSizeStorageKey, selectedSize);
    }

    handleTemplateClick(e) {
        const templateButton = e.target.closest('.template-button');
        if (!templateButton) return;

        const template = templateButton.dataset.template || '';
        if (!template) return;

        const currentText = this.messageInput.value.trim();
        this.messageInput.value = currentText ? `${currentText}\n${template}` : template;
        localStorage.setItem(this.templateStorageKey, template);
        this.applyTemplateActiveState(template);
        this.messageInput.focus();
        this.updateCharCount();
        this.autoResizeTextarea();
    }

    applyTemplateActiveState(selectedTemplate) {
        const templateButtons = this.promptTemplates.querySelectorAll('.template-button');
        templateButtons.forEach((button) => {
            const isActive = button.dataset.template === selectedTemplate;
            button.classList.toggle('is-active', isActive);
        });
    }

    checkAPIConfiguration() {
        this.updateStatus('ready', 'Ready');
    }

    updateStatus(status, text) {
        this.statusText.textContent = text;
        this.statusDot.style.background = status === 'ready' ? '#28a745' : status === 'error' ? '#dc3545' : '#ffc107';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.conversationHistory.push({
            role: 'user',
            content: message
        });
        const userHistoryIndex = this.conversationHistory.length - 1;

        // Add user message
        this.addMessage('user', message, false, userHistoryIndex);
        this.messageInput.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();

        // Show loading state
        this.setLoading(true);
        this.updateStatus('processing', 'Thinking...');

        try {
            // Call AI API
            const response = await this.callAI();
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });
            this.addMessage('assistant', response, false, this.conversationHistory.length - 1);
            this.updateStatus('ready', 'Ready');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('error', `Error: ${error.message}. Please check your server configuration.`, true);
            this.updateStatus('error', 'Error occurred');
        } finally {
            this.setLoading(false);
        }

        // Save conversation
        this.saveConversation();
    }

    async callAI() {
        try {
            const config = typeof CONFIG !== 'undefined' ? CONFIG : {};
            const apiEndpoint = config.API_ENDPOINT || '/api/chat';
            const temperature = typeof config.TEMPERATURE === 'number' ? config.TEMPERATURE : 0.7;
            const maxTokens = typeof config.MAX_TOKENS === 'number' ? config.MAX_TOKENS : 1000;
            
            // Convert conversation history to Gemini format
            const contents = [];
            for (const msg of this.conversationHistory) {
                contents.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                });
            }

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature,
                        maxOutputTokens: maxTokens
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data.text;
        } catch (error) {
            throw error;
        }
    }

    addMessage(type, text, isError = false, historyIndex = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isError ? 'error' : type}`;
        if (Number.isInteger(historyIndex)) {
            messageDiv.dataset.historyIndex = historyIndex.toString();
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textP = document.createElement('p');
        textP.textContent = text;
        contentDiv.appendChild(textP);
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(new Date());

        if (!isError && (type === 'user' || type === 'assistant')) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';

            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'message-action-btn';
            copyBtn.dataset.action = 'copy';
            copyBtn.textContent = 'Copy';
            actionsDiv.appendChild(copyBtn);

            if (type === 'user') {
                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.className = 'message-action-btn';
                editBtn.dataset.action = 'edit';
                editBtn.textContent = 'Edit';
                actionsDiv.appendChild(editBtn);
            }

            if (type === 'assistant') {
                const regenerateBtn = document.createElement('button');
                regenerateBtn.type = 'button';
                regenerateBtn.className = 'message-action-btn';
                regenerateBtn.dataset.action = 'regenerate';
                regenerateBtn.textContent = 'Regenerate';
                actionsDiv.appendChild(regenerateBtn);
            }

            messageDiv.appendChild(actionsDiv);
        }
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    async handleMessageActionClick(e) {
        const actionButton = e.target.closest('.message-action-btn');
        if (!actionButton) return;

        const messageDiv = actionButton.closest('.message');
        if (!messageDiv) return;

        const action = actionButton.dataset.action;
        const textElement = messageDiv.querySelector('.message-content p');
        const historyIndex = parseInt(messageDiv.dataset.historyIndex || '-1', 10);
        const messageText = textElement ? textElement.textContent : '';

        if (action === 'copy') {
            await this.copyText(messageText, actionButton);
            return;
        }

        if (action === 'edit') {
            this.messageInput.value = messageText;
            this.updateCharCount();
            this.autoResizeTextarea();
            this.messageInput.focus();
            return;
        }

        if (action === 'regenerate') {
            await this.regenerateResponse(historyIndex);
        }
    }

    async copyText(text, button = null) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const tempTextarea = document.createElement('textarea');
                tempTextarea.value = text;
                document.body.appendChild(tempTextarea);
                tempTextarea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextarea);
            }
            this.showActionButtonFeedback(button, 'Copied!', 'success');
            this.updateStatus('ready', 'Message copied');
        } catch (error) {
            console.error('Error copying message:', error);
            this.showActionButtonFeedback(button, 'Failed', 'error');
            this.updateStatus('error', 'Copy failed');
        }
    }

    showActionButtonFeedback(button, text, state) {
        if (!button) return;

        if (!button.dataset.defaultText) {
            button.dataset.defaultText = button.textContent;
        }

        button.textContent = text;
        button.classList.remove('is-success', 'is-error');

        if (state === 'success') {
            button.classList.add('is-success');
        }

        if (state === 'error') {
            button.classList.add('is-error');
        }

        if (button._resetTimer) {
            clearTimeout(button._resetTimer);
        }

        button._resetTimer = setTimeout(() => {
            button.textContent = button.dataset.defaultText;
            button.classList.remove('is-success', 'is-error');
            button._resetTimer = null;
        }, 1200);
    }

    async regenerateResponse(assistantHistoryIndex) {
        if (!Number.isInteger(assistantHistoryIndex) || assistantHistoryIndex < 0) return;
        if (this.loadingOverlay.classList.contains('active')) return;
        if (this.conversationHistory[assistantHistoryIndex]?.role !== 'assistant') return;

        let userHistoryIndex = -1;
        for (let index = assistantHistoryIndex - 1; index >= 0; index--) {
            if (this.conversationHistory[index].role === 'user') {
                userHistoryIndex = index;
                break;
            }
        }

        if (userHistoryIndex < 0) return;

        this.conversationHistory = this.conversationHistory.slice(0, userHistoryIndex + 1);

        const messages = this.chatMessages.querySelectorAll('.message[data-history-index]');
        messages.forEach((message) => {
            const messageHistoryIndex = parseInt(message.dataset.historyIndex || '-1', 10);
            if (Number.isInteger(messageHistoryIndex) && messageHistoryIndex >= assistantHistoryIndex) {
                message.remove();
            }
        });

        this.setLoading(true);
        this.updateStatus('processing', 'Regenerating...');

        try {
            const response = await this.callAI();
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });
            this.addMessage('assistant', response, false, this.conversationHistory.length - 1);
            this.updateStatus('ready', 'Ready');
        } catch (error) {
            console.error('Error regenerating response:', error);
            this.addMessage('error', `Error: ${error.message}. Please check your server configuration.`, true);
            this.updateStatus('error', 'Error occurred');
        } finally {
            this.setLoading(false);
            this.saveConversation();
        }
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
            if (typeof this.chatForm.requestSubmit === 'function') {
                this.chatForm.requestSubmit();
            } else {
                this.chatForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
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
        const now = new Date();
        let chatText = 'AI Chat Export\n';
        chatText += `Date: ${now.toLocaleString()}\n`;
        chatText += '=' .repeat(50) + '\n\n';

        if (this.conversationHistory.length === 0) {
            chatText += 'No chat history available for this user.\n';
        } else {
            this.conversationHistory.forEach((msg, index) => {
                const sender = msg.role === 'user' ? 'You' : 'AI Assistant';
                chatText += `${index + 1}. ${sender}:\n${msg.content}\n\n`;
            });
        }

        // Create and download file
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        a.download = `chat-history-${timestamp}.txt`;
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
                this.conversationHistory.forEach((msg, index) => {
                    this.addMessage(msg.role === 'user' ? 'user' : 'assistant', msg.content, false, index);
                });
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new ChatApp();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatApp };
}
