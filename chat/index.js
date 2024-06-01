const axios = require("axios");

require("dotenv").config();

async function ChatAssistant({ message, response }) {
  try {
    const data = {
      model: "gpt-3.5-turbo-0301",
      messages: [{ role: "user", content: message }],
    };
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.CHAT_GPT_API_KEY}`,
    };

    const gptResponse = await axios.post(url, data, { headers: headers });
    console.log({ gptResponse });
    response.status(200).send({
      success: true,
      message: "bot successfully replied",
      data: {
        result: gptResponse,
        message: {
          type: "bot",
          message: gptResponse.data.choices[0].message.content,
        },
      },
    });
  } catch (error) {
    console.log({ error });
    response.status(400).send({
      success: false,
      message: "chat assistant failed",
      data: error,
    });
  }
}
exports.ChatAssistant = ChatAssistant;
