export default defineEventHandler(async () => {
  // In a real implementation, you would send a factory reset command to the ESP8266

  // Reset our global variables for demo purposes
  global.currentMessage = "Hello World";
  global.wifiNetworks = [];

  return {
    success: true,
    message: "Factory reset command sent successfully",
  };
});
