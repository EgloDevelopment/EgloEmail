export default async function handler(req, res) {
    try {
        if (process.env.ALLOW_REGISTERING === "yes") {
            res.status(200).json({ allow_registering: true });
        } else {
            res.status(200).json({ allow_registering: false });
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
