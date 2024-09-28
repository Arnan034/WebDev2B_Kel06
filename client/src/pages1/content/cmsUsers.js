import React, { useState } from 'react';

const CMSUser = () => {
  const [users, setUsers] = useState([
    { no: 1, username: "naiasiaz", email: "naiasiaz@gmail.com" },
    { no: 2, username: "arnan.praya", email: "arnan@gmail.com" },
    { no: 3, username: "n.zhra", email: "nzhra@gmail.com" },
    { no: 4, username: "ar.stya", email: "arstya@gmail.com" }
  ]);

  const [notification, setNotification] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const renderTable = () => {
    return users.map((item, index) => (
      <tr key={index}>
        <td className="text-center no-column">{item.no}</td>
        <td className="username-column">{item.username}</td>
        <td className="email-column">{item.email}</td>
        <td className="text-center actions-column">
          <button className="btn btn-send-email" onClick={() => handleSendEmail(index)}>Send First Email</button>
          <button className="btn btn-edit" onClick={() => handleEditUser(index)}>Edit</button>
          <button className="btn btn-delete" onClick={() => handleDeleteUser(index)}>Delete</button>
        </td>
      </tr>
    ));
  };

  const showAlert = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleAddUser = (event) => {
    event.preventDefault();
    const newUser = {
      no: users.length ? users[users.length - 1].no + 1 : 1,
      username,
      email
    };
    setUsers([...users, newUser]);
    setUsername('');
    setEmail('');
    showAlert("User added successfully!", "success");
  };

  const handleEditUser = (index) => {
    const newUsername = prompt("Enter new username:", users[index].username);
    const newEmail = prompt("Enter new email:", users[index].email);
    if (newUsername && newEmail) {
      const updatedUsers = users.map((user, idx) => idx === index ? { ...user, username: newUsername, email: newEmail } : user);
      setUsers(updatedUsers);
      showAlert("User updated successfully!", "success");
    }
  };

  const handleDeleteUser = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      const filteredUsers = users.filter((_, idx) => idx !== index).map((item, idx) => ({ ...item, no: idx + 1 }));
      setUsers(filteredUsers);
      showAlert("User deleted successfully!", "danger");
    }
  };

  const handleSendEmail = (index) => {
    const confirmed = window.confirm("Are you sure you want to send the first email to this user?");
    if (confirmed) {
      const user = users[index];
      showAlert(`Email sent successfully to ${user.username} (${user.email})!`, 'success');
    }
  };

  return (
    <div>
      <div className="col p-4">
        <h3>Add User</h3>
        <hr className="text-black my-2" />
        <form id="userForm" className="mb-4" onSubmit={handleAddUser}>
          <div className="mb-3 row align-items-center">
            <label htmlFor="username" className="form-label col-sm-3">Username</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" placeholder="Type username here..." id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
          </div>
          <div className="mb-3 row align-items-center">
            <label htmlFor="email" className="form-label col-sm-3">Email</label>
            <div className="col-sm-9">
              <input type="email" className="form-control" placeholder="Type email here..." id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-success">Submit</button>
          </div>
        </form>
        
        {notification && <div className={`alert alert-${notification.type} mt-3`}>{notification.message}</div>}

        <h3>List of Users</h3>
        <table className="table table-striped table-hover" id="usersTable">
          <thead>
            <tr>
              <th className="text-center no-column table-warning">No</th>
              <th className="text-center username-column table-warning">Username</th>
              <th className="text-center email-column table-warning">Email</th>
              <th className="text-center action-column table-warning">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderTable()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CMSUser;
