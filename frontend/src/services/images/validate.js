import axios from 'axios';

const ValidateImage = async (imageData, token) => {
    try {
        const response = await axios.post('http://localhost:8000/api/images/validate', imageData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error validating image:', error);
        throw error;
    }
};

export default ValidateImage;
