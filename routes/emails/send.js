const express = require("express");
const router = express.Router();
const { get } = require("../../mongodb");

const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

router.post("/", async (req, res) => {
  try {
    if (req.query.auth === process.env.SEND_AUTH) {
      const client = get();

      let resendAccessToken = process.env.RESEND_TOKEN;

      const emailData = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html,
      };

      const headers = {
        Authorization: `Bearer ${resendAccessToken}`,
        "Content-Type": "application/json",
      };

      await axios.post("https://api.resend.com/emails", emailData, { headers });

      await client
        .db("EgloEmail")
        .collection("Sent")
        .insertOne({
          from: req.body.from,
          to: req.body.to,
          subject: req.body.subject,
          html: req.body.html,
          time: Date.now(),
          id: uuidv4(),
        });

      res.json({ success: true, sent_time: Date.now() });
    } else {
      res.json({ error: "Unauthorized" });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: "Failed to send email" });
  }
});

module.exports = router;
