import React from "react";

class Genre extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            visibleButtons: 5,
        };
        this.buttonWidth = 100;
        this.categoryInnerRef = React.createRef(); // Referensi untuk category-inner
    }

    showSlide = (index) => {
        const totalButtons = this.getTotalButtons();
        const maxIndex = totalButtons - this.state.visibleButtons;

        let newIndex = index;

        if (index > maxIndex) {
            newIndex = 0;
        } else if (index < 0) {
            newIndex = maxIndex;
        }

        this.setState({ currentIndex: newIndex }, () => {
            this.updateSlidePosition();
        });
    };

    getTotalButtons = () => {
        return document.querySelectorAll('.category-button').length;
    };

    updateSlidePosition = () => {
        const offset = -this.state.currentIndex * (this.buttonWidth + 10);
        if (this.categoryInnerRef.current) {
            this.categoryInnerRef.current.style.transform = `translateX(${offset}px)`;
        }
    };

    nextSlide = () => {
        this.showSlide(this.state.currentIndex + 1);
    };

    prevSlide = () => {
        this.showSlide(this.state.currentIndex - 1);
    };

    render() {
        return (
            <div>
                <div className="category-container">
                    <button className="category-control-prev" onClick={this.prevSlide}>
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <div className="category-wrapper">
                        <div className="button-category">
                            <div className="category-inner" ref={this.categoryInnerRef}>
                                {Array.from({ length: 20 }, (_, index) => (
                                    <button key={index} className="category-button">
                                        category {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="category-control-next" onClick={this.nextSlide}>
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            </div>
        );
    }
}

export default Genre;
