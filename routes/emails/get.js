const express = require("express");
const router = express.Router();
const { get } = require("../../mongodb");

router.post("/", async (req, res) => {
  try {
    if (req.query.auth === process.env.GET_AUTH) {
      const client = get();

      const database_interaction = await client
        .db("EgloEmail")
        .collection("Received")
        .find({ "to.text": req.body.email })
        .toArray();

      res.json(database_interaction);
    } else {
      res.json({ error: "Unauthorized" });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: "Failed to get emails" });
  }
});

module.exports = router;
