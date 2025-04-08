function base64URLEncode(buffer) {
  // Ensure consistent encoding across browsers
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64URLDecode(str) {
  // Standardize decoding
  str = str.replace(/-/g, '+').replace(/_/g, '/');

  // Pad the string
  while (str.length % 4) {
    str += '=';
  }

  // Use standard base64 decoding
  return Uint8Array.from(atob(str), c => c.charCodeAt(0)).buffer;
}

function arrayBufferToBase64(buffer) {
  // Consistent base64URL encoding for ArrayBuffer
  const uint8Array = new Uint8Array(buffer);
  return btoa(String.fromCharCode.apply(null, uint8Array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// For use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { base64URLEncode, base64URLDecode,arrayBufferToBase64};
}
