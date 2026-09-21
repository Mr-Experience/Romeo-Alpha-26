/**
 * Compresses an image file and returns a WebP blob.
 * @param {File} file - The original image file.
 * @param {number} quality - Compression quality (0.0 to 1.0).
 * @param {number} maxWidth - Optional max width to resize high-res images.
 * @returns {Promise<File>} A promise that resolves to the compressed WebP File object.
 */
export const compressToWebp = (file, quality = 0.85, maxWidth = 1600) => {
    return new Promise((resolve) => {
        // If not an image, resolve with original file
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Calculate dimensions
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                // Draw to canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Export to WebP blob
                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve(file); // Fallback to original on failure
                        return;
                    }
                    // Generate new filename with .webp
                    let originalName = file.name;
                    const lastDot = originalName.lastIndexOf('.');
                    const nameWithoutExt = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
                    
                    const webpFile = new File([blob], `${nameWithoutExt}.webp`, {
                        type: 'image/webp',
                        lastModified: Date.now()
                    });
                    resolve(webpFile);
                }, 'image/webp', quality);
            };
            img.onerror = () => resolve(file); // Fallback to original
            img.src = event.target.result;
        };
        reader.onerror = () => resolve(file); // Fallback to original
        reader.readAsDataURL(file);
    });
};
