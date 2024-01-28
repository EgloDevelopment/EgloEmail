const { getMongo } = require("@/databases/mongo")

export default async function handler(req, res) {
    try {
        let email = Buffer.from(req.cookies.token, "base64").toString("utf8").split(":")[0]
        let password = Buffer.from(req.cookies.token, "base64").toString("utf8").split(":")[1]

        const mongoClient = await getMongo();

        const user_account = await mongoClient
            .db("EgloEmail")
            .collection("Users")
            .findOne({ email: email, password: password })

        if (user_account.owned_emails.includes(req.body.email) === false) {
            res.status(403).json({
                error: true,
                fields: ["*"],
                data: "Unauthorized",
            });
            return;
        }

        const emails_array = await mongoClient
            .db("EgloEmail")
            .collection("Received")
            .find({ "to.text": req.body.email })
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
