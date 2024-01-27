export default async function handler(req, res) {
    if (process.env.ALLOW_REGISTERING === "yes") {
        res.status(200).json({ allow_registering: true });
    } else {
        res.status(200).json({ allow_registering: false });
    }
}
