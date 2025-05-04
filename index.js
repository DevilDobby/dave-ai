const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const requestType = req.body.request?.type;
  const query =
    req.body.request?.intent?.slots?.query?.value || "Hello from DAVE";

  // Handle launch request: "Alexa, open DAVE A. I."
  if (requestType === "LaunchRequest") {
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Welcome to Dave A.I. You can ask me anything.",
        },
        shouldEndSession: false,
      },
    });
  }

  // Handle intent request: "Ask DAVE A. I. about climate change"
  if (requestType === "IntentRequest") {
    try {
      const gptRes = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: query }],
      }, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const reply = gptRes.data.choices[0].message.content;

      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: `<speak><voice name="Brian">${reply}</voice></speak>`,
          },
          shouldEndSession: true,
        },
      });
    } catch (err) {
      console.error("GPT error:", err.message);
      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Sorry, something went wrong with Dave A.I.",
          },
          shouldEndSession: true,
        },
      });
    }
  }

  // Catch-all fallback
  return res.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "Sorry, I didn't understand that request.",
      },
      shouldEndSession: true,
    },
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`DAVE A.I. running on port ${port}`));
