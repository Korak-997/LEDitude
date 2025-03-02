export default defineNitroPlugin(() => {
  // Initialize global variables for our API
  global.currentMessage = "Hello World";
  global.wifiNetworks = [
    { ssid: "Home WiFi", password: "********", remember: true },
    { ssid: "Office Network", password: "********", remember: true },
  ];
  global.pendingWifiConfig = null;

  console.log("Server initialized with default values");
});
