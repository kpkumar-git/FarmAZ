const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const bookings = {};

app.post("/whatsapp", (req, res) => {
  const twiml = new MessagingResponse();
  const msg = req.body.Body.toLowerCase();
  const from = req.body.From;

  if (!bookings[from]) bookings[from] = { step: 0, data: {} };

  const user = bookings[from];

  if (user.step === 0) {
    twiml.message("Welcome! How many acres do you want to harvest?");
    user.step = 1;
  } else if (user.step === 1) {
    user.data.acres = msg;
    twiml.message("Great! Please enter the date (DD-MM-YYYY):");
    user.step = 2;
  } else if (user.step === 2) {
    user.data.date = msg;
    twiml.message("Almost done! Please enter the location:");
    user.step = 3;
  } else if (user.step === 3) {
    user.data.location = msg;
    twiml.message(`Thank you! Your booking is confirmed:\n\nAcres: ${user.data.acres}\nDate: ${user.data.date}\nLocation: ${user.data.location}`);
    console.log("New Booking:", user.data);
    delete bookings[from];
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(3000, () => console.log("Bot running on port 3000"));
