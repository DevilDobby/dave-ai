const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

app.post("/ask", (req, res) => {
  const reqType = req.body.request?.type;

  if (reqType === "LaunchRequest") {
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "DAVE A.I. is online. You can ask me anything."
        },
        shouldEndSession: false
      }
    });
  }

  if (reqType === "IntentRequest") {
    const intentName = req.body.request.intent.name;
    const slot = req.body.request.intent.slots?.query?.value || "something";

    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: `You asked about ${slot}. Processing now.`
        },
        shouldEndSession: true
      }
    });
  }

  return res.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "Sorry, I didn’t get that."
      },
      shouldEndSession: true
    }
  });
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`DAVE A.I. running on port ${port}`));
