import React from "react";
import Detail from "../pages1/content/detail";
import ListActor from "../pages1/content/listActor";
import VideoTrailer from "../pages1/content/videoTrailer";

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
                                <Detail />
                                <ListActor />
                                <VideoTrailer />    
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