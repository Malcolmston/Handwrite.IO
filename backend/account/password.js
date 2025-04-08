const bcrypt = require('bcrypt');
const crypto = require('crypto');

require('dotenv').config();


const SALT = process.env.SALT;

function hashPassword(password) {
  return bcrypt.hashSync(password, SALT);
}

function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// Helper function to validate image signature
function verifyImageSignature(buffer) {
  if (buffer.length < 8) return false;

  // Check for common image signatures
  // JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true;
  }
  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E &&
    buffer[3] === 0x47 && buffer[4] === 0x0D && buffer[5] === 0x0A &&
    buffer[6] === 0x1A && buffer[7] === 0x0A) {
    return true;
  }
  // GIF
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 &&
    buffer[3] === 0x38 && (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61) {
    return true;
  }

  return false;
}



// generate a random password with crypto
function generatePassword() {
    return crypto.randomBytes(6).toString('hex'); // 6 bytes = 12 hex characters
}


module.exports = { hashPassword, comparePassword, generatePassword, verifyImageSignature};
