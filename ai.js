// ai.js
function getAIResponse(message) {
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
  return "⚡ AI is still learning. I didn’t fully understand, but I'm here!";
}
module.exports = { getAIResponse };
