import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import apiHelper from "../../../features/apiHelper.js"; // Assuming this is your API helper

const CropStatistics = () => {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [years, setYears] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedCropId, setSelectedCropId] = useState("");
  const [weight, setWeight] = useState("");
  const [production, setProduction] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [statistics, setStatistics] = useState([]);

  // Update form state
  const [updateId, setUpdateId] = useState(null);
  const [updateYearId, setUpdateYearId] = useState("");
  const [updateCropId, setUpdateCropId] = useState("");
  const [updateWeight, setUpdateWeight] = useState("");
  const [updateProduction, setUpdateProduction] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yearsData = await apiHelper("get", { url: "/years" });
        const cropsData = await apiHelper("get", { url: "/crops" });
        const statsData = await apiHelper("get", { url: "/cropsStatistic" });

        setYears(yearsData.data);
        setCrops(cropsData.data);
        setStatistics(statsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdateOpen = (statistic) => {
    setUpdateId(statistic.id);
    setUpdateYearId(statistic.yearId);
    setUpdateCropId(statistic.cropsId);
    setUpdateWeight(statistic.weight);
    setUpdateProduction(statistic.production);
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setUpdateId(null);
    setUpdateYearId("");
    setUpdateCropId("");
    setUpdateWeight("");
    setUpdateProduction("");
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const validateForm = (isUpdate = false) => {
    const yearId = isUpdate ? updateYearId : selectedYearId;
    const cropId = isUpdate ? updateCropId : selectedCropId;
    const weightValue = isUpdate ? updateWeight : weight;
    const productionValue = isUpdate ? updateProduction : production;

    if (!yearId || !cropId || !weightValue || !productionValue) {
      setAlert({
        open: true,
        message: "All fields are required.",
        severity: "error",
      });
      return false;
    }

    if (isNaN(weightValue) || weightValue <= 0) {
      setAlert({
        open: true,
        message: "Weight must be a positive number.",
        severity: "error",
      });
      return false;
    }

    if (isNaN(productionValue) || productionValue <= 0) {
      setAlert({
        open: true,
        message: "Production must be a positive number.",
        severity: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await apiHelper("post", {
        url: "/cropsStatistic",
        data: {
          weight,
          production,
          cropsId: selectedCropId,
          yearId: selectedYearId,
        },
      });
      console.log("Statistic added:", response);
      setAlert({
        open: true,
        message: "Statistic added successfully!",
        severity: "success",
      });
      handleClose();

      // Refresh statistics list
      const statsData = await apiHelper("get", { url: "/cropsStatistic" });
      setStatistics(statsData.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlert({
        open: true,
        message: "Failed to add statistic.",
        severity: "error",
      });
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateForm(true)) return;

    try {
      const response = await apiHelper("put", {
        url: `/cropsStatistic/${updateId}`,
        data: {
          weight: updateWeight,
          production: updateProduction,
          cropsId: updateCropId,
          yearId: updateYearId,
        },
      });
      console.log("Statistic updated:", response);
      setAlert({
        open: true,
        message: "Statistic updated successfully!",
        severity: "success",
      });
      handleUpdateClose();

      // Refresh statistics list
      const statsData = await apiHelper("get", { url: "/cropsStatistic" });
      setStatistics(statsData.data);
    } catch (error) {
      console.error("Error updating form:", error);
      setAlert({
        open: true,
        message: "Failed to update statistic.",
        severity: "error",
      });
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        Crop Statistics Management
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
        Add, update, and review crop consumption and production data by year.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add New Statistic
      </Button>

      {/* Add Statistics Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
      >
        <Box
          sx={{
            width: 400,
            p: 3,
            bgcolor: "background.paper",
            m: "auto",
            mt: 5,
          }}
        >
          <Typography id="add-modal-title" variant="h6" component="h2">
            Add Crop Statistics
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(e.target.value)}
              label="Year"
            >
              {years.map((year) => (
                <MenuItem key={year.id} value={year.id}>
                  {year.year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="crop-label">Crop</InputLabel>
            <Select
              labelId="crop-label"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              label="Crop"
            >
              {crops.map((crop) => (
                <MenuItem key={crop.id} value={crop.id}>
                  {crop.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Consumption"
            fullWidth
            sx={{ mt: 2 }}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <TextField
            label="Production (MT)"
            fullWidth
            sx={{ mt: 2 }}
            value={production}
            onChange={(e) => setProduction(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Update Statistics Modal */}
      <Modal
        open={updateOpen}
        onClose={handleUpdateClose}
        aria-labelledby="update-modal-title"
        aria-describedby="update-modal-description"
      >
        <Box
          sx={{
            width: 400,
            p: 3,
            bgcolor: "background.paper",
            m: "auto",
            mt: 5,
          }}
        >
          <Typography id="update-modal-title" variant="h6" component="h2">
            Update Crop Statistics
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="update-year-label">Year</InputLabel>
            <Select
              labelId="update-year-label"
              value={updateYearId}
              onChange={(e) => setUpdateYearId(e.target.value)}
              label="Year"
            >
              {years.map((year) => (
                <MenuItem key={year.id} value={year.id}>
                  {year.year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="update-crop-label">Crop</InputLabel>
            <Select
              labelId="update-crop-label"
              value={updateCropId}
              onChange={(e) => setUpdateCropId(e.target.value)}
              label="Crop"
            >
              {crops.map((crop) => (
                <MenuItem key={crop.id} value={crop.id}>
                  {crop.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="consumption"
            fullWidth
            sx={{ mt: 2 }}
            value={updateWeight}
            onChange={(e) => setUpdateWeight(e.target.value)}
          />
          <TextField
            label="Production (MT)"
            fullWidth
            sx={{ mt: 2 }}
            value={updateProduction}
            onChange={(e) => setUpdateProduction(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateSubmit}
            sx={{ mt: 2 }}
          >
            Update
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ width: "100%" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          style={{ fontSize: "1rem" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Year</TableCell>
              <TableCell>Crop</TableCell>
              <TableCell>Yearly Consumption (MT)</TableCell>
              <TableCell>Production per Hectare (MT)</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statistics.map((statistic) => (
              <TableRow key={statistic.id}>
                <TableCell>
                  {years.find((year) => year.id === statistic.yearId)?.year}
                </TableCell>
                <TableCell>
                  {crops.find((crop) => crop.id === statistic.cropsId)?.name}
                </TableCell>
                <TableCell>{statistic.weight}</TableCell>
                <TableCell>{statistic.production}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateOpen(statistic)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CropStatistics;
