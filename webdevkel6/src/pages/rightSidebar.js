import React from "react";

class RightSidebar extends React.Component {
    render() {
        return (
            <div>
                <div class="sidebar-right bg-selective-yellow-color" id="sidebar-right">
                    <div class="container-fluid">
                        <h2 class="black-color">Sort</h2>
                        <div class="row mb-3">
                            <div class="col">
                                <button id="sortAsc" class="btn btn-primary w-100">ASC</button>
                            </div>
                            <div class="col">
                                <button id="sortDesc" class="btn btn-primary w-100">DESC</button>
                            </div>
                        </div>
                        
                        <h2 class="black-color">Filter</h2>
                        <div class="mb-3">
                            <label class="form-label jet-color">Tahun</label>
                            <div class="row mb-2">
                                <div class="col ">
                                    <button class="btn btn-primary w-100">2024</button>
                                </div>
                                <div class="col">
                                    <button class="btn btn-primary w-100">2023</button>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6">
                                    <button class="btn btn-primary w-100">2022</button>
                                </div>
                                <div class="col-6">
                                    <select class="form-select" id="yearDropdown">
                                        <option selected>Lainnya</option>
                                        <option>2021</option>
                                        <option>2020</option>
                                        <option>2019</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label jet-color">Status</label>
                            <div class="row mb-2">
                                <div class="col-6">
                                    <button class="btn btn-primary w-100">On Going</button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-primary w-100">Completed</button>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label jet-color">Availability</label>
                            <div class="row mb-2">
                                <div class="col-6">
                                    <button class="btn btn-primary w-100">Yes</button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-primary w-100">No</button>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label jet-color">Award</label>
                            <div class="row mb-2">
                                <div class="col-6">
                                    <button class="btn btn-primary w-100">Award 1</button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-primary w-100">Award 2</button>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6">
                                    <button class="btn btn-primary w-100">Award 3</button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-primary w-100">Award 4</button>
                                </div>
                            </div>
                            <div class="text-center" id="moreAwardsWrapper">
                                <button class="btn btn-outline-secondary w-100" id="showMoreAwards">More Awards</button>
                            </div>
                            <div id="moreAwards" class="d-none">
                                <div class="row mb-2">
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 5</button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 6</button>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 5</button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 6</button>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 5</button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 6</button>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 5</button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 6</button>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 5</button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-primary w-100">Award 6</button>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col">
                                        <input class="form-control w-200" placeholder="Input Award here"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <div class="row mt-2">
                                <div class="col-6">
                                <button type="reset" class="btn btn-danger w-100">Reset</button>
                                </div>
                                <div class="col-6">
                                    <button type="submit" class="btn btn-secondary w-100">Terapkan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="toggle-btn bg-selective-yellow-color" id="toggleSidebar">
                    <i class="fa-solid fa-filter"></i>
                </div>
            </div>
        );
    }
}

export default RightSidebar;