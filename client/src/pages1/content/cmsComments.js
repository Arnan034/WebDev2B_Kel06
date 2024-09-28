import React, { useEffect, useState } from 'react';

const commentsData = [
  { username: 'JohnDoe', rate: 4.5, drama: 'Drama A', comment: 'Amazing storyline and great acting!', status: 'Approved' },
  { username: 'JaneSmith', rate: 3.0, drama: 'Drama B', comment: 'Good drama but a bit slow in the middle.', status: 'Unapproved' },
  { username: 'User123', rate: 5.0, drama: 'Drama C', comment: "One of the best dramas I've ever watched!", status: 'Approved' },
  { username: 'MovieBuff', rate: 2.0, drama: 'Drama D', comment: "Not up to the mark, expected better.", status: 'Unapproved' },
  { username: 'CinemaLover', rate: 4.0, drama: 'Drama E', comment: "Good overall but had some predictable moments.", status: 'Approved' }
];

const generateStars = (rate) => {
  const fullStar = <i className="fas fa-star text-warning"></i>;
  const halfStar = <i className="fas fa-star-half-alt text-warning"></i>;
  const emptyStar = <i className="far fa-star text-warning"></i>;

  let stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rate >= i) {
      stars.push(fullStar);
    } else if (rate >= i - 0.5) {
      stars.push(halfStar);
    } else {
      stars.push(emptyStar);
    }
  }
  return stars;
};

const CMSComments = () => {
  const [comments, setComments] = useState(commentsData);
  const [filter, setFilter] = useState('');
  const [showCount, setShowCount] = useState(5);
  const [selectedComments, setSelectedComments] = useState([]);

  useEffect(() => {
    loadComments();
  }, [comments]);

  const loadComments = () => {
    // No need for this, as comments are managed via state.
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectedComments(checked ? comments.map((_, index) => index) : []);
  };

  const handleApprove = () => {
    setComments(prevComments =>
      prevComments.map((comment, index) => 
        selectedComments.includes(index) ? { ...comment, status: 'Approved' } : comment
      )
    );
    alert('Selected comments approved!');
  };

  const handleDelete = () => {
    setComments(prevComments => prevComments.filter((_, index) => !selectedComments.includes(index)));
    alert('Selected comments deleted!');
    setSelectedComments([]);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const filteredComments = commentsData.filter(comment => {
      if (!filter) return true;
      switch (filter) {
        case 'username': return comment.username.includes(''); // Add appropriate filtering logic
        case 'rate': return comment.rate >= 0; // Add appropriate filtering logic
        case 'drama': return comment.drama.includes(''); // Add appropriate filtering logic
        case 'comments': return comment.comment.includes(''); // Add appropriate filtering logic
        case 'status': return comment.status.includes(''); // Add appropriate filtering logic
        default: return true;
      }
    });

    setComments(filteredComments.slice(0, showCount));
  };

  return (
    <div>
      <div className="col p-4">
        <form id="commentForm" className="mb-4" onSubmit={handleSearch}>
          <div className="row mb-3 align-items-center">
            <label htmlFor="filter-comm" className="col-sm-2 col-form-label">Filtered by</label>
            <div className="col-sm-4">
              <select className="form-select" id="filter-comm" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="" disabled>None</option>
                <option value="username">Username</option>
                <option value="rate">Rate</option>
                <option value="drama">Drama</option>
                <option value="comments">Comments</option>
                <option value="status">Status</option>
              </select>
            </div>
            <label htmlFor="shows" className="col-sm-2 col-form-label">Shows</label>
            <div className="col-sm-4 d-flex">
              <select className="form-select" id="shows" onChange={(e) => setShowCount(e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
              <button type="submit" className="btn btn-success ms-3">Search</button>
            </div>
          </div>
        </form>
        <br />

        <h3>List of Comments</h3>
        <table className="table table-striped table-hover" id="commentsTable">
          <thead>
            <tr>
              <th className="text-center table-warning">
                <input type="checkbox" id="select-all" onChange={handleSelectAll} />
              </th>
              <th className="text-center table-warning">Username</th>
              <th className="text-center table-warning">Rate</th>
              <th className="text-center table-warning">Drama</th>
              <th className="text-center table-warning">Comments</th>
              <th className="text-center table-warning">Status</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr key={index}>
                <td className="text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedComments.includes(index)} 
                    onChange={() => setSelectedComments(prev => 
                      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])} 
                  />
                </td>
                <td className="username-column">{comment.username}</td>
                <td className="rate-column">{generateStars(comment.rate)}</td>
                <td className="drama-column">{comment.drama}</td>
                <td className="comments-column">{comment.comment}</td>
                <td className="text-center">{comment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-start mt-3">
          <button id="approve-btn" className="btn btn-primary me-2" onClick={handleApprove}>
            Approve
          </button>
          <button id="delete-btn" className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CMSComments;
