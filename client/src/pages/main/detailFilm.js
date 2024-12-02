import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import ListAward from "../list/listAward";
import ListActor from "../list/listActor";
import Detail from "../child/detail";
import VideoTrailer from "../child/videoTrailer";
import Comment from "../child/comment";
import CommentInput from "../child/commentInput";
import { apiServicePublic, apiServiceAuth } from '../../services/api';

const DetailFilm = ({isAuthenticated, handleLogout}) => {
    const { id } = useParams();
    const [movieData, setMovieData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const user_id = sessionStorage.getItem('id_user')

    // Fetch data dari API saat komponen dimuat
    useEffect(() => {
        setLoading(true);
        const fetchMovieData = async () => {
            try {
                const response = await apiServicePublic.getFilmById(id);
                setMovieData(response.data.data); // Set data film ke state
            } catch (error) {
                console.error('Error fetching movie data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    useEffect(() => {
        const checkBookmarkStatus = async () => {
            try {
                const response = await apiServiceAuth.getUserBookmarkFilm(user_id, id);
                setIsBookmarked(response.data.data.isBookmarked);
            } catch (error) {
                console.error('Error checking bookmark status:', error);
                setIsBookmarked(false);
            }
        };
    
        // Only run if the user is authenticated
        if (isAuthenticated) {
            checkBookmarkStatus();
        } else {
            setIsBookmarked(false);
        }
    }, [user_id, id, isAuthenticated]);

    const handleBookmarkClick = async () => {
        try {
            console.log(`Sending request: isBookmarked=${isBookmarked}, userId=${user_id}, filmId=${id}`);
            if (isBookmarked) {
                await apiServiceAuth.deleteBookmark(user_id, id);
                setIsBookmarked(false);
            } else {
                await apiServiceAuth.createBookmark({userId: user_id, filmId: id});
                setIsBookmarked(true);
            }
        } catch (error) {
            console.error('Error updating bookmark:', error);
        }
    };

    const handleBackClick = () => {
        window.history.back();
    };

    if (!movieData) {
        if (loading) {
            return (
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div class="d-flex justify-content-center">
                    <h2>Film Not found</h2>
                </div>
            );
        }
    }

    return (
        <div className="mb-2">
            <Navbar
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
            />
            <div className="back-button-detail-page" onClick={handleBackClick}>
                <i className="fa fa-arrow-left"></i>
            </div>

            {isAuthenticated ? (
                <div
                    className="bookmark-button-detail-page"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark Film"}
                    onClick={handleBookmarkClick}
                >
                    <i className={isBookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                </div>
            ) : (null)}
            
            <div className="container h-100 mb-2 mt-5 pt-5">
                {/* Mengirim data film sebagai props ke komponen Detail */}
                <Detail movie={movieData} />
                <ListAward awards={movieData.awards} />
                <ListActor id={movieData.id} />
                <VideoTrailer trailer={movieData.trailer} />
                <Comment id={movieData.id} />
                {isAuthenticated ? (
                    <CommentInput filmId={id} userId={user_id}/>
                ) : (
                    <p class="text-center">Please Signin to leave a comment.</p>
                )}
                
            </div>
        </div>
    );
};

export default DetailFilm;
