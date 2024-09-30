import React from "react";

class ContentHome extends React.Component {
    render() {
        return (
            <div className="content">
                <div className="container h-100">
                    <div className="d-flex justify-content-center h-100 mt-2 mb-3">
                    <div className="search">
                        <input className="search_input" type="text" placeholder="Search here..." />
                        <a href="/#" className="search_icon"><i className="fa fa-search"></i></a>
                    </div>
                    </div>
                </div>

                <div className="category-container">
                    <button className="category-control-prev" onclick="prevSlide()">
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <div className="category-wrapper">
                        <div className="button-category">
                            <div className="category-inner">
                                <div className="category-item">
                                    <button className="category-button">Button 1</button>
                                    <button className="category-button">Button 2</button>
                                    <button className="category-button">Button 3</button>
                                    <button className="category-button">Button 4</button>
                                    <button className="category-button">Button 5</button>
                                    <button className="category-button">Button 6</button>
                                    <button className="category-button">Button 7</button>
                                    <button className="category-button">Button 8</button>
                                    <button className="category-button">Button 9</button>
                                    <button className="category-button">Button 10</button>
                                    <button className="category-button">Button 11</button>
                                    <button className="category-button">Button 12</button>
                                    <button className="category-button">Button 13</button>
                                    <button className="category-button">Button 14</button>
                                    <button className="category-button">Button 15</button>
                                    <button className="category-button">Button 16</button>
                                    <button className="category-button">Button 17</button>
                                    <button className="category-button">Button 18</button>
                                    <button className="category-button">Button 19</button>
                                    <button className="category-button">Button 20</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="category-control-next" onclick="nextSlide()">
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>

                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                        <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                        <span className="badge ongoing">On Going</span>
                        <div className="card-body">
                            <h5 className="card-title">Movie Title 1</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Action</p>
                            <div className="rating-container">
                            <p className="card-text mb-0 rating">★★★★☆</p>
                            <p className="card-text mb-0">views 2K</p>
                            </div>
                        </div>
                        </div>
                    </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                        <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                        <span className="badge completed">Completed</span>
                        <div className="card-body">
                            <h5 className="card-title">Movie Title 2</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Comedy</p>
                            <div className="rating-container">
                            <p className="card-text mb-0 rating">★★★☆☆</p>
                            <p className="card-text mb-0">views 1M</p>
                            </div>
                        </div>
                        </div>
                    </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <a href="/#" target="blank">
                        <div className="card bg-transparent">
                        <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                        <span className="badge ongoing">On Going</span>
                        <div className="card-body">
                            <h5 className="card-title">Movie Title 3</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Drama</p>
                            <div className="rating-container">
                            <p className="card-text mb-0"></p>
                            <p className="card-text mb-0 rating">4.7/5</p>
                            </div>
                        </div>
                        </div>
                    </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                        <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                        <span className="badge completed">Completed</span> 
                        <div className="card-body">
                            <h5 className="card-title">Movie Title 4</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Thriller</p>
                            <div className="rating-container">
                            <p className="card-text mb-0"></p>
                            <p className="card-text mb-0 rating">4.2/5</p>
                            </div>
                        </div>
                        </div>
                    </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                        <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                        <span className="badge ongoing">On Going</span> 
                        <div className="card-body">
                            <h5 className="card-title">Movie Title 5</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Sci-Fi</p>
                            <div className="rating-container">
                            <p className="card-text mb-0"></p>
                            <p className="card-text mb-0 rating">4.3/5</p>
                            </div>
                        </div>
                        </div>
                    </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                        <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                        <span className="badge completed">Completed</span> 
                        <div className="card-body">
                            <h5 className="card-title">Movie Title 6</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Horror</p>
                            <div className="rating-container">
                            <p className="card-text mb-0"></p>
                            <p className="card-text mb-0 rating">4.1/5</p>
                            </div>
                        </div>
                        </div>
                    </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                        <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                        <span className="badge ongoing">On Going</span> 
                        <div className="card-body">
                            <h5 className="card-title">Movie Title 7</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Romance</p>
                            <div className="rating-container">
                            <p className="card-text mb-0"></p>
                            <p className="card-text mb-0 rating">4.4/5</p>
                            </div>
                        </div>
                        </div>
                    </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                        <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                        <span className="badge completed">Completed</span> 
                        <div className="card-body">
                            <h5 className="card-title">Movie Title 8</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Adventure</p>
                            <div className="rating-container">
                            <p className="card-text mb-0"></p>
                            <p className="card-text mb-0 rating">4.8/5</p>
                            </div>
                        </div>
                        </div>
                    </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                            <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                            <span className="badge completed">Completed</span> 
                            <div className="card-body">
                            <h5 className="card-title">Movie Title 9</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Adventure</p>
                            <div className="rating-container">
                                <p className="card-text mb-0"></p>
                                <p className="card-text mb-0 rating">4/5</p>
                            </div>
                            </div>
                        </div>
                        </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                            <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                            <span className="badge completed">Completed</span> 
                            <div className="card-body">
                            <h5 className="card-title">Movie Title </h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Adventure</p>
                            <div className="rating-container">
                                <p className="card-text mb-0"></p>
                                <p className="card-text mb-0 rating">4.8/5</p>
                            </div>
                            </div>
                        </div>
                        </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                            <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                            <span className="badge completed">Completed</span> 
                            <div className="card-body">
                            <h5 className="card-title">Movie Title 8</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Adventure</p>
                            <div className="rating-container">
                                <p className="card-text mb-0"></p>
                                <p className="card-text mb-0 rating">4.8/5</p>
                            </div>
                            </div>
                        </div>
                        </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <a href="/#" target="_blank">
                        <div className="card bg-transparent">
                            <img src="./assets/img/350x233.png" className="card-img-top" alt="Movie Img"/>
                            <span className="badge completed">Completed</span> 
                            <div className="card-body">
                            <h5 className="card-title">Movie Title 8</h5>
                            <p className="card-text">2024</p>
                            <p className="card-text">Adventure</p>
                            <div className="rating-container">
                                <p className="card-text mb-0"></p>
                                <p className="card-text mb-0 rating">4.8/5</p>
                            </div>
                            </div>
                        </div>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContentHome;