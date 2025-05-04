const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.post("/ask", async (req, res) => {
  console.log("Incoming request:", JSON.stringify(req.body, null, 2));

  const query =
    req.body?.request?.intent?.slots?.Query?.value ||
    req.body?.request?.intent?.slots?.query?.value ||
    "Hello";

  try {
    const gptRes = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: query }],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const reply = gptRes.data.choices[0].message.content;

    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "SSML",
          ssml: `<speak><voice name="Brian">${reply}</voice></speak>`
        },
        shouldEndSession: true
      }
    });

  } catch (err) {
    console.error("Error:", err.message);

    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Sorry, DAVE A.I. encountered an error."
        },
        shouldEndSession: true
      }
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`DAVE A.I. running on port ${port}`);
});
