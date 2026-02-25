const { ChatApp } = require('../script');

function buildDOM() {
    document.body.innerHTML = `
        <div id="chatMessages"></div>
        <form id="chatForm"></form>
        <textarea id="messageInput"></textarea>
        <button id="sendButton" type="button"></button>
        <button id="clearChat" type="button"></button>
        <button id="exportChat" type="button"></button>
        <button id="themeToggle" type="button"></button>
        <select id="fontSizeSelect">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
        </select>
        <span id="fontSizeActive"></span>
        <div id="promptTemplates">
            <button type="button" class="template-button" data-template="Template A">A</button>
            <button type="button" class="template-button" data-template="Template B">B</button>
        </div>
        <div id="loadingOverlay"></div>
        <span id="statusText"></span>
        <span id="statusDot"></span>
        <span id="charCount"></span>
    `;
}

describe('ChatApp', () => {
    let app;

    beforeEach(() => {
        buildDOM();
        localStorage.clear();
        global.CONFIG = {
            API_KEY: 'test-key',
            API_ENDPOINT: 'https://example.test',
            TEMPERATURE: 0.7,
            MAX_TOKENS: 1000
        };
        app = new ChatApp();
    });

    test('applyTheme updates body dataset and button text', () => {
        app.applyTheme('dark');

        expect(document.body.dataset.theme).toBe('dark');
        expect(document.getElementById('themeToggle').textContent).toBe('Light Mode');
        expect(localStorage.getItem('chatTheme')).toBe('dark');
    });

    test('applyFontSize falls back to medium for invalid value', () => {
        app.applyFontSize('invalid-size');

        expect(document.getElementById('fontSizeSelect').value).toBe('medium');
        expect(document.getElementById('fontSizeActive').textContent).toBe('Medium');
        expect(localStorage.getItem('chatFontSize')).toBe('medium');
    });

    test('template click appends template and marks active button', () => {
        const templateButton = document.querySelector('[data-template="Template B"]');
        app.messageInput.value = 'Current text';

        app.handleTemplateClick({ target: templateButton });

        expect(app.messageInput.value).toBe('Current text\nTemplate B');
        expect(templateButton.classList.contains('is-active')).toBe(true);
        expect(localStorage.getItem('chatLastTemplate')).toBe('Template B');
    });

    test('checkAPIConfiguration shows error status and warning when API key is missing', () => {
        global.CONFIG.API_KEY = 'your-api-key-here';

        app.checkAPIConfiguration();

        expect(document.getElementById('statusText').textContent).toBe('API key not configured');
        expect(document.getElementById('chatMessages').textContent).toContain('Warning: Please configure your API key');
        expect(document.querySelectorAll('#chatMessages .message.error').length).toBe(1);
    });

    test('applyTemplateActiveState activates only selected template', () => {
        const templateA = document.querySelector('[data-template="Template A"]');
        const templateB = document.querySelector('[data-template="Template B"]');

        app.applyTemplateActiveState('Template A');

        expect(templateA.classList.contains('is-active')).toBe(true);
        expect(templateB.classList.contains('is-active')).toBe(false);
    });

    test('template click ignores non-template targets', () => {
        const nonTemplateTarget = document.getElementById('promptTemplates');
        app.messageInput.value = 'Keep this text';

        app.handleTemplateClick({ target: nonTemplateTarget });

        expect(app.messageInput.value).toBe('Keep this text');
        expect(localStorage.getItem('chatLastTemplate')).toBeNull();
    });
});