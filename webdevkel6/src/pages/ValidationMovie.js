import React from "react";
// import 

class ValidationMovie extends React.Component {
    render() {
        return (
            <div>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ModalCenter">
                    Launch demo modal
                </button>

                <div class="modal fade" id="ModalCenter" tabindex="-1" aria-labelledby="ModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="title-web mt-1">
                                    <h2 class="title orange-peel-color">DramaKu</h2>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="container h-100 mb-2">
                                <div class="film-detail-container">
                                    <img src="https://m.media-amazon.com/images/I/714xn6rxXSL.jpg" alt="Film" class="film-image" />
                                    <div class="film-info">
                                        <h1>Ini untuk judul film yang menarikkk</h1>
                                        <div class="genre-list">
                                            <span class="genre-item">Action</span>
                                            <span class="genre-item">Adventure</span>
                                            <span class="genre-item">Drama</span>
                                        </div>
                                        <h2>Other Title</h2>                
                                        <p><strong>Year:</strong> 2024</p>
                                        <p class="my-2">This is a brief synopsis of the film. This is a brief synopsis of the film.</p>
                                        <p><strong>Award:</strong> TOP TIP TAP TOP</p>
                                        <p><strong>Rate:</strong> 4.5/5</p>
                                        <p><strong>Availability:</strong> Yes</p>
                                    </div>
                                </div>
                                <div class="actor-list-container">
                                    <button class="prev-btn-actor" onclick="scrollActors(-1)">
                                        <i class="fa-solid fa-chevron-left"></i>
                                    </button>
                                    <div class="actor-list" id="actorList">
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 1" />
                                            <p>Actor 1</p>
                                        </div>
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 2" />
                                            <p>Actor 2</p>
                                        </div>
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 3" />
                                            <p>Actor 3</p>
                                        </div>
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 4" />
                                            <p>Actor 4</p>
                                        </div>
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 5" />
                                            <p>Actor 5</p>
                                        </div>
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 6" />
                                            <p>Actor 6</p>
                                        </div>
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 7" />
                                            <p>Actor 7</p>
                                        </div>
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 8" />
                                            <p>Actor 8</p>
                                        </div>
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 9" />
                                            <p>Actor 9</p>
                                        </div>
                                        <div class="actor-item">
                                            <img src="https://via.placeholder.com/120x160" alt="Actor 10" />
                                            <p>Actor 10</p>
                                        </div>
                                    </div>
                                    <button class="next-btn-actor" onclick="scrollActors(1)">
                                        <i class="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                                <div class="video-wrapper">
                                    <div class="video-container">
                                    <iframe src="https://www.youtube.com/embed/LEjhY15eCx0?si=c859K1ikq98BkDOG" 
                                        title="YouTube video player" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen >
                                    </iframe>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger">Delete</button>
                                    <button type="button" class="btn btn-secondary">Approve</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ValidationMovie;