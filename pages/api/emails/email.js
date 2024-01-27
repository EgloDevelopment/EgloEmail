const { getMongo } = require("@/databases/mongo")

export default async function handler(req, res) {
    if (await req.query.auth !== process.env.GET_AUTH) {
        res.status(403).json({ error: "Invalid GET auth token" });
        return
    }

    const mongoClient = await getMongo();

    const email = await mongoClient
        .db("EgloEmail")
        .collection("Received")
        .findOne({ messageId: req.body.id })


    res.status(200).json(email);
}
