const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Initialize Showdown converter with the 'tables' extension enabled
// See: https://github.com/showdownjs/showdown/wiki/Showdown-options#extensions
const markdownConverter = new showdown.Converter({ tables: true });

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // catch user input 
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = ''; // Clear input field immediately

  // Display a "thinking a while..." message for the bot
  const botLoadingMessage = document.createElement('div');
  botLoadingMessage.classList.add('message', 'bot');
  botLoadingMessage.textContent = 'thinking a while...';
  chatBox.appendChild(botLoadingMessage);
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
    // Convert Markdown response to HTML and update the message
    const htmlResponse = markdownConverter.makeHtml(data.response);
    botLoadingMessage.innerHTML = htmlResponse;
  } catch (error) {
    console.error('Error sending message to backend:', error);
    // Error messages are typically plain text
    const htmlError = markdownConverter.makeHtml(`Sorry, an error occurred: ${error.message}`);
    botLoadingMessage.innerHTML = htmlError;
  } finally {
    chatBox.scrollTop = chatBox.scrollHeight; // Ensure scroll to bottom after update
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text; // User messages are kept as plain text for now
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
