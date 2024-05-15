<template>
  <div class="chat-container">
    <div class="chat-list">
      <h2>Мої чати</h2>
      <ul>
        <li v-for="chat in chats" :key="chat.id" class="chat-item">
          <div class="chat-info" @click="selectChat(chat)">
            <span class="chat-name">{{ chat.name }}</span>
            <span class="delete-button" @click.stop="deleteChat(chat)">Delete</span>
          </div>
          <div class="chat-members">
            <!-- Відображення учасників чату в дужках з комами -->
            <span class="members-list">({{ chat.members.map(member => member.username).join(', ') }})</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="chat-content">
      <div v-if="selectedChat" class="chat-history">
        <h3>{{ selectedChat.name }}</h3>
        <div v-for="message in selectedChat.messages" :key="message.id" class="message-container">
          <div :class="{ 'sent-message': message.sender === 'You', 'received-message': message.sender !== 'You' }" class="message">
            <strong>{{ message.sender }}:</strong> {{ message.text }}
          </div>
        </div>
        <div class="chat-input">
          <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Напишіть своє повідомлення тут...">
          <button @click="sendMessage">Send</button>
        </div>
      </div>
      <div v-else class="no-chat-selected">
        <p>Виберіть чат, щоб подивитися повідомлення.</p>
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
    SocketService.onSocketEvent('chatHistoryUpdated', this.handleChatHistoryUpdated);
  },
  beforeUnmount() {
    SocketService.disconnect();
  },
  methods: {
    async fetchChats() {
      try {
        const response = await axios.get('http://localhost:8081/chats', {
          headers: { Authorization: localStorage.getItem("jwt") },
        });
        this.chats = response.data;

        // Після отримання чатів, завантажуємо інформацію про учасників для кожного чату
        await this.loadChatMembers();
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    },
    async loadChatMembers() {
      // Для кожного чату завантажуємо інформацію про учасників
      await Promise.all(this.chats.map(async (chat) => {
        const response = await axios.get(`http://localhost:8081/chat_members/${chat.id}/`);
        chat.members = response.data;
      }));
    },
    async selectChat(chat) {
      try {
        const response = await axios.get(`http://localhost:8081/chats/${chat.id}/messages`);
        this.selectedChat = { ...chat, messages: response.data };
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    },
    async deleteChat(chat) {
      try {
        const token = localStorage.getItem("jwt");
        await axios.delete(`http://localhost:8081/chats/${chat.id}`, {
          headers: { Authorization: token },
        });
        // Оновити список чатів після видалення
        this.fetchChats();
        this.selectedChat = null; // Скинути вибір чату
      } catch (error) {
        console.error('Error deleting chat:', error);
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
          const message = { text: this.newMessage.trim() };
          const response = await axios.post(`http://localhost:8081/chats/${this.selectedChat.id}/messages`, message, {
            headers: { Authorization: token },
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
*{
  margin-left: 10px;
}
.chat-container {
  display: flex;
  justify-content: space-between;
  color: #000000;
  font-family: 'Roboto', sans-serif;
}

.chat-list {
  flex: 1;
  padding-right: 20px;
  border-right: 1px solid #444;
}

.chat-item {
  list-style: none;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #444;
  transition: background-color 0.3s ease;
}

.chat-item:hover {
  background-color: #868686;
}

.chat-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-name {
  font-weight: bold;
}

.delete-button {
  color: #dc3545;
  cursor: pointer;
}

.chat-members {
  display: flex;
  flex-wrap: wrap;
}

.chat-member {
  margin-right: 5px;
  padding: 2px 5px;
  border-radius: 4px;
  color: #000000;
  font-size: 12px;
}

.chat-content {
  flex: 2;
  padding-left: 20px;
}

.chat-history {
  margin-bottom: 20px;
}

.message-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.message {
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
}

.sent-message {
  background-color: #007bff;
}

.received-message {
  background-color: #7a7a7a;
}

.chat-input {
  margin-top: 10px;
}

input {
  padding: 8px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #595959;
  color: #fff;
}

button {
  padding: 8px 16px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.no-chat-selected {
  padding: 20px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
}
</style>
