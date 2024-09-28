import React from "react";

const ListAward = ({ awards }) => {
    return (
        <div className="award-container mb-4 px-6">
            {awards.slice(0, 3).map((award, index) => (
                <div key={index} className="award-card">
                    <h5>{award.year_award} - {award.institution}</h5>
                    <p>{award.award}</p>
                </div>
            ))}
        </div>
    );
}

export default ListAward;
