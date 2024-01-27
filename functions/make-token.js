export default async function makeToken(username, password) {
    let assembled_string = `${username}:${password}`

    let buffer_string = Buffer.from(assembled_string, "utf8");
    let base64_string = buffer_string.toString("base64");

    return base64_string
}