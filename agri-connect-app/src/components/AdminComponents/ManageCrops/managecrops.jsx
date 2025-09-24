import React, { useState, useEffect } from "react";
import "./Styles_managecrops.css";
import Table from "../Table/table";
import AddCrops from "../Addcrop/addcrop";
import apiHelper from "../../../features/apiHelper.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Custom styled Snackbar
const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  "& .MuiSnackbarContent-root": {
    fontSize: "1rem",
    minWidth: "300px",
  },
}));

const ManageCrops = () => {
  const columns = ["Crop ID", "Crop Name", "Change Details"];
  const [crops, setCrops] = useState([]);
  const [isAddPopupVisible, setAddPopupVisible] = useState(false);
  const [isUpdatePopupVisible, setUpdatePopupVisible] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [updatedCropName, setUpdatedCropName] = useState("");

  const fetchCrops = async () => {
    try {
      const response = await apiHelper("get", {
        url: "/crops",
      });
      console.log(response);
      setCrops(response.data);
    } catch (error) {
      console.error("Error fetching crops:", error);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleAddCrop = async (cropName) => {
    if (!cropName.trim()) {
      setAlert({
        open: true,
        message: "Crop name is required.",
        severity: "error",
      });
      return;
    }

    let name = { name: cropName };
    try {
      const response = await apiHelper("post", {
        url: "/crops",
        data: name,
      });
      // const result = await response.json();

      console.log(response);
      if (response.success) {
        setAddPopupVisible(false);
        setAlert({
          open: true,
          message: response.message || "Crop added successfully!",
          severity: "success",
        });
        fetchCrops();
      } else {
        setAlert({
          open: true,
          message: response.message || "Failed to add crop.",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error adding crop.",
        severity: "error",
      });
      console.error("Error adding crop:", error);
    }
  };

  const handleUpdate = (crop) => {
    console.log("Updating crop:", crop);
    setSelectedCrop(crop);
    setUpdatedCropName(crop.name);
    setUpdatePopupVisible(true);
  };

  const handleUpdateSubmit = async () => {
    if (!updatedCropName.trim()) {
      setAlert({
        open: true,
        message: "Crop name is required.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await apiHelper("put", {
        url: `/crops/${selectedCrop.id}`,
        data: { name: updatedCropName },
      });

      if (response && response.success) {
        setUpdatePopupVisible(false);
        setAlert({
          open: true,
          message: response.message || "Crop updated successfully!",
          severity: "success",
        });
        fetchCrops();
        setUpdatedCropName(""); // Clear form after successful update
      } else {
        setAlert({
          open: true,
          message: response.message || "Failed to update crop.",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error updating crop.",
        severity: "error",
      });
      console.error("Error updating crop:", error);
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <div className="manage-crops-container">
      <h1>Manage Crops</h1>
      <p>Here you can manage your crops.</p>

      <div className="add-crop-container">
        <AddCrops onAdd={handleAddCrop} />
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          data={crops}
          onUpdate={handleUpdate} // Pass the onUpdate function to the Table component
        />
      </div>

      <StyledSnackbar
        open={alert.open}
        autoHideDuration={3000} // 3 seconds
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position to top right
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </StyledSnackbar>

      {isUpdatePopupVisible && selectedCrop && (
        <div className="update-crop-popup">
          <div className="update-crop-form">
            <h2>Update Crop</h2>
            <input
              type="text"
              value={updatedCropName}
              onChange={(e) => setUpdatedCropName(e.target.value)}
              placeholder="Enter crop name"
            />
            <button onClick={handleUpdateSubmit}>Update</button>
            <button onClick={() => setUpdatePopupVisible(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCrops;
