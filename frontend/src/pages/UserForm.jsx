import { useState, useEffect } from "react";
import { createUser, getUser, updateUser } from "../api/userApi";
import { useParams, useNavigate } from "react-router-dom";

export default function UserForm() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    status: "Active",
    location: "",
    gender: "Male",
    profileImage: ""
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("No file chosen");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getUser(id).then(res => {
        setData(res.data);
        if (res.data.profileImage) {
          setPreviewImage(res.data.profileImage);
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setData({ ...data, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    return `${data.firstName?.charAt(0) || ''}${data.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const submit = async (e) => {
    e.preventDefault();

    // Validation
    if (!data.firstName || !data.lastName || !data.email || !data.mobile) {
      alert("Please fill all required fields");
      return;
    }

    try {
      id
        ? await updateUser(id, data)
        : await createUser(data);

      navigate("/");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Error saving user");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">
        <h2>MERN stack developer practical task</h2>
      </div>

      <div className="form-container">
        <h2 className="form-title">Register Your Details</h2>

        {/* Profile Preview Only at Top */}
        <div className="profile-preview-section">
          {previewImage ? (
            <img src={previewImage} alt="Profile Preview" className="profile-preview" />
          ) : (
            <div className="default-profile-preview">
              {getInitials() || '👤'}
            </div>
          )}
          <div className="upload-label">Profile Picture</div>
        </div>

        <form onSubmit={submit} className="user-form">
          {/* First Name */}
          <div className="form-group">
            <label className="form-label">First name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter FirstName"
              value={data.firstName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter LastName"
              value={data.lastName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={data.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Mobile */}
          <div className="form-group">
            <label className="form-label">Mobile</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter Mobile"
              value={data.mobile}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">Select Your Gender</label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  checked={data.gender === "Male"}
                  onChange={handleChange}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  checked={data.gender === "Female"}
                  onChange={handleChange}
                />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>

          {/* Profile Upload - Moved here below Gender */}
          <div className="form-group">
            <label className="form-label">Select Your Profile</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="profileImage"
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="profileImage" className="file-input-button">
                Choose file
              </label>
              <span className="file-name-display">{selectedFileName}</span>
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">Select Your Status</label>
            <select
              name="status"
              value={data.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Enter Your Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter Your Location"
              value={data.location}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}