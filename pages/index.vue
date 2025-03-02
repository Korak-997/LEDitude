<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-secondary p-4 text-white shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold flex items-center">
          <Icon
            icon="mdi:led-strip-variant"
            class="mr-2 text-primary text-3xl"
          />
          LED Matrix Control
        </h1>
        <nav>
          <NuxtLink
            to="/setup"
            class="text-white hover:text-primary transition flex items-center"
          >
            <Icon
              icon="mdi:cog"
              class="mr-1"
            />
            Setup
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Message Panel -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <Icon
              icon="mdi:message-text"
              class="mr-2 text-primary"
            />
            Message Control
          </h2>

          <!-- Message Preview -->
          <div
            class="message-preview bg-black text-primary p-4 rounded-lg mb-4 font-mono overflow-x-auto whitespace-nowrap"
          >
            {{ message || "Enter your message" }}
          </div>

          <!-- Message Form -->
          <form
            @submit.prevent="sendMessage"
            class="mb-4"
          >
            <div class="mb-4">
              <input
                v-model="message"
                placeholder="Enter your message"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition"
            >
              <Icon
                icon="mdi:send"
                class="mr-2"
              />
              Send to Display
            </button>
          </form>

          <!-- Emoji Picker -->
          <div class="emoji-picker">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Quick Emojis</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="emoji in commonEmojis"
                :key="emoji"
                @click="addEmoji(emoji)"
                class="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 text-xl"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>

        <!-- Display Status -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <Icon
              icon="mdi:monitor"
              class="mr-2 text-primary"
            />
            Display Status
          </h2>

          <div class="status-info space-y-4">
            <div
              class="flex justify-between items-center pb-2 border-b border-gray-200"
            >
              <span class="text-gray-600">Connection:</span>
              <span
                class="flex items-center"
                :class="isConnected ? 'text-green-500' : 'text-red-500'"
              >
                <Icon
                  :icon="isConnected ? 'mdi:check-circle' : 'mdi:close-circle'"
                  class="mr-1"
                />
                {{ isConnected ? "Connected" : "Disconnected" }}
              </span>
            </div>

            <div
              class="flex justify-between items-center pb-2 border-b border-gray-200"
            >
              <span class="text-gray-600">WiFi Network:</span>
              <span>{{ wifiStatus || "Unknown" }}</span>
            </div>

            <div
              class="flex justify-between items-center pb-2 border-b border-gray-200"
            >
              <span class="text-gray-600">IP Address:</span>
              <span class="font-mono">{{ ipAddress || "-" }}</span>
            </div>

            <div
              class="flex justify-between items-center pb-2 border-b border-gray-200"
            >
              <span class="text-gray-600">Current Message:</span>
              <span class="font-mono max-w-xs truncate">{{
                currentDisplayMessage || "-"
              }}</span>
            </div>
          </div>

          <div class="mt-6">
            <button
              @click="checkStatus"
              class="w-full bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-4 rounded transition"
            >
              <Icon
                icon="mdi:refresh"
                class="mr-2"
              />
              Refresh Status
            </button>
          </div>
        </div>
      </div>

      <!-- Message Templates -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4 flex items-center">
          <Icon
            icon="mdi:text-box-multiple"
            class="mr-2 text-primary"
          />
          Message Templates
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(template, index) in messageTemplates"
            :key="index"
            @click="message = template"
            class="border border-gray-200 p-4 rounded cursor-pointer hover:bg-gray-50 transition"
          >
            <p class="font-mono text-gray-800 truncate">{{ template }}</p>
          </div>
        </div>

        <div class="mt-4">
          <button
            @click="addTemplate"
            class="flex items-center text-primary hover:text-primary-dark transition"
          >
            <Icon
              icon="mdi:plus-circle"
              class="mr-1"
            />
            Save Current Message as Template
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { Icon } from "@iconify/vue";

  // State
  const message = ref("Hello World");
  const isConnected = ref(false);
  const wifiStatus = ref("");
  const ipAddress = ref("");
  const currentDisplayMessage = ref("");
  const messageTemplates = ref([
    "Hello World!",
    "Welcome! 👋",
    "Meeting in progress... 🔴",
    "Be right back! ⏱️",
    "Do not disturb! 🔕",
    "Happy Birthday! 🎂",
  ]);
  const commonEmojis = ref([
    "😀",
    "👋",
    "❤️",
    "👍",
    "🚀",
    "🎉",
    "⭐",
    "🔥",
    "🎵",
    "🎮",
    "💻",
    "📱",
  ]);

  // Methods
  async function sendMessage() {
    try {
      const response = await fetch("/api/set-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.value }),
      });

      if (response.ok) {
        currentDisplayMessage.value = message.value;
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  function addEmoji(emoji) {
    message.value += emoji;
  }

  async function checkStatus() {
    try {
      const response = await fetch("/api/status");
      if (response.ok) {
        const data = await response.json();
        isConnected.value = data.connected;
        wifiStatus.value = data.wifiName;
        ipAddress.value = data.ipAddress;
        currentDisplayMessage.value = data.currentMessage;
      }
    } catch (error) {
      console.error("Error checking status:", error);
      isConnected.value = false;
    }
  }

  function addTemplate() {
    if (message.value && !messageTemplates.value.includes(message.value)) {
      messageTemplates.value.push(message.value);
    }
  }

  // Lifecycle
  onMounted(() => {
    checkStatus();
  });
</script>
