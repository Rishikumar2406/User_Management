import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function UserTable({ users, refresh, deleteUser }) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState('bottom');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const toggleMenu = (id, event) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    
    // Calculate if menu should open upward
    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const tableContainer = button.closest('.table-container');
    const containerRect = tableContainer.getBoundingClientRect();
    
    const spaceBelow = containerRect.bottom - buttonRect.bottom;
    const spaceAbove = buttonRect.top - containerRect.top;
    
    // If less than 120px space below, open upward
    if (spaceBelow < 120 && spaceAbove > 120) {
      setMenuPosition('top');
    } else {
      setMenuPosition('bottom');
    }
    
    setOpenMenuId(id);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.action-menu')) {
        setOpenMenuId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      refresh();
      setOpenMenuId(null);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Import updateUser from your API
      const { updateUser } = await import("../api/userApi");
      const user = users.find(u => u._id === userId);
      await updateUser(userId, { ...user, status: newStatus });
      refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>FullName</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Profile</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No Users Found
              </td>
            </tr>
          ) : (
            currentUsers.map((u, index) => (
              <tr key={u._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.gender || 'N/A'}</td>
                <td>
                  <select 
                    className={`status-dropdown ${u.status?.toLowerCase() === "active" ? "active" : "inactive"}`}
                    value={u.status || 'Active'}
                    onChange={(e) => handleStatusChange(u._id, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td>
                  <div className="profile-cell">
                    {u.profileImage ? (
                      <img 
                        src={u.profileImage} 
                        alt="Profile" 
                        className="profile-img" 
                      />
                    ) : (
                      <div className="default-avatar">
                        {getInitials(u.firstName, u.lastName)}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-menu">
                    <button 
                      className="menu-trigger"
                      onClick={(e) => toggleMenu(u._id, e)}
                    >
                      ⋮
                    </button>
                    
                    {openMenuId === u._id && (
                      <div className={`menu-dropdown ${menuPosition === 'top' ? 'menu-dropdown-top' : ''}`}>
                        <button 
                          className="menu-item view"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/view/${u._id}`);
                            setOpenMenuId(null);
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>👁️</span> View
                        </button>
                        <button 
                          className="menu-item edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit/${u._id}`);
                            setOpenMenuId(null);
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>✏️</span> Edit
                        </button>
                        <button 
                          className="menu-item delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(u._id);
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>🗑️</span> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            className="page-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}