export default defineEventHandler(async () => {
  // This endpoint is specifically for the ESP8266 to poll for new messages

  // Create a response object with the current message
  const response = {
    message: global.currentMessage || "Hello World",
  };

  // If there's a pending WiFi configuration change, include it
  if (global.pendingWifiConfig) {
    response.wifi = global.pendingWifiConfig;

    // Clear the pending WiFi config after sending it once
    // This ensures it's only sent to the device once
    global.pendingWifiConfig = null;
  }

  return response;
});
