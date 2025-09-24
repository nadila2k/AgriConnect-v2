import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
import apiHelper from "../../../features/apiHelper.js";
import { useSelector } from "react-redux";
import { selectUser } from "./../../../features/slices/authSlice.js";
import { FormHelperText } from "@mui/material";

// Material UI modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const FarmManager = () => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [years, setYears] = useState([]);
  const [crops, setCrops] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [perch, setPerch] = useState("");
  const [harvestMonth, setHarvestMonth] = useState("");
  const [progressOptions, setProgressOptions] = useState([]);
  const [selectedProgress, setSelectedProgress] = useState("");
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [farmerStatistics, setFarmerStatistics] = useState([]);
  const [selectedFarmerStat, setSelectedFarmerStat] = useState(null);

  const user = useSelector(selectUser);
  const userId = user.id;

  // Fetch years, months, and farmer statistics on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const yearsData = await apiHelper("get", { url: "/years" });
        const monthsData = await apiHelper("get", { url: "/month" });
        const farmerStatsData = await apiHelper("get", {
          url: `/farmerStatistic/${userId}`,
        });

        setYears(yearsData.data || []);
        setMonths(monthsData.data || []);
        setFarmerStatistics(farmerStatsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  // Fetch crops based on selected year
  useEffect(() => {
    const fetchCrops = async () => {
      if (selectedYear) {
        try {
          const response = await apiHelper("get", {
            url: `/cropsStatistic/cropsByYear/${selectedYear}`,
          });
          setCrops(response.data.crops || []);
        } catch (error) {
          console.error("Error fetching crops:", error);
        }
      } else {
        setCrops([]);
      }
    };

    fetchCrops();
  }, [selectedYear]);

  // Form validation logic
  const validateForm = () => {
    let tempErrors = {};

    if (!selectedYear) tempErrors.selectedYear = "Year is required";
    if (!selectedCrop) tempErrors.selectedCrop = "Crop is required";
    if (!perch || isNaN(perch))
      tempErrors.perch = "Valid perch size is required";
    if (!harvestMonth) tempErrors.harvestMonth = "Harvest month is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  // Form submission handler for new farmerStatistic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const perchDivided = (perch / 395).toFixed(2);
        const response = await apiHelper("post", {
          url: "/farmerStatistic",
          data: {
            perch: perchDivided,
            monthId: harvestMonth,
            progressId: 1, // Assuming this is the progress ID, update as needed
            userId,
            cropsStatisticId: selectedCrop,
          },
        });

        if (response.success) {
          setAlert({
            open: true,
            message: response.message || "Form submitted successfully!",
            severity: "success",
          });
          setSelectedYear("");
          setSelectedCrop("");
          setPerch("");
          setHarvestMonth("");

          handleClose();
          // Fetch updated farmer statistics data
          const farmerStatsData = await apiHelper("get", {
            url: `/farmerStatistic/${userId}`,
          });
          setFarmerStatistics(farmerStatsData.data || []);
        } else {
          setAlert({
            open: true,
            message: response.message || "Submission failed.",
            severity: "error",
          });
        }
      } catch (error) {
        setAlert({
          open: true,
          message: "Error submitting form.",
          severity: "error",
        });
        console.error("Error submitting form:", error);
      }
    }
  };

  // Handle Update Button click
  const handleUpdate = async (stat) => {
    setSelectedFarmerStat(stat);
    setOpenUpdate(true);

    try {
      const progressData = await apiHelper("get", { url: "/progress" });
      setProgressOptions(progressData.data || []);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  };

  const handleSubmitUpdate = async () => {
    if (!selectedProgress) {
      setAlert({
        open: true,
        message: "Please select a progress status.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await apiHelper("put", {
        url: `/farmerStatistic/${selectedFarmerStat.id}`,
        data: { progressId: selectedProgress },
      });

      if (response.success) {
        setAlert({
          open: true,
          message: response.message || "Progress updated successfully!",
          severity: "success",
        });
        setOpenUpdate(false);
        // Fetch updated farmer statistics data
        const farmerStatsData = await apiHelper("get", {
          url: `/farmerStatistic/${userId}`,
        });
        setFarmerStatistics(farmerStatsData.data || []);
      } else {
        setAlert({
          open: true,
          message: response.message || "Update failed.",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error updating progress.",
        severity: "error",
      });
      console.error("Error updating progress:", error);
    }
  };

  const handleClose = () => setOpen(false);
  const handleCloseUpdate = () => setOpenUpdate(false);
  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <div>
      <h1>Crop Planning Manager</h1>
      <p>
        Record your land details and planting plans to track your farming
        progress from start to harvest.
      </p>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add New Planting
      </Button>

      {/* Snackbar for alerts */}
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

      {/* Table for displaying farmer statistics */}
      <div>
        <h2>Farmer Statistics</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>Crop Name</TableCell>
                <TableCell>Hectare</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {farmerStatistics.length > 0 ? (
                farmerStatistics.map((stat, index) => (
                  <TableRow key={stat.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {stat.cropsStatistic?.crop?.name || "N/A"}
                    </TableCell>
                    <TableCell>{stat.perch || "N/A"}</TableCell>
                    <TableCell>
                      {stat.cropsStatistic?.year?.year || "N/A"}
                    </TableCell>
                    <TableCell>{stat.month?.month || "N/A"}</TableCell>
                    <TableCell>{stat.progress?.name || "N/A"}</TableCell>
                    <TableCell>
                      {stat.progressId === 1 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleUpdate(stat)}
                        >
                          Update Progress
                        </Button>
                      ) : (
                        <span>Progress cannot be updated</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Modal for creating farmer statistics */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>Start Farming</h2>

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                error={!!errors.selectedYear}
              >
                {years.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Crop</InputLabel>
              <Select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                error={!!errors.selectedCrop}
              >
                {crops.length > 0 ? (
                  crops.map((crop) => (
                    <MenuItem key={crop.cropId} value={crop.cropsStatisticsId}>
                      {crop.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No crops available</MenuItem>
                )}
              </Select>
              {errors.selectedCrop && (
                <p className="error">{errors.selectedCrop}</p>
              )}
            </FormControl>

            <TextField
              label="Perch Size"
              value={perch}
              onChange={(e) => setPerch(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.perch}
              helperText={errors.perch}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Harvest Month</InputLabel>
              <Select
                value={harvestMonth}
                onChange={(e) => setHarvestMonth(e.target.value)}
                error={!!errors.harvestMonth}
              >
                {months.map((month) => (
                  <MenuItem key={month.id} value={month.id}>
                    {month.month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Modal for updating progress */}
      <Modal open={openUpdate} onClose={handleCloseUpdate}>
        <Box sx={modalStyle}>
          <h2>Update Progress</h2>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Progress</InputLabel>
            <Select
              value={selectedProgress}
              onChange={(e) => setSelectedProgress(e.target.value)}
            >
              {progressOptions.length > 0 ? (
                progressOptions
                  .filter((progress) => progress.id !== 1) // Filter out progress with ID 1
                  .map((progress) => (
                    <MenuItem key={progress.id} value={progress.id}>
                      {progress.name}
                    </MenuItem>
                  ))
              ) : (
                <MenuItem disabled>No progress options available</MenuItem>
              )}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitUpdate}
            fullWidth
          >
            Update Progress
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default FarmManager;
