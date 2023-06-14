/**
 * @fileoverview Provides easy encryption/decryption methods using AES 256 GCM.
 */

"use strict"

const crypto = require("browserify-cipher")
// const randomBytes = require("randombytes")
// const crypto = require("crypto-browserify")

const ALGORITHM = "aes-256-gcm"
const BLOCK_SIZE_BYTES = 12 // 96 bit

/**
 * Provides easy encryption/decryption methods using AES 256 GCM.
 */
class Aes256Gcm {
  /**
   * No need to run the constructor. The class only has static methods.
   */
  constructor() {}

  /**
   * Encrypts text with AES 256 GCM.
   * @param {string} text - Cleartext to encode.
   * @param {Buffer} secret - Shared secret key, must be 32 bytes.
   * @returns {object}
   */
  static encrypt(text, secret) {
    const iv = Buffer.from(
      CryptoJS.lib.WordArray.random(BLOCK_SIZE_BYTES).toString(
        CryptoJS.enc.Base64
      ),
      "base64"
    )

    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(secret, "utf8"),
      iv
    )

    let ciphertext = cipher.update(text, "utf8", "base64")
    ciphertext += cipher.final("base64")
    return {
      ciphertext,
      iv: iv.toString("base64"),
      tag: cipher.getAuthTag().toString("base64"),
    }
  }

  /**
   * Decrypts AES 256 CGM encrypted text.
   * @param {string} ciphertext - Base64-encoded ciphertext.
   * @param {string} iv - The base64-encoded initialization vector.
   * @param {string} tag - The base64-encoded authentication tag generated by getAuthTag().
   * @param {Buffer} secret - Shared secret key, must be 32 bytes.
   * @returns {string}
   */
  static decrypt(ciphertext, iv, tag, secret) {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(secret, "utf8"),
      Buffer.from(iv, "base64")
    )
    decipher.setAuthTag(Buffer.from(tag, "base64"))

    let cleartext = decipher.update(ciphertext, "base64", "utf8")
    cleartext += decipher.final("utf8")

    return cleartext
  }

  static foldnl(s, n) {
    s = s.replace(new RegExp("(.{" + n + "})", "g"), "$1\r\n")
    s = s.replace(/\s+$/, "")
    return s
  }
}

module.exports = Aes256Gcm
