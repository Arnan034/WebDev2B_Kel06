import React, { useState, useEffect, useRef } from "react";
import { apiServicePublic } from '../../services/api';

const ListActor = ({ id }) => {
    const [actors, setActors] = useState([]); // Store fetched actors
    const [loading, setLoading] = useState(true); // Loading state
    const actorListRef = useRef(null); // Ref to access the actor list

    useEffect(() => {
        const fetchActors = async () => {
            try {
                const response = await apiServicePublic.getActorByIdFilm(id);
                setActors(response.data.data);
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

    const isScrollDisabled = actors.length < 9; // Disable scroll buttons if less than 9 actors

    return (
        <div className="actor-list-container d-flex justify-content-center align-items-center mb-3">
            <button 
                className="prev-btn-actor" 
                onClick={() => scrollActors(-1)} 
                disabled={isScrollDisabled} // Disable button if less than 9 actors
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="actor-list" id="actorList" ref={actorListRef} style={{ display: 'flex' }}>
                {actors.length > 0 ? (
                    actors.map((actor, index) => (
                        <div className="actor-item" key={index} style={{ display: 'inline-block', margin: '0 5px' }}>
                            <img 
                                src={`data:image/jpeg;base64,${actor.picture}`} 
                                alt={actor.name} 
                                style={{ width: '100px', height: 'auto' }} // Atur ukuran gambar sesuai kebutuhan
                            />
                            <p>{actor.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No actors found.</p> // Handle no actors case
                )}
            </div>
            <button 
                className="next-btn-actor" 
                onClick={() => scrollActors(1)} 
                disabled={isScrollDisabled} // Disable button if less than 9 actors
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );
};

export default ListActor;
