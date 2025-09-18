// Chat Component for Desktop App
class ChatComponent {
    constructor(app) {
        this.app = app;
        this.messages = [];
        this.isListening = false;
        this.recognition = null;
        this.synthesis = null;
        
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.setupSpeechSynthesis();
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'ar-SA';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    chatInput.value = transcript;
                }
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceButton();
            };
        }
    }

    setupSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            id: Date.now().toString(),
            content: `مرحباً بك في Bob Empire Desktop! 👑

أنا مساعدك الذكي. يمكنني مساعدتك في:
• إدارة المتجر والمنتجات
• تشغيل الوكلاء الذكية (140+ وكيل متاح)
• ربط المنصات العالمية (35+ منصة)
• تحليل البيانات والمبيعات
• المزامنة مع الأجهزة الأخرى

استخدم الأوامر الصوتية أو اكتب رسالتك. كيف يمكنني مساعدتك اليوم؟`,
            isUser: false,
            timestamp: new Date(),
            type: 'welcome'
        };

        this.addMessage(welcomeMessage);
    }

    addMessage(message) {
        this.messages.push(message);
        this.renderMessages();
        this.scrollToBottom();
    }

    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;

        const content = chatInput.value.trim();
        if (!content) return;

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            content: content,
            isUser: true,
            timestamp: new Date(),
            type: 'user'
        };

        this.addMessage(userMessage);
        chatInput.value = '';

        // Get AI response
        this.processAIResponse(content);
    }

    async processAIResponse(userMessage) {
        // Show typing indicator
        this.showTypingIndicator();

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = this.generateAIResponse(userMessage);
            
            this.hideTypingIndicator();

            const aiMessage = {
                id: Date.now().toString(),
                content: response,
                isUser: false,
                timestamp: new Date(),
                type: 'ai'
            };

            this.addMessage(aiMessage);
            this.speakMessage(response);

        } catch (error) {
            this.hideTypingIndicator();
            
            const errorMessage = {
                id: Date.now().toString(),
                content: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
                isUser: false,
                timestamp: new Date(),
                type: 'error'
            };

            this.addMessage(errorMessage);
        }
    }

    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('وكيل') || lowerMessage.includes('agent')) {
            return '🤖 لدينا 140+ وكيل ذكي جاهز للعمل! انتقل لقسم الوكلاء لتشغيل أي وكيل تريده.';
        }

        if (lowerMessage.includes('منصة') || lowerMessage.includes('ربط')) {
            return '🔗 يمكنك ربط 35+ منصة عالمية من قسم "ربط المنصات". متاح Amazon, Shopify, AliExpress وأكثر!';
        }

        if (lowerMessage.includes('مزامنة')) {
            return '🔄 نظام المزامنة نشط! يمكنك مزامنة البيانات مع الأجهزة الأخرى فورياً.';
        }

        return '✨ شكراً لك! يمكنني مساعدتك في إدارة متجرك وتشغيل الوكلاء الذكية. ما الذي تريد القيام به؟';
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.app.showNotification('خطأ', 'الأوامر الصوتية غير مدعومة');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
            this.isListening = true;
            this.updateVoiceButton();
        }
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            if (this.isListening) {
                voiceBtn.classList.add('listening');
            } else {
                voiceBtn.classList.remove('listening');
            }
        }
    }

    speakMessage(message) {
        if (!this.synthesis) return;

        const cleanMessage = message.replace(/[🤖🔗🏪🎤💡✨📱⌨️🎯🔄📊🛒📈🌍📦]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanMessage);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8;
        
        this.synthesis.speak(utterance);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-message ai';
        typingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                    <span>جاري الكتابة...</span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    renderMessages() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const typingIndicator = document.getElementById('typing-indicator');
        messagesContainer.innerHTML = '';
        
        if (typingIndicator) {
            messagesContainer.appendChild(typingIndicator);
        }

        this.messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${message.isUser ? 'user' : 'ai'}`;
            
            messageDiv.innerHTML = `
                <div class="message-bubble">
                    <div class="message-content">${this.formatMessage(message.content)}</div>
                    <div class="message-meta">
                        <span class="message-time">${this.formatTime(message.timestamp)}</span>
                    </div>
                </div>
            `;

            messagesContainer.appendChild(messageDiv);
        });
    }

    formatMessage(content) {
        return content.replace(/\n/g, '<br>');
    }

    formatTime(timestamp) {
        return new Intl.DateTimeFormat('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(timestamp);
    }

    clearMessages() {
        this.messages = [];
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        
        setTimeout(() => {
            this.addWelcomeMessage();
        }, 100);
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }
}

window.ChatComponent = ChatComponent;