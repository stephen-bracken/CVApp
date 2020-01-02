const crypto = require('crypto'),
    resizedIV = Buffer.allocUnsafe(16),
    iv = crypto
      .createHash("sha256")
      .update("myHashedIV")
      .digest();

iv.copy(resizedIV);

function encrypt(k,str) {
    const key = crypto
        .createHash("sha256")
        .update(k)
        .digest(),
        cipher = crypto.createCipheriv("aes256", key, resizedIV),
        msg = [];

        msg.push(cipher.update(str, "binary", "hex"));

    msg.push(cipher.final("hex"));
    return msg.join("");

} 
function decrypt(k,str) {
    const key = crypto
        .createHash("sha256")
        .update(k)
        .digest(),
        decipher = crypto.createDecipheriv("aes256", key, resizedIV),
        msg = [];

        msg.push(decipher.update(str, "hex", "binary"));

    msg.push(decipher.final("binary"));
    return msg.join("");
}

module.exports = {encrypt,decrypt}