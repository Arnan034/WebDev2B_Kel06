import React from "react";

class CommentInput extends React.Component {
    render() {
        return (
            <div class="comment-form-container">
                <h2>Add Yours !</h2>
                <form id="review-form" action="#" method="post">
                    {/* <div class="comment-form-group">
                        <label for="name">Nama:</label>
                        <input type="text" id="name" name="name" required />
                    </div> */}
                    <div class="comment-stars-container">
                        <label for="rate">Rating:</label>
                        <div class="comment-stars">
                            <input type="radio" id="star5" name="rate" value="5" />
                            <label for="star5" title="5 stars"></label>
                            <input type="radio" id="star4" name="rate" value="4" />
                            <label for="star4" title="4 stars"></label>
                            <input type="radio" id="star3" name="rate" value="3" />
                            <label for="star3" title="3 stars"></label>
                            <input type="radio" id="star2" name="rate" value="2" />
                            <label for="star2" title="2 stars"></label>
                            <input type="radio" id="star1" name="rate" value="1" />
                            <label for="star1" title="1 star"></label>
                        </div>
                    </div>
                    <div class="comment-form-group">
                        <label for="review">Ulasan:</label>
                        <textarea id="review" name="review" rows="4" required></textarea>
                    </div>
                    <div class="comment-form-buttons">
                        <button type="reset" class="btn btn-danger">Reset</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default CommentInput;