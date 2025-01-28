import React, {createContext, useContext, useState} from 'react';

// Create the context
export const VideoPlayerContext = createContext({
    currentlyPlaying: null,
    setCurrentlyPlaying: () => {},
});

// Create the provider component
export const VideoPlayerProvider = ({ children }) => {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    return (
        <VideoPlayerContext.Provider value={{ currentlyPlaying, setCurrentlyPlaying }}>
            {children}
        </VideoPlayerContext.Provider>
    );
};

export const useVideoPlayer = () => {
    const context = useContext(VideoPlayerContext);
    if (!context) {
        throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
    }
    return context;
};
