import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    group: '',
    country: '',
    residence: '',
    job: '',
    job_detail: '',
    interests: '',
    club: '',
    latitude: '',
    longitude: '',
    email: ''
  });

  useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    user.group.toLowerCase().includes(filters.group.toLowerCase()) &&
    user.country.toLowerCase().includes(filters.country.toLowerCase()) &&
    user.residence.toLowerCase().includes(filters.residence.toLowerCase()) &&
    user.job.toLowerCase().includes(filters.job.toLowerCase()) &&
    user.job_detail.toLowerCase().includes(filters.job_detail.toLowerCase()) &&
    user.interests.toLowerCase().includes(filters.interests.toLowerCase()) &&
    user.club.toLowerCase().includes(filters.club.toLowerCase()) &&
    user.latitude.toString().toLowerCase().includes(filters.latitude.toLowerCase()) &&
    user.longitude.toString().toLowerCase().includes(filters.longitude.toLowerCase()) &&
    user.email.toLowerCase().includes(filters.email.toLowerCase())
  );

  return (
    <div className="profile-container">
      <h2>User Profiles</h2>
      <table className="profile-table">
        <thead>
          <tr>
            <th>
              Name
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Name"
              />
            </th>
            <th>
              Group
              <input
                type="text"
                name="group"
                value={filters.group}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Group"
              />
            </th>
            <th>
              Country
              <input
                type="text"
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Country"
              />
            </th>
            <th>
              Residence
              <input
                type="text"
                name="residence"
                value={filters.residence}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Residence"
              />
            </th>
            <th>
              Job
              <input
                type="text"
                name="job"
                value={filters.job}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Job"
              />
            </th>
            <th>
              Job Details
              <input
                type="text"
                name="job_detail"
                value={filters.job_detail}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Job Details"
              />
            </th>
            <th>
              Interests
              <input
                type="text"
                name="interests"
                value={filters.interests}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Interests"
              />
            </th>
            <th>
              Club
              <input
                type="text"
                name="club"
                value={filters.club}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Club"
              />
            </th>
            <th>
              Latitude
              <input
                type="text"
                name="latitude"
                value={filters.latitude}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Latitude"
              />
            </th>
            <th>
              Longitude
              <input
                type="text"
                name="longitude"
                value={filters.longitude}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Longitude"
              />
            </th>
            <th>
              Email
              <input
                type="text"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Filter by Email"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.group}</td>
              <td>{user.country}</td>
              <td>{user.residence}</td>
              <td>{user.job}</td>
              <td>{user.job_detail}</td>
              <td>{user.interests}</td>
              <td>{user.club}</td>
              <td>{user.latitude}</td>
              <td>{user.longitude}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Profile;