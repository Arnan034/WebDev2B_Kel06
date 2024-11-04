import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./content/navbar";
import Detail from "./content/detail";
import ListAward from "./content/listAward";
import ListActor from "./content/listActor";
import VideoTrailer from "./content/videoTrailer";
import Comment from "./content/comment";
import CommentInput from "./content/commentInput";
import axios from "axios";

const DetailFilm = ({isAuthenticated, handleLogout}) => {
    const { id } = useParams();
    const [movieData, setMovieData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const user_id = sessionStorage.getItem('id_user')

    // Fetch data dari API saat komponen dimuat
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/film/get/${id}`);
                setMovieData(response.data); // Set data film ke state
                setLoading(false); // Set loading menjadi false setelah data diambil
            } catch (error) {
                console.error('Error fetching movie data:', error);
                setLoading(false); // Set loading menjadi false meskipun ada error
            }
        };

        fetchMovieData();
    }, [id]);

    useEffect(() => {
        const checkBookmarkStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/bookmark/get/${user_id}/${id}`);
                setIsBookmarked(response.data.isBookmarked);
            } catch (error) {
                console.error('Error checking bookmark status:', error);
                setIsBookmarked(false);
            }
        };
    
        // Only run if the user is authenticated
        if (isAuthenticated) {
            checkBookmarkStatus();
        } else {
            // Optionally, reset the bookmark state if not authenticated
            setIsBookmarked(false);
        }
    }, [user_id, id, isAuthenticated]);

    const handleBookmarkClick = async () => {
        try {
            console.log(`Sending request: isBookmarked=${isBookmarked}, userId=${user_id}, filmId=${id}`);
            if (isBookmarked) {
                await axios.delete(`http://localhost:5000/api/bookmark/del/${user_id}/${id}`);
                console.log('Bookmark removed');
            } else {
                await axios.post('http://localhost:5000/api/bookmark/post/', {
                    userId: user_id,
                    filmId: id
                });
                console.log('Bookmark added');
            }
            
            setIsBookmarked(prevState => !prevState);
        } catch (error) {
            console.error('Error updating bookmark:', error);
        }
    };

    const handleBackClick = () => {
        window.history.back();
    };

    if (loading) {
        return <div>Loading...</div>; // Menampilkan loading jika data belum selesai diambil
    }

    if (!movieData) {
        return <div>Movie not found</div>; // Menampilkan pesan jika film tidak ditemukan
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
