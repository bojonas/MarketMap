export default function resizeImage(base64, maxWidth, maxHeight, outputFormat = 'image/jpeg', quality = 0.8) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            // Maintain aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height = height * (maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = width * (maxHeight / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw the resized image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas to base64 string
            const resizedBase64 = canvas.toDataURL(outputFormat, quality);
            resolve(resizedBase64);
        };

        img.onerror = (error) => reject(error);

        img.src = base64;
    });
}