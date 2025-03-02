export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Message is required" }),
    };
  }

  // In a real implementation, you would send this message to the ESP8266
  // Store in a database or in-memory store
  global.currentMessage = body.message;

  return {
    success: true,
    message: body.message,
  };
});
