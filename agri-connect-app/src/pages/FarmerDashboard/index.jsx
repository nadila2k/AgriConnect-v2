import React from 'react';
import Sidebar from '../../components/FarmerComponents/Sidebar/sidebar'; 

const FarmerDashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Farmer Dashboard</h1>
       
      </div>
    </div>
  );
}

export default FarmerDashboard;