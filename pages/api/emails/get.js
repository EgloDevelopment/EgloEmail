const { getMongo } = require("@/databases/mongo")

export default async function handler(req, res) {
    if (await req.query.auth !== process.env.GET_AUTH) {
        res.status(403).json({ error: "Invalid GET auth token" });
        return
    }

    const mongoClient = await getMongo();

    const emails_array = await mongoClient
        .db("EgloEmail")
        .collection("Received")
        .find({ "to.text": req.body.email })
        .toArray();


    res.status(200).json(emails_array);
}
