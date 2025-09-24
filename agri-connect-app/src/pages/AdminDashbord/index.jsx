
import React from 'react';
import Sidebar from '../../components/AdminComponents/Sidebar/sidebar.jsx'; 

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Admin Dashboard</h1>
       
      </div>
    </div>
  );
}

export default AdminDashboard;
