
import React from 'react';
import Sidebar from '../../components/FertilizerComponents/Sidebar/sidebar'; 

const FertilizerDashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Fertilizer Dashboard</h1>
       
      </div>
    </div>
  );
}

export default FertilizerDashboard;