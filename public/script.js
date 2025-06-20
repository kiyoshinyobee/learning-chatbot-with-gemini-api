const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // catch user input 
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = ''; // Clear input field immediately

  // Display a "Typing..." message for the bot
  const botTypingMessage = document.createElement('div');
  botTypingMessage.classList.add('message', 'bot');
  botTypingMessage.textContent = 'thinking a while...';
  chatBox.appendChild(botTypingMessage);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom

  // Fetching chat response
  try {
    const response = await fetch('/api/chat-service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputMessage: userMessage }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        // Try to get a more specific error message from the backend response
        const errorData = await response.json();
        errorMessage = errorData.response || errorData.error || errorMessage;
      } catch (jsonError) {
        // If parsing JSON fails, use the status text or the generic HTTP error
        errorMessage = response.statusText || errorMessage;
        console.warn('Could not parse error response as JSON:', jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Update the "thinking a while..." message with the actual response
    botTypingMessage.textContent = data.response;
  } catch (error) {
    console.error('Error sending message to backend:', error);
    // Update the "thinking a while..." message with an error message
    botTypingMessage.textContent = `Sorry, an error occurred: ${error.message}`;
  } finally {
    chatBox.scrollTop = chatBox.scrollHeight; // Ensure scroll to bottom after update
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
