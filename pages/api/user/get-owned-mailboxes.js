const { getMongo } = require("@/databases/mongo")

export default async function handler(req, res) {
    try {
        let email = Buffer.from(req.cookies.token, "base64").toString("utf8").split(":")[0]

        const mongoClient = await getMongo();

        const mailboxes_array = await mongoClient
            .db("EgloEmail")
            .collection("Users")
            .findOne({ email: email })

        res.status(200).json(mailboxes_array.owned_emails);
    } catch (e) {
        res.status(500).json({
            error: true,
            fields: ["*"],
            data: "Internal server error",
        });
        return;
    }
}
