import React from "react";

const ListAward = ({ awards }) => {
    // Periksa apakah awards tidak null atau undefined dan merupakan array
    if (!awards || !Array.isArray(awards)) {
        return <h5 className="d-flex justify-content-center my-5">No awards available.</h5>; // Menampilkan pesan jika tidak ada data
    }

    return (
        <div className="award-container mb-4 px-6">
            {awards.slice(0, 3).map((award, index) => (
                <div key={index} className="award-card">
                    <h5>{award.year} - {award.institution}</h5>
                    <p>{award.name}</p>
                </div>
            ))}
        </div>
    );
}

export default ListAward;
