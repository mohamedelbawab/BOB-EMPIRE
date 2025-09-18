// ai.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

async function getAIResponse(message) {
  // If OpenAI is configured, use it
  if (openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Bob Empire AI, a helpful assistant for a global AI commerce platform. You help users with shopping, authentication, and general inquiries. Respond in a friendly and professional manner."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return "⚡ AI service is currently unavailable. Please try again later.";
    }
  }

  // Fallback to simple responses if OpenAI is not configured
  const lower = message.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) {
    return "👋 Hello! I'm Bob Empire AI, how can I help you today?";
  }
  if (lower.includes("shop") || lower.includes("buy")) {
    return "🛒 Sure! I can show you products from the store.";
  }
  if (lower.includes("help")) {
    return "🤖 I'm here to assist with login, shopping, and AI chat.";
  }
  if (lower.includes("login") || lower.includes("signup")) {
    return "🔐 You can login or signup using the buttons on the main page.";
  }
  return "⚡ AI is still learning. I didn't fully understand, but I'm here! (Configure OpenAI API key for enhanced responses)";
}

// Super AI function that can execute commands
async function runSuperAI(command) {
  if (!command || typeof command !== 'string') {
    return "❌ Invalid command. Please provide a valid command string.";
  }

  const trimmedCommand = command.trim().toLowerCase();
  
  // Handle special commands
  if (trimmedCommand.startsWith('/help')) {
    return "🤖 Super AI Commands:\n" +
           "• /status - Check system status\n" +
           "• /info - Get platform information\n" +
           "• /connect - Connect to platforms\n" +
           "• Any other message will be processed by AI";
  }
  
  if (trimmedCommand.startsWith('/status')) {
    return "✅ Bob Empire Super AI is online and ready!\n" +
           `🔧 OpenAI: ${openai ? 'Connected' : 'Not configured'}\n` +
           "🌐 Platform: Operational";
  }
  
  if (trimmedCommand.startsWith('/info')) {
    return "👑 Bob Empire - Global AI Commerce Platform\n" +
           "🚀 Version: 2.2\n" +
           "💡 Features: AI Assistant, E-commerce, Multi-platform Integration";
  }
  
  if (trimmedCommand.startsWith('/connect')) {
    return "🔗 Platform connections available:\n" +
           "• Amazon, Shopify, AliExpress\n" +
           "• Alibaba, Coupang, Rakuten\n" +
           "• Use the dashboard to configure connections";
  }
  
  // For other commands, use the regular AI response
  return await getAIResponse(command);
}

export { getAIResponse, runSuperAI };