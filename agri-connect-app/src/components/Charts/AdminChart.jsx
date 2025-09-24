import { BarChart } from "@mui/x-charts/BarChart";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import apiHelper from "./../../features/apiHelper";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import ComplexChart from "./ComplexChart";

const FarmerChart = () => {
  const [barNames, setBarNames] = useState([]);
  const [barValues, setBarValues] = useState([]);
  const [years, setYears] = useState([]); // Holds the list of years from the API
  const [progressOptions, setProgressOptions] = useState([]); // Holds the list of progress options
  const [selectedYear, setSelectedYear] = useState(null); // Store full year object (year.id and year.year)
  const [selectedProgress, setSelectedProgress] = useState(""); // Track the selected progress option
  const [markLine, setMarkLine] = useState([]);

  // Fetch years data on component mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await apiHelper("get", {
          url: "/years", // Fetch available years
        });
        console.log("Year response:", response); // Log to verify the structure
        const yearsData = response.data.years || response.data || [];
        setYears(yearsData);
        
        if (yearsData.length > 0) {
          const currentYear = yearsData[0]; // Select the first year by default
          setSelectedYear(currentYear);
        }
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    fetchYears();
  }, []);

  // Fetch progress data for the second dropdown
  useEffect(() => {
    const fetchProgressOptions = async () => {
      try {
        const progressData = await apiHelper("get", { url: "/progress" });
        console.log("Progress data:", progressData); // Log to verify the structure
        const progressOptions = progressData.data || [];
        setProgressOptions(progressOptions);

        if (progressOptions.length > 0) {
          setSelectedProgress(progressOptions[0].id); // Select the first progress option by default
        }
      } catch (error) {
        console.error("Error fetching progress options:", error);
      }
    };

    fetchProgressOptions();
  }, []);

  // Fetch chart data based on the selected year (using year.year) and progress
  useEffect(() => {
    const fetchData = async () => {
      let data = [];
      if (selectedYear?.year && selectedProgress) {
        try {
          const farmerAnalyst = await apiHelper("get", {
            url: `/analyst/adminChart?year=${selectedYear.year}&progressId=${selectedProgress}`, // Use year.year and progressId to fetch chart data
          });
          console.log("Analyst data:", farmerAnalyst); // Log the data for debugging
          data = farmerAnalyst?.data?.data;
          if (data) {
            const labelsArr = [];
            const valuesArr = [];
            const markArr = [];
            data?.forEach((element) => {
              labelsArr.push(String(element.crops_name));
              valuesArr.push(
                parseFloat(element.farmer_monthly_production).toFixed(2)
              );

              markArr.push({ cropName: element.crops_name, yearWeightEstimate: element.year_weight_estimate.toFixed(2) });
            });
            setBarNames(labelsArr);
            setBarValues(valuesArr);
            setMarkLine(markArr);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [selectedYear, selectedProgress]); // Trigger when selectedYear or selectedProgress changes

  const chartSetting = {
    yAxis: [
      {
        label: "Metric ton (T)",
      },
    ],
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-30px, 0)",
      },
    },
  };

  return (
    <Box m={2}>
      {/* Title Above the Dropdowns */}
      <Typography variant="h3" align="center" gutterBottom>
        Annual Crop Progress Overview
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        {/* Dropdown for selecting year */}
        <Grid item xs={6} md={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear ? selectedYear.year : ""}
              onChange={(e) =>
                setSelectedYear(years.find((year) => year.year === e.target.value))
              } // Store the full year object
              label="Year"
            >
              {years.map((year) => (
                <MenuItem key={year.id} value={year.year}>
                  {year.year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Dropdown for selecting progress */}
        <Grid item xs={6} md={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Progress</InputLabel>
            <Select
              value={selectedProgress}
              onChange={(e) => setSelectedProgress(e.target.value)}
              disabled={!selectedYear} // Disable progress selection if no year is selected
            >
              {progressOptions.map((progress) => (
                <MenuItem key={progress.id} value={progress.id}>
                  {progress.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <ComplexChart
          chartSetting={chartSetting}
          barNames={barNames}
          barValues={barValues}
          markLine={markLine}
        />
      </Grid>
    </Box>
  );
};

export default FarmerChart;
