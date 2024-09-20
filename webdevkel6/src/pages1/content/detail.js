import React from "react";

class Detail extends React.Component {
    render() {
        return (
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
                    <p class="my-2">melanjutkan kehidupan karakter Riley Andersen yang sudah memasuki masa remaja dengan kemunculan emosi baru dalam dirinya. Sekuel Inside Out ini menampilkan karakter emosi baru yang terdiri atas Embarrassment, Anxiety, Envy, dan Ennui. Ragam emosi yang kompleks tersebut mempengaruhi kehidupan Riley.</p>
                    {/* <p><strong>Award:</strong> TOP TIP TAP TOP</p> */}
                    <p><strong>Rate:</strong> <span class="rating">★★★★☆</span></p>
                    <p><strong>Availability:</strong> Netflix</p>
                </div>
            </div>
        );
    }
}

export default Detail;