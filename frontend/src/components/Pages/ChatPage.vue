<template>
  <div class="chat-container">
    <div class="chat-list">
      <h2>My Chats</h2>
      <ul>
        <li v-for="chat in chats" :key="chat.id" @click="selectChat(chat)" class="chat-button">
          {{ chat.name }}
        </li>
      </ul>
    </div>
    <div class="chat-content">
      <div v-if="selectedChat" class="chat-history">
        <h3>Chat History: {{ selectedChat.name }}</h3>
        <div v-for="message in selectedChat.messages" :key="message.id">
          <strong>{{ message.sender }}:</strong> {{ message.text }}
        </div>
        <div class="chat-input">
          <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message...">
          <button @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SocketService from '@/components/services/socketio.service';

export default {
  name: "ChatPage",
  data() {
    return {
      chats: [],
      selectedChat: null,
      newMessage: ""
    };
  },
  mounted() {
    this.fetchChats();
    SocketService.setupSocketConnection();
    // Прослуховування події оновлення історії чату зі сервера
    SocketService.onSocketEvent('chatHistoryUpdated', this.handleChatHistoryUpdated);
  },
  beforeUnmount() {
    SocketService.disconnect(); // Відключення від сервера WebSocket перед розмонтажем компонента
  },
  methods: {
    async fetchChats() {
      try {
        const response = await axios.get('http://localhost:8081/chats', {
          headers: {Authorization: localStorage.getItem("jwt")},
        });
        this.chats = response.data;
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    },
    async selectChat(chat) {
      try {
        const response = await axios.get(`http://localhost:8081/chats/${chat.id}/messages`);
        this.selectedChat = {...chat, messages: response.data};
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    },
    handleChatHistoryUpdated(updatedMessages) {

      if (this.selectedChat) {
        const messageWithMatchingChatId = updatedMessages.find(message => message.chatId === this.selectedChat.id);

        if (messageWithMatchingChatId) {
          this.selectedChat.messages = updatedMessages;
        }
      }
    },
    async sendMessage() {
      try {
        if (this.newMessage.trim() !== "" && this.selectedChat) {
          const token = localStorage.getItem("jwt");
          const message = {
            text: this.newMessage.trim()
          };
          const response = await axios.post(`http://localhost:8081/chats/${this.selectedChat.id}/messages`, message, {
            headers: {Authorization: token},
          });

          SocketService.emitSocketEvent('updateChatHistory', this.selectedChat.id);

          this.selectedChat.messages.push(response.data);
          this.newMessage = "";
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }
};
</script>

<style scoped>
* {
  margin-left: 10px;
}

.chat-container {
  display: flex;
  justify-content: space-between;
}

.chat-list {
  flex: 1;
  padding-right: 20px;
  border-right: 1px solid #ccc;
}

.chat-content {
  flex: 2;
  padding-left: 20px;
}

.chat-history {
  margin-bottom: 20px;
}

.chat-input {
  margin-top: 10px;
}

input {
  padding: 5px;
  margin-right: 10px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

.chat-button {
  list-style: none;
  margin-bottom: 5px;
  cursor: pointer;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.chat-button:hover {
  background-color: #e0e0e0;
}
</style>
