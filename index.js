const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const reqType = req.body.request?.type;

  if (reqType === "LaunchRequest") {
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Hello! Dave A.I. is online. You can ask me anything.",
        },
        shouldEndSession: false
      }
    });
  }

  if (reqType === "IntentRequest") {
    const intentName = req.body.request.intent.name;
    const slotValue = req.body.request.intent.slots?.query?.value || "nothing";

    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: `You asked me about ${slotValue}. I'm working on that feature.`,
        },
        shouldEndSession: true
      }
    });
  }

  // Fallback for unsupported types
  res.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "Sorry, I didn't understand that request.",
      },
      shouldEndSession: true
    }
  });
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Dave A.I. running on port ${port}`));
