
import React from 'react';
import Sidebar from '../../components/MechineComponents/Sidebar/sidebar'; 

const MachineryDashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Machinery Dashboard</h1>
       
      </div>
    </div>
  );
}

export default MachineryDashboard;