const { getMongo } = require("@/databases/mongo")

export default async function handler(req, res) {
    try {
        if (await req.query.auth !== process.env.SENT_AUTH) {
            res.status(403).json({ error: "Invalid SENT auth token" });
            return
        }

        const mongoClient = await getMongo();

        const emails_array = await mongoClient
            .db("EgloEmail")
            .collection("Sent")
            .find({ from: req.body.email })
            .toArray();


        res.status(200).json(emails_array);
    } catch (e) {
        res.status(500).json({
            error: true,
            fields: ["*"],
            data: "Internal server error",
        });
        return;
    }
}
