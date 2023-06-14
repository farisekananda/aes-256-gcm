const crypto = require("crypto")

const algorithm = "aes-256-gcm"
const message = "This is a secret message"
const iv = crypto.randomBytes(12)
const sKey = crypto.randomBytes(32)

const cipher = crypto.createCipheriv(algorithm, sKey, iv)

let encryptedData = cipher.update(message, "utf-8", "base64")
encryptedData += cipher.final("base64")

const authTag = cipher.getAuthTag().toString("base64") // <- new
console.log({
  sKey: sKey.toString("base64"),
  iv: iv.toString("base64"),
  authTag,
  encryptedData,
}) // for debugging

// const decipher = crypto.createDecipheriv(algorithm, sKey, iv)
// decipher.setAuthTag(Buffer.from(authTag, "hex")) // <- new
// let decData = decipher.update(encryptedData, "hex", "utf-8")
// decData += decipher.final("utf-8")
// console.log("Decrypted message: ", decData)

const sKey2 = Buffer.from(
  "wKeHdp7zmsH5QxaHreIOvdc8SOIuUGZA4FRufGrY2Yw=",
  "base64"
)
const iv2 = Buffer.from("lq7C6slDElU1PV/G", "base64")
const decipher = crypto.createDecipheriv(algorithm, sKey2, iv2)
decipher.setAuthTag(Buffer.from("HbanE4u/yXfGMW/BcUYmSA==", "base64")) // <- new
let decData = decipher.update(
  "cjykr4jtzskE9dyVa8Ar6I8lCLE6sgis",
  "base64",
  "utf-8"
)
decData += decipher.final("utf-8")
console.log("Decrypted message: ", decData)
