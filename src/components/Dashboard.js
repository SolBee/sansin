import React from 'react';
import WorldMap from './WorldMap';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-item">
          <WorldMap />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
