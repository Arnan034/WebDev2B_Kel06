import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import PaginationComponent from './paginationComponent';

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
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showCount, setShowCount] = useState(5);
  const [selectedComments, setSelectedComments] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = showCount;
  const totalPages = Math.ceil(comments.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = comments.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/comments/');
        console.log("Data fetched:", response.data); // Log data here
        setComments(response.data || []);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectedComments(checked ? currentItems.map((_, index) => index) : []);
  };

  const handleApprove = () => {
    setComments(prevComments =>
      prevComments.map((comment, index) => 
        selectedComments.includes(index) ? { ...comment, status: 'Approved' } : comment
      )
    );
    alert('Selected comments approved!');
    setSelectedComments([]);
  };

  const handleDelete = () => {
    setComments(prevComments => prevComments.filter((_, index) => !selectedComments.includes(index)));
    alert('Selected comments deleted!');
    setSelectedComments([]);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // Implement filter logic based on the selected filter value.
    // Example:
    const filteredComments = comments.filter(comment => {
      if (!filter) return true;
      switch (filter) {
        case 'username': return comment.username.includes(''); // Add username filtering logic
        case 'rate': return comment.rate >= 0; // Add rate filtering logic
        case 'drama': return comment.drama.includes(''); // Add drama filtering logic
        case 'comments': return comment.comment.includes(''); // Add comments filtering logic
        case 'status': return comment.status.includes(''); // Add status filtering logic
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
                <option value="">None</option>
                <option value="username">Username</option>
                <option value="rate">Rate</option>
                <option value="drama">Drama</option>
                <option value="comments">Comments</option>
                <option value="status">Status</option>
              </select>
            </div>
            <label htmlFor="shows" className="col-sm-2 col-form-label">Shows</label>
            <div className="col-sm-4 d-flex">
              <select className="form-select" id="shows" onChange={(e) => setShowCount(Number(e.target.value))}>
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
              <th className="text-center table-warning">Date</th>
              <th className="text-center table-warning">Status</th>
            </tr>
          </thead>
          {loading ? (
            <p>Loading comments...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <tbody>
              {currentItems.map((comment, index) => (
                  <tr key={comment.id}>
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
                      <td className="drama-column">{comment.filmTitle}</td>
                      <td className="comments-column">{comment.comment}</td>
                      <td className="comments-column">{comment.date}</td>
                  </tr>
              ))}
            </tbody>
          )}
        </table>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        <div className="d-flex justify-content-start mt-3">
          <Button color='blue' size='tiny' onClick={handleApprove}>Approve</Button>
          <Button color='red' size='tiny' onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default CMSComments;
