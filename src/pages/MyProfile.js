import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import './MyProfile.css';

function MyProfile() {
  const { auth } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      axios.get(`/api/user/${auth.user.email}`)
        .then(response => {
          setProfileData(response.data);
          setOriginalData(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the user profile!", error);
        });
    }
  }, [auth]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const updatedData = {};
    for (const key in profileData) {
      if (profileData[key] !== originalData[key]) {
        updatedData[key] = profileData[key];
      }
    }

    // _id 필드를 제거하여 새로운 row가 추가되지 않도록 합니다.
    delete updatedData._id;

    axios.put(`/api/user/${auth.user.email}`, updatedData)
      .then(response => {
        alert('Profile updated successfully');
        setIsEditing(false);
        setOriginalData(profileData);
      })
      .catch(error => {
        console.error("There was an error updating the user profile!", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {profileData ? (
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.name
                )}
              </td>
            </tr>
            <tr>
              <th>Group</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="group"
                    value={profileData.group}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.group
                )}
              </td>
            </tr>
            <tr>
              <th>Country</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={profileData.country}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.country
                )}
              </td>
            </tr>
            <tr>
              <th>Residence</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="residence"
                    value={profileData.residence}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.residence
                )}
              </td>
            </tr>
            <tr>
              <th>Job</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="job"
                    value={profileData.job}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.job
                )}
              </td>
            </tr>
            <tr>
              <th>Job Details</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="job_detail"
                    value={profileData.job_detail}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.job_detail
                )}
              </td>
            </tr>
            <tr>
              <th>Interests</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="interests"
                    value={profileData.interests}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.interests
                )}
              </td>
            </tr>
            <tr>
              <th>Club</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="club"
                    value={profileData.club}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.club
                )}
              </td>
            </tr>
            <tr>
              <th>Latitude</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="latitude"
                    value={profileData.latitude}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.latitude
                )}
              </td>
            </tr>
            <tr>
              <th>Longitude</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="longitude"
                    value={profileData.longitude}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.longitude
                )}
              </td>
            </tr>
            <tr>
              <th>Email</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                  />
                ) : (
                  profileData.email
                )}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
      {isEditing ? (
        <button onClick={handleSaveClick}>Save</button>
      ) : (
        <button onClick={handleEditClick}>Edit</button>
      )}
    </div>
  );
}

export default MyProfile;
