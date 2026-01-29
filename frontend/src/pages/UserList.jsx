import { useEffect, useState } from "react";
import { getUsers, deleteUser, exportCsv } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data.users);
    setFilteredUsers(res.data.users);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="controls-section">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="action-buttons">
          <button className="add-user-btn" onClick={() => navigate("/add")}>
            + Add User
          </button>
          <button className="export-btn" onClick={exportCsv}>
            Export To Csv
          </button>
        </div>
      </div>

      <UserTable users={filteredUsers} refresh={loadUsers} deleteUser={deleteUser}/>
    </div>
  );
}