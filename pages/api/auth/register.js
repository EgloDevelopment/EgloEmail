const { getMongo } = require("@/databases/mongo")


const validator = require("validator")
const { v4: uuidv4 } = require("uuid");
const { validateBody } = require("@/functions/validate-body");

export default async function handler(req, res) {
    if (process.env.ALLOW_REGISTERING !== "yes") {
        res.status(403).json({ error: "Admin has disabled registering" });
        return
    }

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


    let account_check = await mongoClient
        .db("EgloEmail")
        .collection("Users")
        .findOne({ owned_emails: req.body.email });

    if (account_check !== null) {
        res.status(403).json({
            error: true,
            fields: ["email"],
            data: "Address already in use",
        });
        return;
    }



    await mongoClient
        .db("EgloEmail")
        .collection("Users")
        .insertOne({
            email: req.body.email,
            password: req.body.password,
            id: uuidv4(),
            owned_emails: [
                req.body.email
            ]
        });


    res.status(200).json({ success: true });

}
