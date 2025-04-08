exports.base64ToBlob = function(dataURL) {
  // Check for the data:image prefix in the dataURL
  const matches = dataURL.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 data URL format');
  }

  // Separate the content type and the base64 data
  const contentType = matches[1];
  const base64Data = matches[2];

  return base64Data;
};

