import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ListActor = ({ id }) => {
    const [actors, setActors] = useState([]); // Store fetched actors
    const [loading, setLoading] = useState(true); // Loading state
    const actorListRef = useRef(null); // Ref to access the actor list

    useEffect(() => {
        const fetchActors = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/actors/${id}`);
                setActors(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching actor data:', error);
                setLoading(false);
            }
        };

        fetchActors();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while data is being fetched
    }
    
    const scrollActors = (direction) => {
        const container = actorListRef.current; // Use ref to access the actor list
        const actorWidth = 130; // Width of each actor
        const scrollAmount = actorWidth * direction; // Scroll amount based on direction
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="actor-list-container">
            <button className="prev-btn-actor" onClick={() => scrollActors(-1)}>
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="actor-list" id="actorList" ref={actorListRef}>
                {actors.map((actor, index) => (
                    <div className="actor-item" key={index} style={{ display: 'inline-block', margin: '0 5px' }}>
                        <img src={`data:image/jpeg;base64,${actor.picture}`} alt={actor.name} />
                        <p>{actor.name}</p>
                    </div>
                ))}
            </div>
            <button className="next-btn-actor" onClick={() => scrollActors(1)}>
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );
};

export default ListActor;
