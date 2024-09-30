import React from "react";

class FilmDetail extends React.Component {
    render() {
        return (
            <div>
                <div class="title-web">
                    <div class="container-fluid">
                        <h2 class="name-web">
                            <a href="/#" class="title orange-peel-color">DramaKu</a>    
                        </h2>
                    </div>
                </div>
                
                <div class="back-button-detail-page">
                    <a href="/#"><i class="fa fa-arrow-left"></i></a>
                </div>

                <div class="container h-100 mb-2">
                    <div class="d-flex justify-content-center h-100 mt-3 mb-3">
                        <div class="search">
                            <input class="search_input" type="text" name="" placeholder="Search here..." />
                            <a href="/#" class="search_icon"><i class="fa fa-search"></i></a>
                        </div>
                    </div>
                    <div class="film-detail-container">
                        <img src="https://m.media-amazon.com/images/I/714xn6rxXSL.jpg" alt="Film img" class="film-image" />
                        <div class="film-info">
                            <h1>Inside Out 2</h1>
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
                    <div class="container review-container mt-5">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4>(4) People think about this drama</h4>
                            <div class="filter">
                                Filtered by: 
                                <select>
                                    <option value="5">★★★★★</option>
                                    <option value="4">★★★★☆</option>
                                    <option value="3">★★★☆☆</option>
                                    <option value="2">★★☆☆☆</option>
                                    <option value="1">★☆☆☆☆</option>
                                </select>
                            </div>
                        </div>
                    
                        <div class="review-item">
                            <div class="review-image"></div>
                            <div class="review-content">
                                <p>
                                    <span class="review-name">Nara</span> 
                                    <span class="review-date">(4/4/2014)</span> 
                                    said: It is a wonderful drama! I love it so much!!!! I need long comments to see how it is being seen in the display.
                                    It is a wonderful drama! I love it so much!!!! I need long comments to see how it is being seen in the display.It is a wonderful drama! I love it so much!!!! I need long comments to see how it is being seen in the display.
                                </p>
                            </div>
                            <div class="review-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    
                        <div class="review-item">
                            <div class="review-image"></div>
                            <div class="review-content">
                                <p><span class="review-name">Nara</span> 
                                    <span class="review-date">(4/4/2014)</span> 
                                    said: It is a wonderful drama! I love it so much!!!!
                                </p>
                            </div>
                            <div class="review-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    
                        <div class="review-item">
                            <div class="review-image"></div>
                            <div class="review-content">
                                <p><span class="review-name">Nara</span> 
                                    <span class="review-date">(4/4/2014)</span> 
                                    said: It is a wonderful drama! I love it so much!!!!
                                </p>
                            </div>
                            <div class="review-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    
                        <div class="review-item">
                            <div class="review-image"></div>
                            <div class="review-content">
                                <p><span class="review-name">Nara</span> 
                                    <span class="review-date">(4/4/2014)</span> 
                                    said: It is a wonderful drama! I love it so much!!!!
                                </p>
                            </div>
                            <div class="review-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <div class="comment-form-container">
                        <h2>Add Yours !</h2>
                        <form id="review-form" action="#" method="post">
                            <div class="comment-form-group">
                                <label for="name">Nama:</label>
                                <input type="text" id="name" name="name" required />
                            </div>
                            <div class="comment-stars-container">
                                <label for="rate">Rating:</label>
                                <div class="comment-stars">
                                    <input type="radio" id="star5" name="rate" value="5" />
                                    <label for="star5" title="5 stars"></label>
                                    <input type="radio" id="star4" name="rate" value="4" />
                                    <label for="star4" title="4 stars"></label>
                                    <input type="radio" id="star3" name="rate" value="3" />
                                    <label for="star3" title="3 stars"></label>
                                    <input type="radio" id="star2" name="rate" value="2" />
                                    <label for="star2" title="2 stars"></label>
                                    <input type="radio" id="star1" name="rate" value="1" />
                                    <label for="star1" title="1 star"></label>
                                </div>
                            </div>
                            <div class="comment-form-group">
                                <label for="review">Ulasan:</label>
                                <textarea id="review" name="review" rows="4" required></textarea>
                            </div>
                            <div class="comment-form-buttons">
                                <button type="reset" class="btn btn-danger">Reset</button>
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default FilmDetail;