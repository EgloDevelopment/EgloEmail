const { getMongo } = require("@/databases/mongo")

const simpleParser = require("mailparser").simpleParser;

export default async function handler(req, res) {
    try {
        if (await req.query.auth !== process.env.RECEIVE_AUTH) {
            res.status(403).json({ error: "Invalid RECEIVE auth token" });
            return
        }

        const mongoClient = await getMongo();

        try {
            simpleParser(req.body.raw_email, async (err, email_json) => {
                email_json.to.text = email_json.to.text.toLowerCase()

                await mongoClient.db("EgloEmail").collection("Received").insertOne(email_json);
            });

            res.status(200).json({ success: true, delivered_time: Date.now() });
        } catch {
            res.status(200).json({ success: false });
        }
    } catch (e) {
        res.status(500).json({
            error: true,
            fields: ["*"],
            data: "Internal server error",
        });
        return;
    }
}
