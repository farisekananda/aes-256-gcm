const buffer = require("buffer")
const crypto = require("crypto")
const CryptoJS = require("crypto-js")

// Demo implementation of using `aes-256-gcm` with node.js's `crypto` lib.
const aes256gcm = (key) => {
  const ALGO = "aes-256-gcm"

  // encrypt returns base64-encoded ciphertext
  const encrypt = (str) => {
    // The `iv` for a given key must be globally unique to prevent
    // against forgery attacks. `randomBytes` is convenient for
    // demonstration but a poor way to achieve this in practice.
    //
    // See: e.g. https://csrc.nist.gov/publications/detail/sp/800-38d/final
    // const iv = new Buffer(crypto.randomBytes(12), "utf8")
    const iv = Buffer.from(
      CryptoJS.lib.WordArray.random(12).toString(CryptoJS.enc.Base64),
      "base64"
    )
    const cipher = crypto.createCipheriv(ALGO, key, iv)

    // Hint: Larger inputs (it's GCM, after all!) should use the stream API
    let enc = cipher.update(str, "utf-8", "base64")
    enc += cipher.final("base64")
    return [enc, iv, cipher.getAuthTag()]
  }

  // decrypt decodes base64-encoded ciphertext into a utf8-encoded string
  const decrypt = (enc, iv, authTag) => {
    const decipher = crypto.createDecipheriv(ALGO, key, iv)
    decipher.setAuthTag(authTag)
    let str = decipher.update(enc, "base64", "utf-8")
    str += decipher.final("utf-8")
    return str
  }

  return {
    encrypt,
    decrypt,
  }
}

// const KEY = new Buffer(crypto.randomBytes(32), "utf8")
// console.log("key: ", KEY.toString("base64"))

// const aesCipher = aes256gcm(KEY)

// const [encrypted, iv, authTag] = aesCipher.encrypt(`\"Hello World\"`)
// console.log(`enc (${typeof encrypted}): ${encrypted}`)
// console.log(`iv (${typeof iv}): ${iv.toString("base64")}`)
// console.log(`tag (${typeof authTag}): ${authTag.toString("base64")}`)
// const decrypted = aesCipher.decrypt(encrypted, iv, authTag)

// console.log(decrypted) // 'hello, world'

const aesCipher2 = aes256gcm(
  Buffer.from("qpVsN8ti4ZdpNU/3RHqA67Uc8iDP7g+Ul5s4zct8b9A=", "base64")
)
const encData = "3WTCqwyeNMOpiPoNbQ=="
const ivData = Buffer.from("vPrEkam2CYeqU5/f", "base64")
const tagData = Buffer.from("nMf6mxFWZytAliO1+GmU/w==", "base64")
const data = aesCipher2.decrypt(encData, ivData, tagData)
console.log(data)

// const aes = aes256gcm(Buffer.from("afcaccaebd321b1d6de7e50cb0dd27d3", "utf8"))
// const encData = Buffer.from("05938f501d6ef0773a933fe761", "hex")
// const ivData = Buffer.from("6cbd4bc8964b7d62b720a3e3", "hex")
// const tagData = Buffer.from("56b24ef5de2deadf00ed2c50ca5ab0d4", "hex")
// const data = aes.decrypt(encData.toString("hex"), ivData, tagData)
// console.log(data)
