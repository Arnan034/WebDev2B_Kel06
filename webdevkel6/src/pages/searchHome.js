import React from "react";

class SearchHome extends React.Component {
    render() {
        return (
            <div> 
              <div class="content">
                <div class="container h-100">
                    <div class="d-flex justify-content-center h-100 mt-2 mb-3">
                      <div class="search">
                        <input class="search_input" type="text" name="" placeholder="Search here..." />
                        <a href="/#" class="search_icon"><i class="fa fa-search"></i></a>
                      </div>
                    </div>
                    <div class="d-flex justify-content-center h-100 mt-2">
                        <p>Search / Tagging With "Naon cikk"</p>
                      </div>
                </div>

                <div class="category-container">
                    <button class="category-control-prev" onclick="prevSlide()">
                        <i class="fa-solid fa-angle-left"></i>
                    </button>
                    <div class="category-wrapper">
                        <div class="button-category">
                            <div class="category-inner">
                                <div class="category-item">
                                    <button class="category-button">Button 1</button>
                                    <button class="category-button">Button 2</button>
                                    <button class="category-button">Button 3</button>
                                    <button class="category-button">Button 4</button>
                                    <button class="category-button">Button 5</button>
                                    <button class="category-button">Button 6</button>
                                    <button class="category-button">Button 7</button>
                                    <button class="category-button">Button 8</button>
                                    <button class="category-button">Button 9</button>
                                    <button class="category-button">Button 10</button>
                                    <button class="category-button">Button 11</button>
                                    <button class="category-button">Button 12</button>
                                    <button class="category-button">Button 13</button>
                                    <button class="category-button">Button 14</button>
                                    <button class="category-button">Button 15</button>
                                    <button class="category-button">Button 16</button>
                                    <button class="category-button">Button 17</button>
                                    <button class="category-button">Button 18</button>
                                    <button class="category-button">Button 19</button>
                                    <button class="category-button">Button 20</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="category-control-next" onclick="nextSlide()">
                        <i class="fa-solid fa-angle-right"></i>
                    </button>
                </div>

                <div class="filter-search-container">
                    <label>Show: </label>
                    <select id="itemsPerPage" class="form-select" aria-label="Items per page">
                      <option selected>10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                </div>

                <div class="row">
                    <div class="col-md-12">
                      <div class="card-wrapper">
                        <a href="/#" target="_blank" class="card-link">
                          <div class="card card-search-horizontal bg-transparent">
                            <img src="./assets/img/350x233.png" class="card-search-img-left" alt="Movie" />
                            <span class="badge-search ongoing">Ongoing</span> 
                            <div class="card-search-body">
                              <h5 class="card-search-title">Movie Title Harri Potter Contohnyaa Movie Title Harri Potter</h5>
                              <p class="card-search-text">2024</p>
                              <p class="card-search-text">Action</p>
                              <p class="card-search-text">Availability: Yes</p>
                              <div class="rating-container">
                                <p class="card-search-text mb-0 rating ">★★★★☆</p>
                                <p class="card-search-text mb-0">Views 5M</p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div class="col-md-12">
                        <div class="card-wrapper">
                          <a href="/#" target="_blank" class="card-link">
                            <div class="card card-search-horizontal bg-transparent">
                              <img src="./assets/img/350x233.png" class="card-search-img-left" alt="Movie" />
                              <span class="badge-search completed">Completed</span> 
                              <div class="card-search-body">
                                <h5 class="card-search-title">Fast And Go Home</h5>
                                <p class="card-search-text">2024</p>
                                <p class="card-search-text">Action</p>
                                <p class="card-search-text">Availability: No</p>
                                <div class="rating-container">
                                  <p class="card-search-text mb-0"></p>
                                  <p class="card-search-text mb-0 rating ">4.5/5</p>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="card-wrapper">
                          <a href="/#" target="_blank" class="card-link">
                            <div class="card card-search-horizontal bg-transparent">
                              <img src="./assets/img/350x233.png" class="card-search-img-left" alt="Movie" />
                              <span class="badge-search ongoing">Ongoing</span> 
                              <div class="card-search-body">
                                <h5 class="card-search-title">Main Ke Rumah Mantan</h5>
                                <p class="card-search-text">2024</p>
                                <p class="card-search-text">Thriller</p>
                                <p class="card-search-text">Availability: No</p>
                                <div class="rating-container">
                                  <p class="card-search-text mb-0"></p>
                                  <p class="card-search-text mb-0 rating ">0.1/5</p>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                      <div class="col-md-12">
                          <div class="card-wrapper">
                            <a href="/#" target="_blank" class="card-link">
                              <div class="card card-search-horizontal bg-transparent">
                                <img src="./assets/img/350x233.png" class="card-search-img-left" alt="Movie" />
                                <span class="badge-search completed">Completed</span> 
                                <div class="card-search-body">
                                  <h5 class="card-search-title">Mampir ke rumah janda</h5>
                                  <p class="card-search-text">2024</p>
                                  <p class="card-search-text">Romance</p>
                                  <p class="card-search-text">Availability: Yes</p>
                                  <div class="rating-container">
                                    <p class="card-search-text mb-0"></p>
                                    <p class="card-search-text mb-0 rating ">1000/5</p>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                      </div>
                </div>
              </div>
            </div>
        );
    }
}

export default SearchHome;