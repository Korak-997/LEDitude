export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.ssid || !body.password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "SSID and password are required" }),
    };
  }

  // In a real implementation, you would send this to the ESP8266
  // and/or store in a database

  // Initialize the networks array if it doesn't exist
  if (!global.wifiNetworks) {
    global.wifiNetworks = [];
  }

  // Check if network already exists
  const existingIndex = global.wifiNetworks.findIndex(
    (network) => network.ssid === body.ssid
  );

  if (existingIndex >= 0) {
    // Update existing network
    global.wifiNetworks[existingIndex] = {
      ssid: body.ssid,
      password: body.password,
      remember: body.remember || true,
    };
  } else {
    // Add new network
    global.wifiNetworks.push({
      ssid: body.ssid,
      password: body.password,
      remember: body.remember || true,
    });
  }

  return {
    success: true,
    message: `WiFi network "${body.ssid}" added successfully`,
  };
});
