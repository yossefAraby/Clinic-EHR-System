let cloudName = '';
let uploadPreset = '';

export async function initCloudinary() {
    cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
    uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
    
    if (!cloudName || !uploadPreset) {
        console.warn('Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env');
    }
}

export function getCloudName() {
    return cloudName;
}

export async function uploadImage(file, onProgress = null) {
    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary not configured');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Upload failed');
    }
    
    return response.json();
}

export function getImageUrl(publicId, options = {}) {
    if (!cloudName) return '';
    
    const transforms = [];
    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.quality) transforms.push(`q_${options.quality}`);
    if (options.format) transforms.push(`f_${options.format}`);
    else transforms.push('f_auto');
    
    transforms.push('c_limit');
    
    const transformStr = transforms.length > 1 ? transforms.join(',') + '/' : '';
    
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}${publicId}`;
}