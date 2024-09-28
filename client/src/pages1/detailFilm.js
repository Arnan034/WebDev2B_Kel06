import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./content/navbar";
import Detail from "./content/detail";
import ListAward from "./content/listAward";
import ListActor from "./content/listActor";
import VideoTrailer from "./content/videoTrailer";
import Comment from "./content/comment";
import CommentInput from "./content/commentInput";
import axios from "axios";

const DetailFilm = ({isAuthenticated}) => {
    const { id } = useParams(); // Mengambil id dari URL
    const navigate = useNavigate();
    const [movieData, setMovieData] = useState(null); // State untuk menyimpan data film
    const [loading, setLoading] = useState(true); // State untuk status loading

    // Fetch data dari API saat komponen dimuat
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/movie/${id}`);
                setMovieData(response.data); // Set data film ke state
                setLoading(false); // Set loading menjadi false setelah data diambil
            } catch (error) {
                console.error('Error fetching movie data:', error);
                setLoading(false); // Set loading menjadi false meskipun ada error
            }
        };

        fetchMovieData();
    }, [id]);

    const handleBackClick = () => {
        window.history.back(); // Kembali ke halaman sebelumnya
    };

    const handleSearch = (query) => {
        navigate(`/search?query=${query}`); // Alihkan ke halaman search
    };

    if (loading) {
        return <div>Loading...</div>; // Menampilkan loading jika data belum selesai diambil
    }

    if (!movieData) {
        return <div>Movie not found</div>; // Menampilkan pesan jika film tidak ditemukan
    }

    return (
        <div>
            <Navbar onSearch={handleSearch} />
            <div className="back-button-detail-page" onClick={handleBackClick}>
                <i className="fa fa-arrow-left"></i>
            </div>

            <div className="container h-100 mb-2 mt-5 pt-5">
                {/* Mengirim data film sebagai props ke komponen Detail */}
                <Detail movie={movieData} />
                <ListAward awards={movieData.awards} />
                <ListActor id={movieData.id} />
                <VideoTrailer trailer={movieData.trailer} />
                <Comment id={movieData.id} />
                {isAuthenticated ? (
                    <CommentInput movieId={id} />
                ) : (
                    <p class="text-center">Please Signin to leave a comment.</p>
                )}
                
            </div>
        </div>
    );
};

export default DetailFilm;
