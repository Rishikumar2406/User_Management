import { useEffect, useState } from "react";
import { getUser } from "../api/userApi";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    getUser(id).then(res => setUser(res.data));
  }, [id]);

  const getInitials = () => {
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div>
      <Navbar />
      <div className="view-container">
        <div className="view-header">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt="Profile" 
              className="view-profile-img" 
            />
          ) : (
            <div className="view-default-avatar">
              {getInitials()}
            </div>
          )}
          <div>
            <h2 style={{ margin: 0, color: '#333' }}>
              {user.firstName} {user.lastName}
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              {user.status || 'Active'}
            </p>
          </div>
        </div>

        <div className="view-info">
          <div className="view-item">
            <span className="view-label">Email:</span>
            <span className="view-value">{user.email}</span>
          </div>

          <div className="view-item">
            <span className="view-label">Mobile:</span>
            <span className="view-value">{user.mobile}</span>
          </div>

          <div className="view-item">
            <span className="view-label">Gender:</span>
            <span className="view-value">{user.gender || 'N/A'}</span>
          </div>

          <div className="view-item">
            <span className="view-label">Location:</span>
            <span className="view-value">{user.location || 'N/A'}</span>
          </div>

          <div className="view-item">
            <span className="view-label">Status:</span>
            <span className="view-value">
              <span className={`status ${user.status?.toLowerCase() === "active" ? "active" : "inactive"}`}>
                {user.status || 'Active'}
              </span>
            </span>
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to List
        </button>
      </div>
    </div>
  );
}