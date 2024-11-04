import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Loader } from 'semantic-ui-react';
import PaginationComponent from './paginationComponent';

const CMSComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedComments, setSelectedComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  
  const fetchCommentData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/comments/all', {
        params: { filter }
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchCommentData();
  }, [fetchCommentData]);

  const handleApproveSelected = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/comments/updateApprove', {
        ids: selectedComments,
      });
      fetchCommentData();
      setSuccessMessage(response.data.message);
      setSuccessModalOpen(true);
      setSelectedComments([]);
      setTimeout(() => {
        setSuccessModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error approving comments:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/api/comments/delete', {
        data: { ids: selectedComments },
      });
      fetchCommentData();
      setSuccessMessage(response.data.message);
      setSuccessModalOpen(true);
      setSelectedComments([]);
      setTimeout(() => {
        setSuccessModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error deleting comments:', error);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedComments(prevSelected => 
      prevSelected.includes(id)
        ? prevSelected.filter(commentId => commentId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const currentPageIds = currentItems.map(comment => comment.id_comment);
    
    if (isChecked) {
      setSelectedComments(prevSelected => [...new Set([...prevSelected, ...currentPageIds])]);
    } else {
      setSelectedComments(prevSelected => prevSelected.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(comments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = comments.slice(startIndex, endIndex);
  const isAnyCheckboxSelected = selectedComments.length > 0;

  // Open modal for approving or deleting comments
  const openModal = (action) => {
    setModalAction(action);
    setModalOpen(true);
    setModalCurrentPage(1); // Reset modal page when opened
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAction('');
    setModalCurrentPage(1); // Reset modal page on close
  };

  const handleConfirmAction = () => {
    if (modalAction === 'approve') {
      handleApproveSelected();
    } else if (modalAction === 'delete') {
      handleDeleteSelected();
    }
    closeModal();
  };

  // Modal pagination logic
  const modalItemsPerPage = 10; // Items per page in the modal
  const totalModalPages = Math.ceil(selectedComments.length / modalItemsPerPage);
  const modalStartIndex = (modalCurrentPage - 1) * modalItemsPerPage;
  const modalEndIndex = modalStartIndex + modalItemsPerPage;
  const currentModalItems = selectedComments.slice(modalStartIndex, modalEndIndex);

  return (
    <div>
      <div className="col p-4">
        <form id="commentForm" className="mb-4">
          <div className="row mb-3 align-items-center">
            <label htmlFor="filter-comm" className="col-sm-2 col-form-label">Filtered by</label>
            <div className="col-sm-4">
              <select className="form-select" id="filter-comm" onChange={(e) => setFilter(e.target.value)}>
                <option value="">None</option>
                <option value="username">Username</option>
                <option value="rate">Rate</option>
                <option value="title">Drama</option>
                <option value="comment">Comments</option>
                <option value="posted">Status</option>
              </select>
            </div>
            <label htmlFor="shows" className="col-sm-2 col-form-label">Shows</label>
            <div className="col-sm-4 d-flex">
              <select className="form-select" id="shows" onChange={(e) => setItemsPerPage(parseInt(e.target.value))}>
                {[5, 10, 15, 20, 25].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <br />
        
        <h3>List of Comments</h3>
        {loading ? (
          <div className="text-center">
            <Loader active inline='centered' />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <table className="table table-striped table-hover" id="commentsTable">
              <thead>
                <tr>
                  <th className="text-center table-warning">
                    <input 
                      type="checkbox" 
                      id="select-all"
                      onChange={handleSelectAll}
                      checked={currentItems.every(comment => selectedComments.includes(comment.id_comment))}
                    />
                  </th>
                  <th className="text-center table-warning">Username</th>
                  <th className="text-center table-warning">Rate</th>
                  <th className="text-center table-warning">Drama</th>
                  <th className="text-center table-warning">Comments</th>
                  <th className="text-center table-warning">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((comment) => (
                  <tr key={comment.id_comment}>
                    <td className="text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedComments.includes(comment.id_comment)}
                        onChange={() => handleCheckboxChange(comment.id_comment)} 
                      />
                    </td>
                    <td className="username-column">{comment.username}</td>
                    <td className="rate-column text-center">{comment.rate}</td>
                    <td className="drama-column">{comment.title}</td>
                    <td className="comments-column">{comment.comment}</td>
                    <td className="text-center">
                      {comment.posted ? (
                        <span style={{ color: 'green', fontWeight: 'bold' }}>Approve</span>
                      ) : (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>Unapprove</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="d-flex justify-content-start align-items-center mt-3">
          <Button.Group>
            <Button positive onClick={() => openModal('approve')} disabled={!isAnyCheckboxSelected}>Approve</Button>
            <Button.Or />
            <Button negative onClick={() => openModal('delete')} disabled={!isAnyCheckboxSelected}>Delete</Button>
          </Button.Group>
          
          {/* Centering the pagination component */}
          <div className="mx-auto">
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Modal for Confirmation */}
        {modalOpen && (
          <>
            <div className="modal-overlay"></div>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="ModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                  <div className="modal-header d-flex justify-content-between align-items-center">
                    <h2 className="modal-title" id="ModalCenterTitle">Confirm {modalAction === 'approve' ? 'Approval' : 'Deletion'}</h2>
                    <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      Apakah anda yakin untuk <span style={{ color: modalAction === 'approve' ? 'green' : 'red' }}>{modalAction}</span> comment dibawah ini?
                    </p>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th className='text-center table-warning'>Index</th>
                          <th className='text-center table-warning'>Username</th>
                          <th className='text-center table-warning'>Rate</th>
                          <th className='text-center table-warning'>Film</th>
                          <th className='text-center table-warning'>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentModalItems.map((id, index) => {
                          const comment = comments.find(c => c.id_comment === id);
                          return (
                            <tr key={id}>
                              <td className='text-center'>{modalStartIndex + index + 1}</td>
                              <td>{comment?.username}</td>
                              <td className='text-center'>{comment?.rate}</td>
                              <td>{comment?.title}</td>
                              <td>{comment?.comment}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Pagination for modal */}
                    {totalModalPages > 1 && (
                      <div className="d-flex justify-content-center mt-3">
                        <PaginationComponent
                          totalPages={totalModalPages}
                          currentPage={modalCurrentPage}
                          onPageChange={setModalCurrentPage} // Handle modal page changes
                        />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <Button color='grey' onClick={closeModal}>Cancel</Button>
                    <Button color={modalAction === 'approve' ? 'green' : 'red'} onClick={handleConfirmAction}>{modalAction === 'approve' ? 'Approve' : 'Delete'}</Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Modal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          basic
          size='small'
          className='confirm-film-modal'
        >
          <Modal.Content>
            <h4>{successMessage}</h4>
          </Modal.Content>
        </Modal>
      </div>
    </div>
  );
};

export default CMSComments;