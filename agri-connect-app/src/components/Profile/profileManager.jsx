import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
} from "@mui/material";
import apiHelper from "./../../features/apiHelper.js";
import { useSelector } from "react-redux";
import { selectUser } from "./../../features/slices/authSlice.js";

// Districts list
export const districts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
];

// Modal styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ProfileManager = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    district: "",
    phoneNumber: "",
  });
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });
  const [errors, setErrors] = useState({});

  const user = useSelector(selectUser);
  const id = user.id;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await apiHelper("get", { url: `/auth/${id}` });
        setProfileData(response.data || {});
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setAlert({
          open: true,
          message: "Failed to fetch profile data.",
          severity: "error",
        });
      }
    };
    fetchProfileData();
  }, [id]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!profileData.firstName) newErrors.firstName = "First name is required.";
    if (!profileData.lastName) newErrors.lastName = "Last name is required.";
    if (!profileData.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!profileData.district) newErrors.district = "District is required.";
    if (!profileData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(profileData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await apiHelper("put", {
        url: `/auth/${id}`,
        data: profileData,
      });

      if (response.success) {
        setAlert({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });
        handleClose();
      } else {
        setAlert({
          open: true,
          message: response.message || "Failed to update profile.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({ open: true, message: "Error updating profile.", severity: "error" });
    }
  };

  const handleClose = () => setOpen(false);
  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Profile Manager</Typography>

      {/* Profile Display */}
      <Box sx={{ mb: 3, p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Profile Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}><strong>First Name:</strong> {profileData.firstName}</Grid>
          <Grid item xs={6}><strong>Last Name:</strong> {profileData.lastName}</Grid>
          <Grid item xs={6}><strong>Email:</strong> {profileData.email}</Grid>
          <Grid item xs={6}><strong>District:</strong> {profileData.district}</Grid>
          <Grid item xs={6}><strong>Phone Number:</strong> {profileData.phoneNumber}</Grid>
        </Grid>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom>Edit Profile</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required error={Boolean(errors.district)}>
                  <InputLabel>District</InputLabel>
                  <Select
                    name="district"
                    value={profileData.district || ""}
                    onChange={handleChange}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.district && (
                    <Typography variant="caption" color="error">
                      {errors.district}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={Boolean(errors.phoneNumber)}
                  helperText={errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfileManager;
