const express = require("express");
const router = express.Router();
const { get } = require("../../mongodb");

require("dotenv").config();

const simpleParser = require("mailparser").simpleParser;

router.post("/", async (req, res) => {
  try {
    if (req.query.auth === process.env.RECEIVE_AUTH) {
      const client = get();

      simpleParser(req.body.raw_email, async (err, parsed) => {
        await client.db("EgloEmail").collection("Received").insertOne(parsed);
      });

      res.json({ success: true, delivered_time: Date.now() });
    } else {
      res.json({ error: "Unauthorized" });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: "Failed to send email" });
  }
});

module.exports = router;
