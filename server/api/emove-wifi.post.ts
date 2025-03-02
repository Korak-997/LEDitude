export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.ssid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "SSID is required" }),
    };
  }

  // In a real implementation, you would send this to the ESP8266
  // and/or remove from a database

  // Initialize the networks array if it doesn't exist
  if (!global.wifiNetworks) {
    global.wifiNetworks = [];
    return {
      success: false,
      message: `WiFi network "${body.ssid}" not found`,
    };
  }

  // Find and remove the network
  const initialLength = global.wifiNetworks.length;
  global.wifiNetworks = global.wifiNetworks.filter(
    (network) => network.ssid !== body.ssid
  );

  if (global.wifiNetworks.length === initialLength) {
    return {
      success: false,
      message: `WiFi network "${body.ssid}" not found`,
    };
  }

  return {
    success: true,
    message: `WiFi network "${body.ssid}" removed successfully`,
  };
});
