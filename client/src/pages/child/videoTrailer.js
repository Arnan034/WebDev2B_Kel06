import React from "react";

const VideoTrailer = ({ trailer }) => {
    return (
        <div className="video-wrapper mb-3">
            <div className="video-container">
                <iframe 
                    src={trailer} // Correctly use curly braces for the trailer prop
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen // Corrected to use camelCase
                >
                </iframe>
            </div>
        </div>
    );
}

export default VideoTrailer;
