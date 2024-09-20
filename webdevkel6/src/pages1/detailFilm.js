import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./content/navbar";
import Detail from "./content/detail";
import ListActor from "./content/listActor";
import VideoTrailer from "./content/videoTrailer";
import Comment from "./content/comment";
import CommentInput from "./content/commentInput";

const DetailFilm = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        window.history.back(); // Kembali ke halaman sebelumnya
    };

    const handleSearch = (query) => {
        navigate(`/search?query=${query}`); // Alihkan ke halaman search
    };

    return (
        <div>
            <Navbar onSearch={handleSearch} />
            <div className="back-button-detail-page" onClick={handleBackClick}>
                <i className="fa fa-arrow-left"></i>
            </div>
            
            <div className="container h-100 mb-2 mt-5 pt-5">
                <Detail />
                <ListActor />
                <VideoTrailer />
                <Comment />
                <CommentInput />
            </div>
        </div>
    );
};

export default DetailFilm;
