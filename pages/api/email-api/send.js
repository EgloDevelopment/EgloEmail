const { getMongo } = require("@/databases/mongo")

const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

export default async function handler(req, res) {
    try {
        if (await req.query.auth !== process.env.SEND_AUTH) {
            res.status(403).json({ error: "Invalid SEND auth token" });
            return
        }

        const mongoClient = await getMongo();

        let resendAccessToken = process.env.RESEND_TOKEN;

        const emailData = {
            from: req.body.from,
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.html,
        };

        try {
            const headers = {
                Authorization: `Bearer ${resendAccessToken}`,
                "Content-Type": "application/json",
            };

            await axios.post("https://api.resend.com/emails", emailData, { headers });

            await mongoClient
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

            res.status(200).json({ success: true, sent_time: Date.now() });
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
