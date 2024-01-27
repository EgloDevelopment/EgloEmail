export default async function readToken(base64_string) {
    let buffer_string = Buffer.from(base64_string, "base64");
    let decoded_string = buffer_string.toString("utf8");

    return decoded_string
}