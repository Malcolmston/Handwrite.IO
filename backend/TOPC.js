// totp.js - Add this file to your project

const crypto = require('crypto');
const QRCode = require('qrcode');

// TOTP Class for 2-factor authentication
class TOTP {
  constructor(secret = null) {
    this.secret = secret || this.generateSecret();
  }

  generateSecret(length = 20) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 characters
    let result = '';
    const randomValues = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomValues[i] % chars.length);
    }

    return result;
  }

  base32ToBytes(base32) {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';

    for (let i = 0; i < base32.length; i++) {
      const val = base32Chars.indexOf(base32.charAt(i).toUpperCase());
      if (val === -1) continue; // Skip non-base32 chars
      bits += val.toString(2).padStart(5, '0');
    }

    // Convert bits to bytes
    const bytes = Buffer.alloc(Math.floor(bits.length / 8));
    for (let i = 0; i < bytes.length; i++) {
      const byteStr = bits.substr(i * 8, 8);
      bytes[i] = parseInt(byteStr, 2);
    }

    return bytes;
  }

  hmacSha1(key, message) {
    const keyBytes = this.base32ToBytes(key);
    return crypto.createHmac('sha1', keyBytes).update(message).digest();
  }

  getCurrentCounter() {
    return Math.floor(Date.now() / 1000 / 30);
  }

  generateTOTP(counter = null) {
    if (counter === null) {
      counter = this.getCurrentCounter();
    }

    // Convert counter to 8-byte buffer
    const buffer = Buffer.alloc(8);
    for (let i = 0; i < 8; i++) {
      buffer[7 - i] = counter & 0xff;
      counter = counter >> 8;
    }

    // Calculate HMAC-SHA1
    const hmacResult = this.hmacSha1(this.secret, buffer);

    // Dynamic truncation
    const offset = hmacResult[hmacResult.length - 1] & 0xf;

    // Extract 4 bytes from the HMAC result starting at offset
    let code = ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff);

    // Generate 6-digit code (code % 10^6)
    code = code % 1000000;

    // Pad with leading zeros if needed
    return code.toString().padStart(6, '0');
  }

  getRemainingSeconds() {
    return 30 - (Math.floor(Date.now() / 1000) % 30);
  }

  getOTPAuthURL(accountName, issuer = 'YourApp') {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedAccount = encodeURIComponent(accountName);
    const encodedSecret = encodeURIComponent(this.secret);

    return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${encodedSecret}&issuer=${encodedIssuer}`;
  }

  getManualSetupKey() {
    // Format secret in groups of 4 for easier manual entry
    let formattedSecret = '';
    for (let i = 0; i < this.secret.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedSecret += ' ';
      }
      formattedSecret += this.secret[i];
    }
    return formattedSecret;
  }

  verifyTOTP(userCode, windowSize = 1) {
    const currentCounter = this.getCurrentCounter();

    // Check codes within the window (default is current period and one period before/after)
    for (let i = -windowSize; i <= windowSize; i++) {
      const counter = currentCounter + i;
      const generatedCode = this.generateTOTP(counter);

      if (userCode === generatedCode) {
        return true;
      }
    }

    return false;
  }
}

module.exports = TOTP;
