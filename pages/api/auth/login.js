const { getMongo } = require("@/databases/mongo")


const { validateBody } = require("@/functions/validate-body");

export default async function handler(req, res) {
    try {
        const errors = await validateBody(req.body, [
            {
                email: {
                    type: "string",
                    empty: false,
                    email: true,
                    max_length: 20,
                    alphanumeric: false,
                    strong_password: false,
                },
            },
            {
                password: {
                    type: "string",
                    empty: false,
                    email: false,
                    max_length: 25,
                    alphanumeric: false,
                    strong_password: false,
                },
            }
        ]);

        if (errors) {
            res.status(403).json(errors);
            return;
        }

        const mongoClient = await getMongo();

        const user = await mongoClient
            .db("EgloEmail")
            .collection("Users")
            .findOne({
                owned_emails: req.body.email
            });

        if (user === null) {
            res.status(403).json({
                error: true,
                fields: ["email"],
                data: "Account does not exist",
            });
            return;
        } else if (req.body.password !== user.password) {
            res.status(403).json({
                error: true,
                fields: ["password"],
                data: "Password is incorrect",
            });
            return;
        }

        let user_token = Buffer.from(`${user.email}:${user.password}`, "utf8").toString("base64")

        let get_token = process.env.GET_AUTH
        let send_token = process.env.SEND_AUTH
        let sent_token = process.env.SENT_AUTH

        res.status(200).json({
            success: true,
            token: user_token,

            get_token: get_token,
            send_token: send_token,
            sent_token: sent_token
        });
    } catch (e) {
        res.status(500).json({
            error: true,
            fields: ["*"],
            data: "Internal server error",
        });
        return;
    }
}
