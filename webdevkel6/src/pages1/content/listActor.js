import React from "react";

class ListActor extends React.Component {
    actorListRef = React.createRef();

    scrollActors = (direction) => {
        const container = document.getElementById('actorList');
        const actorWidth = 130; // Lebar setiap aktor
        const scrollAmount = actorWidth * direction; // Scroll berdasarkan arah
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    render() {
        const actors = [
            { name: "Robert Downey Jr.", img: "https://via.placeholder.com/120x160" },
            { name: "Chris Evans", img: "https://via.placeholder.com/120x160" },
            { name: "Scarlett Johansson", img: "https://via.placeholder.com/120x160" },
            { name: "Tom Holland", img: "https://via.placeholder.com/120x160" },
            { name: "Chris Hemsworth", img: "https://via.placeholder.com/120x160" },
            { name: "Mark Ruffalo", img: "https://via.placeholder.com/120x160" },
            { name: "Benedict Cumberbatch", img: "https://via.placeholder.com/120x160" },
            { name: "Tom Hiddleston", img: "https://via.placeholder.com/120x160" },
            { name: "Brie Larson", img: "https://via.placeholder.com/120x160" },
            { name: "Paul Rudd", img: "https://via.placeholder.com/120x160" },
        ];

        return (
            <div className="actor-list-container">
                <button className="prev-btn-actor" onClick={() => this.scrollActors(-1)}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="actor-list" id="actorList" ref={this.actorListRef}>
                    {actors.map((actor, index) => (
                        <div className="actor-item" key={index} style={{ display: 'inline-block', margin: '0 5px' }}>
                            <img src={actor.img} alt={actor.name} />
                            <p>{actor.name}</p>
                        </div>
                    ))}
                </div>
                <button className="next-btn-actor" onClick={() => this.scrollActors(1)}>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        );
    }
}

export default ListActor;
