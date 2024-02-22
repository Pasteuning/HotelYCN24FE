document.addEventListener('DOMContentLoaded', function() {  
  (function () {
    // Define chat history
    let chatHistory = [];
    let OPENAI_API_KEY;

    document.head.insertAdjacentHTML('beforeend', '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">');

  fetch("https:aidontdeletepython.azurewebsites.net/krijg_sleutel/0111")
  .then(r=>r.text())
  .then(d=> {OPENAI_API_KEY=d;})

    const style = document.createElement('style');
    style.innerHTML = `
  .hidden {
    display: none;
  }
  #chat-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    flex-direction: column;
  }
  .chatbot__arrow--left {
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid #f0f0f0;
  }
  .chatbot__arrow {
  width: 0;
  height: 0;
  margin-top: 18px;
  }
  .chatbot__arrow--right {
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid #1a181e;
  } 

  #chat-popup {
    width: 27vw;
    max-width: 500px;
    height: 78vh;
    max-height: 78vh;
    transition: all 0.3s;
    overflow: hidden;
    position:relative;
  }

  .content-loader {
    display: none;
    padding: 12px 20px;
    position: absolute;
    z-index: 1;
    right: 50px;
    bottom: 100px;
  }

  .typing-loader::after {
    content: "Agent is typing.....";
    animation: typing 1s steps(1) infinite;
    font-size:10px;
  }

  @keyframes typing {
    from,to { width: 0; }
    50% { width: 15px; }
  }

  @keyframes blink {
    50% { color: transparent; }
  }
  @media (max-width: 768px) {
    #chat-popup {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }
  .icon {
  width: 32px;
  height: 32px;
  background-image: url('/icon.png');
  }
  `;

    document.head.appendChild(style);

    // Create container for chat widget
    const chatWidgetContainer = document.createElement('div');
    chatWidgetContainer.id = 'chat-widget-container';
    document.body.appendChild(chatWidgetContainer);
    

    chatWidgetContainer.innerHTML = `
        <div id="chat-bubble" class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer text-3xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        </div>
        <div id="chat-popup" class="hidden absolute bottom-20 right-0 w-98 bg-white rounded-md shadow-md flex flex-col transition-all text-sm">
          <div id="chat-header" class="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h3 class="m-0 text-lg">Papaya Palm Resorts Booking Support</h3>
            <button id="close-popup" class="bg-transparent border-none text-white cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="content-loader">
              <div class="typing-loader"></div>
          </div>
          <div id="chat-messages" class="flex-1 p-4 overflow-y-auto"></div>
          <div id="chat-input-container" class="p-4 border-t border-gray-200">
            <div class="flex space-x-4 items-center">
              <input type="text" id="chat-input" class="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none w-3/4" placeholder="What's your question?">
              <input type="file" id="upload" accept="image/*" class="hidden">
              <label for="upload" class="bg-gray-800 text-white rounded-md px-4 py-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </label>
              <button id="chat-submit" class="bg-gray-800 text-white rounded-md px-4 py-2 cursor-pointer">Send</button>
            </div>
            <div class="flex text-center text-xs pt-4">
              <span class="flex-1">Powered by Papaya Palm Resorts</a></span>
            </div>
          </div>
        </div>
      `;

    // Add a delay to display the greeting message
    setTimeout(function() {
        const chatMessages = document.getElementById('chat-messages');
        const greetingMessage = document.createElement('div');
        greetingMessage.className = 'flex mb-3';
        greetingMessage.innerHTML = `
            <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
                Welcome to Papaya Palm Resorts Booking Support! How can I assist you today? TIP: You could also upload an image of a destination you'd like to go to by clicking the + button
            </div>
        `;
        chatMessages.appendChild(greetingMessage);
    }, 2000); // Adjust the delay time in milliseconds (1000 milliseconds = 1 second)

    // Add event listeners
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const chatBubble = document.getElementById('chat-bubble');
    const chatPopup = document.getElementById('chat-popup');
    const chatMessages = document.getElementById('chat-messages');
    const loader = document.querySelector('.content-loader');
    const closePopup = document.getElementById('close-popup');
    // Add event listener for file input change
    const fileInput = document.getElementById('upload');
    fileInput.addEventListener('change', function(event) {
        const uploadedFile = event.target.files[0];
        if (uploadedFile.type.includes('image')) {
            const reader = new FileReader();
            reader.onload = function() {
                const base64Image = reader.result.split(',')[1]; // Extracting base64 string
                sendImageToOpenAI(base64Image);
            };
            reader.readAsDataURL(uploadedFile); // Read the file as data URL
        } else {
            // Handle non-image file uploads if needed
        }
    });

    chatSubmit.addEventListener('click', function () {

        const message = chatInput.value.trim();
        if (!message) return;

        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatInput.value = '';

        onUserRequest(message);

    });

    chatInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            chatSubmit.click();
        }
    });

    chatBubble.addEventListener('click', function () {
        togglePopup();
    });

    closePopup.addEventListener('click', function () {
        togglePopup();
    });

    function togglePopup() {
        const chatPopup = document.getElementById('chat-popup');
        chatPopup.classList.toggle('hidden');
        if (!chatPopup.classList.contains('hidden')) {
            document.getElementById('chat-input').focus();
        }
    }

    function highlightContactDetails(text) {
        // Email regex
        const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        // Phone number regex
        const phoneRegex = /(\b\+?1\s)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
        // Simples URL regex
        const urlRegex = /(?:https?|ftp):\/\/[\S]+/gi;

        // Replace and add mark tag for highlighting
        text = text.replace(emailRegex, '<mark>$&</mark>');
        text = text.replace(phoneRegex, '<mark>$&</mark>');

        // Replace URLs with buttons
        text = text.replace(urlRegex, '<a href="$&" class="inline-block px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out" target="_blank">Book Here!</a>');

        return text;
    }

    function onUserRequest(message) {
        // Display user message
        const messageElement = document.createElement('div');
        messageElement.className = 'flex justify-end mb-3';
        messageElement.innerHTML = `
      <div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-w-[70%]">
        ${message}
      </div>
    `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatHistory.push({role: 'user', content: message});
        chatInput.value = '';

        // If this is the first message, add the initial sentence to chat history
        if (chatHistory.length === 1) {
          chatHistory.unshift({
              role: 'system',
              content:  "You are a online booking help assistant (you are called mr papAIa Palms). The user is currently on the website looking at a hotel chain which has multiple hotels in multiple cities. I want you to help this customer make a booking. The names of the hotels are: Hotel Amsterdam Plaza, Rotterdam Hotel, Utrecht Grand Hotel, Hague Beach Resort, Eindhoven Inn, Groningen Palace Hotel, Maastricht Manor, Nijmegen Heights, Haarlem Harbour View, Leeuwarden Lodge, The name of the hotel also includes the place where the hotel is. the room types are single, double and family rooms. If the user doesn't specify a specific checkin and checkout date, I want you to recommend a checkin and checkout date based on the conversation. Also reccomend a hotel location based on the conversation if the user doesn't specify this himself. If there is no city, hotel name or period of traveling specified in the conversation, suggest a local event or something to do. If a customer made a choice I want you to provide a link to: if amsterdam the link should be like this: http://20.238.192.119/reservation_details.html?hotelId=1&hotelName=Hotel+Amsterdam+Plaza&ciDate=2024-02-19&coDate=2024-02-20&adults=2&children=0&roomType=DOUBLE&price=100, if eindhoven the link should look like this: http://20.238.192.119/reservation_details.html?hotelId=5&hotelName=Eindhoven+Inn&ciDate=2024-02-19&coDate=2024-02-20&adults=2&children=0&roomType=DOUBLE&price=110 and to maastricht the link should look like this: http://20.238.192.119/reservation_details.html?hotelId=7&hotelName=Maastricht+Manor&ciDate=2024-02-19&coDate=2024-02-20&adults=2&children=0&roomType=DOUBLE&price=90. You can provide this link as plain text after the last . no square brackets or round brackets are needed. I want you to summarize all the booking details and then give the link. If a user confirms with a yes, allright, sounds perfect, sounds good, yeah or anything like that, answer with a summary of the booking and the link where the user can book. If the user says goodbye, end the conversation with: Goodbye, have a nice day! If the user says thank you, end the conversation with: You're welcome! Have a nice day! If the user says something else, end the conversation with: Is there anything else I can help you with? or something similar. If the user says something that is not clear, end the conversation with: I'm sorry, I didn't understand that. Could you rephrashe that?"
          });
        }

        // Reply to the user
        let url = "https://api.openai.com/v1/chat/completions";
        //let OPENAI_API_KEY = ""; // Replace with your OpenAI API key

        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        };

        let body = {
          "model": "gpt-4",
          "messages": chatHistory, // Include entire chat history
          "temperature": 1,
          "max_tokens": 256,
          "top_p": 1,
          "frequency_penalty": 0,
          "presence_penalty": 0
        };
        loader.style.display = 'inline-block';
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => {
                loader.style.display = 'none';
                reply(data['choices'][0]['message']['content'].replace('Customer support:', ''))
            }) // Logs the response data from the API to the console
            .catch(error => console.error('Error:', error));

    }

    function reply(message) {
        const chatMessages = document.getElementById('chat-messages');
        const replyElement = document.createElement('div');
        replyElement.className = 'flex mb-3';
        replyElement.innerHTML = `
      <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
        ${highlightContactDetails(message)}
      </div>
    `;
        chatMessages.appendChild(replyElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendImageToOpenAI(base64Image) {
      const url = "https://api.openai.com/v1/chat/completions";
      //const OPENAI_API_KEY = ""; // Replace with your OpenAI API key

      const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
      };

      const payload = {
          "model": "gpt-4-vision-preview",
          "messages": [
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "You are a online booking help assistant (you are called mr papAIa Palms). The user is currently on the website looking at a hotel chain which has multiple hotels in multiple cities. I want you to help this customer make a booking. The names of the hotels are: Hotel Amsterdam Plaza, Rotterdam Hotel, Utrecht Grand Hotel, Hague Beach Resort, Eindhoven Inn, Groningen Palace Hotel, Maastricht Manor, Nijmegen Heights, Haarlem Harbour View, Leeuwarden Lodge, The name of the hotel also includes the place where the hotel is. the room types are single, double and family rooms. The user supplies an image. You should analyse this picture and give a reccomendation for a hotel, Type of room, checkin and checkout date based on the picture. Make your reccomendation short, clear to read.I want you to provide a link to: if amsterdam the link should be like this: http://20.238.192.119/reservation_details.html?hotelId=1&hotelName=Hotel+Amsterdam+Plaza&ciDate=2024-02-19&coDate=2024-02-20&adults=2&children=0&roomType=DOUBLE&price=100, if eindhoven the link should look like this: http://20.238.192.119/reservation_details.html?hotelId=5&hotelName=Eindhoven+Inn&ciDate=2024-02-19&coDate=2024-02-20&adults=2&children=0&roomType=DOUBLE&price=110 and to maastricht the link should look like this: http://20.238.192.119/reservation_details.html?hotelId=7&hotelName=Maastricht+Manor&ciDate=2024-02-19&coDate=2024-02-20&adults=2&children=0&roomType=DOUBLE&price=90 .You can provide this link as plain text after the last . no square brackets or round brackets are needed. I want you to summarize all the booking details and then give the link. :"
                      },
                      {
                          "type": "image_url",
                          "image_url": {
                              "url": `data:image/jpeg;base64,${base64Image}`
                          }
                      }
                  ]
              }
          ],
          "max_tokens": 500
      };

      loader.style.display = 'inline-block'; // Show loader while processing
      fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
          loader.style.display = 'none'; // Hide loader after response
          const replyMessage = data['choices'][0]['message']['content'].replace('Customer support:', '');
          reply(replyMessage); // Add reply message to chat history
          chatHistory.push({ role: 'system', content: replyMessage }); // Add reply message to chat history
      })
      .catch(error => console.error('Error:', error));
    }
  })();
});