import imageHandeling from './imageStore.services';
import responseHandler from '../utils/responseHandler';

// POSTS //
exports.uploadImage = async (req, res) => {
    const { uid, movieId, text, postTitle, img } = req.body;
    try {
        const imageUrl = await imageHandeling.uploadoadImage(file,folderPath);
        if (imageUrl)
            responseHandler(res, 201, 'Image saved successfully', imageUrl);
        else 
            res.status(400).json({ message: 'Error saving image' });
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};