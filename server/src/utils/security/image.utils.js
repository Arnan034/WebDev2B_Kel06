//server/src/utils/security/imageBuffer.utils.js
const { Buffer } = require('buffer');
const ApiResponse = require('../maintainability/response.utils');

const convertBase64ToBuffer = (base64Image) => {
    // Validate input first for security
    if (!base64Image || !base64Image.includes('base64')) {
        return ApiResponse.error(res, 'Base64 image string is required', 400);
    }

    // Add size validation to prevent memory attacks
    const estimatedSize = (base64Image.length * 3) / 4; // rough estimation
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit example

    if (estimatedSize > MAX_SIZE) {
        return ApiResponse.error(res, 'Image size exceeds maximum allowed size', 400);
    }

    const base64String = base64Image.split(',')[1] || base64Image;
    return Buffer.from(base64String, 'base64');
};

const convertBufferToBase64 = (buffer) => {
    if (!Buffer.isBuffer(buffer)) {
        return ApiResponse.error(res, 'Input must be a buffer', 400);
    }
    return buffer.toString('base64');
};

const bufferImage = (buffer) => {
    if(!buffer) {
        return ApiResponse.error(res, 'Buffer is required', 400);
    }

    return Buffer.from(buffer, 'base64');
};

module.exports = {
    convertBase64ToBuffer,
    convertBufferToBase64,
    bufferImage
};