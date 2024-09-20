import React from "react";

class Comment extends React.Component {
    render() {
        const reviews = [
            {
                name: "Nara",
                date: "(4/4/2014)",
                content: "It is a wonderful drama! I love it so much!!!! I need long comments to see how it is being seen in the display.",
                stars: 5,
            },
            {
                name: "Nara",
                date: "(4/4/2014)",
                content: "It is a wonderful drama! I love it so much!!!!",
                stars: 5,
            },
            {
                name: "Nara",
                date: "(4/4/2014)",
                content: "It is a wonderful drama! I love it so much!!!!",
                stars: 4,
            },
            {
                name: "Nara",
                date: "(4/4/2014)",
                content: "It is a wonderful drama! I love it so much!!!!",
                stars: 3,
            },
        ];

        return (
            <div className="container review-container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3 review-header">
                    <h4>({reviews.length}) People think about this drama</h4>
                    <div className="filter">
                        Filtered by: 
                        <div className="custom-select">
                            <select>
                                <option value="5">★★★★★</option>
                                <option value="4">★★★★☆</option>
                                <option value="3">★★★☆☆</option>
                                <option value="2">★★☆☆☆</option>
                                <option value="1">★☆☆☆☆</option>
                            </select>
                        </div>
                    </div>
                </div>

                {reviews.map((review, index) => (
                    <div className="review-item" key={index}>
                        <div className="review-image"></div>
                        <div className="review-content">
                            <p>
                                <span className="review-name">{review.name}</span> 
                                <span className="review-date">{review.date}</span> 
                                said: {review.content}
                            </p>
                        </div>
                        <div className="review-stars">
                            {[...Array(review.stars)].map((_, starIndex) => (
                                <i className="fas fa-star" key={starIndex}></i>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default Comment;
