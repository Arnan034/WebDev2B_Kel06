import React from "react";

class VideoTrailer extends React.Component {
    render() {
        return (
            <div class="video-wrapper">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/LEjhY15eCx0?si=c859K1ikq98BkDOG" 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen >
                    </iframe>
                </div>
            </div>
        );
    }
}

export default VideoTrailer;