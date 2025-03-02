<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-secondary p-4 text-white shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold flex items-center">
          <Icon
            icon="mdi:led-strip-variant"
            class="mr-2 text-primary text-3xl"
          />
          LED Matrix Setup
        </h1>
        <nav>
          <NuxtLink
            to="/"
            class="text-white hover:text-primary transition flex items-center"
          >
            <Icon
              icon="mdi:arrow-left"
              class="mr-1"
            />
            Back to Control Panel
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Connection Methods -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-xl font-bold mb-4">Connection Method</h2>

          <div class="flex space-x-4 mb-6">
            <button
              @click="activeTab = 'usb'"
              :class="[
                'flex-1 py-2 rounded-md transition',
                activeTab === 'usb'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200',
              ]"
            >
              <Icon
                icon="mdi:usb"
                class="mr-2"
              />
              USB Connection
            </button>

            <button
              @click="activeTab = 'wifi'"
              :class="[
                'flex-1 py-2 rounded-md transition',
                activeTab === 'wifi'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200',
              ]"
            >
              <Icon
                icon="mdi:wifi"
                class="mr-2"
              />
              WiFi Settings
            </button>
          </div>

          <!-- USB Setup Tab -->
          <div
            v-if="activeTab === 'usb'"
            class="space-y-6"
          >
            <div
              class="text-center py-4"
              v-if="!serialPort"
            >
              <Icon
                icon="mdi:usb"
                class="text-5xl text-gray-400 mb-2"
              />
              <p class="text-gray-600 mb-4">
                Connect your LED Matrix via USB and click the button below to
                configure
              </p>
              <button
                @click="connectSerial"
                class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded transition inline-flex items-center"
              >
                <Icon
                  icon="mdi:connection"
                  class="mr-2"
                />
                Connect USB Device
              </button>
            </div>

            <div v-else>
              <div
                class="flex items-center justify-between mb-4 p-2 bg-green-50 rounded"
              >
                <span class="text-green-600 flex items-center">
                  <Icon
                    icon="mdi:check-circle"
                    class="mr-1"
                  />
                  Device Connected
                </span>
                <button
                  @click="disconnectSerial"
                  class="text-gray-500 hover:text-gray-700"
                >
                  <Icon icon="mdi:close" />
                </button>
              </div>

              <form
                @submit.prevent="sendSerialConfig"
                class="space-y-4"
              >
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2"
                    >Server IP Address</label
                  >
                  <input
                    v-model="serialConfig.serverIP"
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="192.168.1.100"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    This computer's IP address on the local network
                  </p>
                </div>

                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2"
                    >Server Port</label
                  >
                  <input
                    v-model="serialConfig.serverPort"
                    type="number"
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="3000"
                  />
                </div>

                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2"
                    >WiFi SSID</label
                  >
                  <input
                    v-model="serialConfig.ssid"
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="WiFi Network Name"
                  />
                </div>

                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2"
                    >WiFi Password</label
                  >
                  <input
                    v-model="serialConfig.password"
                    type="password"
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="WiFi Password"
                  />
                </div>

                <div class="flex items-center">
                  <input
                    v-model="serialConfig.remember"
                    type="checkbox"
                    id="rememberWifi"
                    class="mr-2"
                  />
                  <label
                    for="rememberWifi"
                    class="text-gray-700"
                    >Remember this WiFi network</label
                  >
                </div>

                <button
                  type="submit"
                  class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition"
                >
                  <Icon
                    icon="mdi:send"
                    class="mr-2"
                  />
                  Send Configuration
                </button>
              </form>
            </div>
          </div>

          <!-- WiFi Setup Tab -->
          <div
            v-if="activeTab === 'wifi'"
            class="space-y-6"
          >
            <div class="mb-4">
              <h3 class="font-bold text-gray-700 mb-2">Saved WiFi Networks</h3>

              <div
                v-if="wifiNetworks.length === 0"
                class="text-center py-4 text-gray-500"
              >
                No saved WiFi networks
              </div>

              <div
                v-else
                class="space-y-2"
              >
                <div
                  v-for="(network, i) in wifiNetworks"
                  :key="i"
                  class="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div class="flex items-center">
                    <Icon
                      icon="mdi:wifi"
                      class="text-primary mr-2"
                    />
                    <span>{{ network.ssid }}</span>
                  </div>
                  <button
                    @click="removeNetwork(i)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Icon icon="mdi:delete" />
                  </button>
                </div>
              </div>
            </div>

            <form
              @submit.prevent="addWifiNetwork"
              class="bg-gray-50 p-4 rounded"
            >
              <h3 class="font-bold text-gray-700 mb-2">Add New WiFi Network</h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2"
                    >WiFi SSID</label
                  >
                  <input
                    v-model="newNetwork.ssid"
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="WiFi Network Name"
                    required
                  />
                </div>

                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2"
                    >WiFi Password</label
                  >
                  <input
                    v-model="newNetwork.password"
                    type="password"
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="WiFi Password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition"
                >
                  <Icon
                    icon="mdi:plus"
                    class="mr-2"
                  />
                  Add Network
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Device Info -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Device Information</h2>

          <div class="space-y-2">
            <div
              class="flex justify-between items-center pb-2 border-b border-gray-200"
            >
              <span class="text-gray-600">Firmware Version:</span>
              <span>{{ deviceInfo.firmwareVersion || "-" }}</span>
            </div>

            <div
              class="flex justify-between items-center pb-2 border-b border-gray-200"
            >
              <span class="text-gray-600">Device ID:</span>
              <span class="font-mono">{{ deviceInfo.deviceId || "-" }}</span>
            </div>

            <div
              class="flex justify-between items-center pb-2 border-b border-gray-200"
            >
              <span class="text-gray-600">Uptime:</span>
              <span>{{ deviceInfo.uptime || "-" }}</span>
            </div>
          </div>

          <div class="mt-6 space-y-3">
            <button
              @click="restartDevice"
              class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition"
            >
              <Icon
                icon="mdi:restart"
                class="mr-2"
              />
              Restart Device
            </button>

            <button
              @click="resetDevice"
              class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
            >
              <Icon
                icon="mdi:delete-forever"
                class="mr-2"
              />
              Factory Reset
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { Icon } from "@iconify/vue";

  // State
  const activeTab = ref("usb");
  const serialPort = ref(null);
  const serialWriter = ref(null);
  const serialConfig = ref({
    serverIP: "192.168.1.100",
    serverPort: 3000,
    ssid: "",
    password: "",
    remember: true,
  });

  const wifiNetworks = ref([
    { ssid: "Home WiFi", password: "********" },
    { ssid: "Office Network", password: "********" },
  ]);

  const newNetwork = ref({
    ssid: "",
    password: "",
  });

  const deviceInfo = ref({
    firmwareVersion: "1.0.2",
    deviceId: "ESP-AB12CD",
    uptime: "3 days, 5 hours",
  });

  // Methods
  async function connectSerial() {
    try {
      // Check if Web Serial API is supported
      if (!navigator.serial) {
        alert(
          "Web Serial API is not supported in your browser. Please use Chrome or Edge."
        );
        return;
      }

      // Request a serial port
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });

      // Create a writer
      const textEncoder = new TextEncoder();
      const writer = port.writable.getWriter();

      serialPort.value = port;
      serialWriter.value = {
        write: async (data) => {
          await writer.write(textEncoder.encode(data + "\n"));
        },
        close: async () => {
          await writer.close();
        },
      };
    } catch (error) {
      console.error("Error connecting to serial port:", error);
      alert(
        "Failed to connect to serial port. Make sure your device is connected."
      );
    }
  }

  function disconnectSerial() {
    if (serialWriter.value) {
      serialWriter.value.close();
    }
    if (serialPort.value) {
      serialPort.value.close();
    }
    serialPort.value = null;
    serialWriter.value = null;
  }

  async function sendSerialConfig() {
    if (!serialWriter.value) return;

    try {
      // Send server configuration
      await serialWriter.value.write(
        JSON.stringify({
          set_server: {
            ip: serialConfig.value.serverIP,
            port: parseInt(serialConfig.value.serverPort),
          },
        })
      );

      // Send WiFi configuration
      await serialWriter.value.write(
        JSON.stringify({
          add_wifi: {
            ssid: serialConfig.value.ssid,
            password: serialConfig.value.password,
            remember: serialConfig.value.remember,
          },
        })
      );

      alert("Configuration sent successfully!");

      // Add to WiFi networks list if remember is checked
      if (serialConfig.value.remember && serialConfig.value.ssid) {
        wifiNetworks.value.push({
          ssid: serialConfig.value.ssid,
          password: "********",
        });
      }
    } catch (error) {
      console.error("Error sending configuration:", error);
      alert("Failed to send configuration to the device.");
    }
  }

  function addWifiNetwork() {
    if (newNetwork.value.ssid && newNetwork.value.password) {
      wifiNetworks.value.push({
        ssid: newNetwork.value.ssid,
        password: "********",
      });

      // Reset form
      newNetwork.value = {
        ssid: "",
        password: "",
      };

      // Send to device via API
      fetch("/api/add-wifi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssid: newNetwork.value.ssid,
          password: newNetwork.value.password,
          remember: true,
        }),
      }).catch((error) => {
        console.error("Error adding WiFi network:", error);
      });
    }
  }

  function removeNetwork(index) {
    const network = wifiNetworks.value[index];
    if (confirm(`Are you sure you want to remove "${network.ssid}"?`)) {
      wifiNetworks.value.splice(index, 1);

      // Send to device via API
      fetch("/api/remove-wifi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssid: network.ssid,
        }),
      }).catch((error) => {
        console.error("Error removing WiFi network:", error);
      });
    }
  }

  function restartDevice() {
    if (confirm("Are you sure you want to restart the device?")) {
      fetch("/api/restart-device", {
        method: "POST",
      }).catch((error) => {
        console.error("Error restarting device:", error);
      });
    }
  }

  function resetDevice() {
    if (
      confirm(
        "Are you sure you want to perform a factory reset? This will erase all saved settings."
      )
    ) {
      fetch("/api/reset-device", {
        method: "POST",
      }).catch((error) => {
        console.error("Error resetting device:", error);
      });
    }
  }
</script>
