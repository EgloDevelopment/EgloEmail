const { getMongo } = require("@/databases/mongo")

export default async function handler(req, res) {
    try {
        const mongoClient = await getMongo();

        const email = await mongoClient
            .db("EgloEmail")
            .collection("Received")
            .findOne({ messageId: req.body.id })


        res.status(200).json(email);
    } catch (e) {
        res.status(500).json({
            error: true,
            fields: ["*"],
            data: "Internal server error",
        });
        return;
    }
}
