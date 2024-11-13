import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import PaginationComponent from './paginationComponent';
import { Button, Loader, Modal } from 'semantic-ui-react';

const CMSUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUserData = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.post('http://localhost:5000/api/auth/getUserMonitoring', {
        filter
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredUsers = users.filter(user => 
    user.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, endIndex);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleConfirmEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/auth/updateStatus/${selectedUser.id}`, {
        status: !selectedUser.st
      });
      console.log('Status updated');
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setModalOpen(false);
      setSelectedUser(null);
      fetchUserData();
    }
  };

  return (
    <div>
      <div className="col p-4">
        <h1>Monitor User</h1>
        <form id="commentForm" className="mb-4">
          <div className="row mb-3 align-items-center">
            <label htmlFor="filter-comm" className="col-sm-2 col-form-label">Filtered by</label>
            <div className="col-sm-4">
              <select className="form-select" id="filter-comm" onChange={(e) => setFilter(e.target.value)}>
                <option value="">None</option>
                <option value="true">Active</option>
                <option value="false">Blacklist</option>
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


        <div className="d-flex justify-content-end mb-4">
          <div className="row align-items-center" style={{ width: 'auto' }}>
            <label htmlFor="search-user" className="col-auto me-2">Search Username</label>
            <div className="col-auto" style={{ width: '400px' }}>
              <input
                type="text"
                className="form-control"
                id="search-user"
                placeholder="Search username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <h3>List of Users</h3>
        {loading ? (
          <div className="text-center">
            <Loader active inline='centered' />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <table className="table table-striped table-hover" id="usersTable">
              <thead>
                <tr>
                  <th className="text-center no-column table-warning">No</th>
                  <th className="text-center username-column table-warning">Username</th>
                  <th className="text-center email-column table-warning">Email</th>
                  <th className="text-center status-column table-warning">Status</th>
                  <th className="text-center action-column table-warning">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => (
                  <tr key={index}>
                    <td className="text-center no-column">{startIndex + index + 1}</td>
                    <td className="username-column">{user.user}</td>
                    <td className="email-column">{user.em}</td>
                    <td className="text-center status-column">{user.st ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>BlackList</span>
                    )}
                    </td>
                    <td className="text-center actions-column">
                      <Button color='blue' size='tiny' onClick={() => handleEditClick(user)}>Edit</Button>
                      <Button color='red' size='tiny'>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Modal for confirming status edit */}
      <Modal open={modalOpen} className='confirm-film-modal-validate' onClose={() => setModalOpen(false)}>
        <Modal.Header>Confirm Status Change</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to change the status of <span style={{ color: 'red', fontWeight: 'bold' }}>{selectedUser?.user}</span> to <span style={{ color: selectedUser?.st ? 'red' : 'green', fontWeight: 'bold' }}>{selectedUser?.st ? 'BlackList' : 'Active'}</span>?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button color='green' onClick={handleConfirmEdit}>Confirm</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default CMSUser;
