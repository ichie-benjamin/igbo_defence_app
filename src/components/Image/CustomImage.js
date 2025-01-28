import React, { useState } from 'react';
import { Image } from 'react-native';
import {images} from "../../constants";

const CustomImage = ({ source, style }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <Image
            source={imageError ? images.NOTFOUND : source}
            style={style}
            defaultSource={images.NOTFOUND}
            onError={handleImageError}
        />
    );
};

export default CustomImage;
