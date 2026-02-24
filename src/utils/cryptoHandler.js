import CryptoJS from 'crypto-js';

/**
 * Generates a SHA256 hash for a given file.
 * @param {File} file - The file object to hash.
 * @returns {Promise<string>} - The SHA256 hash string.
 */
export const generateFileHash = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const binary = e.target.result;
                const wordArray = CryptoJS.lib.WordArray.create(binary);
                const hash = CryptoJS.SHA256(wordArray).toString();
                resolve(hash);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
