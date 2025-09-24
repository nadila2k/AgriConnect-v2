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
  const [markLine, setMarkLine] = useState([]);
  const [years, setYears] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("");

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await apiHelper("get", {
          url: "/years",
        });
        const yearsData = response.data.years || response.data || [];
        setYears(yearsData);

        if (yearsData.length > 0) {
          const currentYear = yearsData[0];
          setSelectedYear(currentYear);

          const cropsResponse = await apiHelper("get", {
            url: `/cropsStatistic/cropsByYear/${currentYear.id}`,
          });
          const cropsData = cropsResponse.data.crops || cropsResponse.data || [];
          setCrops(cropsData);

          if (cropsData.length > 0) {
            setSelectedCrop(cropsData[0].cropId);
          }
        }
      } catch (error) {
        console.error("Error fetching years or crops:", error);
      }
    };

    fetchYears();
  }, []);

  useEffect(() => {
    const fetchCrops = async () => {
      if (selectedYear?.id) {
        try {
          const response = await apiHelper("get", {
            url: `/cropsStatistic/cropsByYear/${selectedYear.id}`,
          });
          const cropsData = response.data.crops || response.data || [];
          setCrops(cropsData);

          if (cropsData.length > 0) {
            setSelectedCrop(cropsData[0].cropId);
          }
        } catch (error) {
          console.error("Error fetching crops:", error);
        }
      } else {
        setCrops([]);
      }
    };

    fetchCrops();
  }, [selectedYear]);

  useEffect(() => {
    const fetchData = async () => {
      let data = [];
      if (selectedYear?.year && selectedCrop) {
        try {
          const farmerAnalyst = await apiHelper("get", {
            url: `/analyst?year=${selectedYear.year}&cropsId=${selectedCrop}`,
          });
          data = farmerAnalyst?.data?.data;
          if (data) {
            const labelsArr = [];
            const valuesArr = [];
            data?.forEach((element) => {
              labelsArr.push(String(element.month));
              valuesArr.push(
                parseFloat(element.farmer_monthly_production).toFixed(2)
              );
            });
            setBarNames(labelsArr);
            setBarValues(valuesArr);
            let displayValue = (data[0]?.year_weight_estimate / 12).toFixed(2);
            setMarkLine([{ cropName: displayValue, yearWeightEstimate: displayValue }]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [selectedYear, selectedCrop]);

  const chartSetting = {
    yAxis: [
      {
        label: "Metric ton (T)",
      },
    ],
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-40px, 0)",
      },
    },
  };

  return (
    <Box m={2}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={6} sm={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel style={{ fontSize: '1.2rem', color: '#444' }}>Year</InputLabel>
            <Select
              value={selectedYear ? selectedYear.year : ""}
              onChange={(e) =>
                setSelectedYear(years.find((year) => year.year === e.target.value))
              }
              label="Year"
              style={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              {years.map((year) => (
                <MenuItem key={year.id} value={year.year}>
                  {year.year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel style={{ fontSize: '1.2rem', color: '#444' }}>Crop</InputLabel>
            <Select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              disabled={!selectedYear}
              label="Crop"
              style={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              {crops.map((crop) => (
                <MenuItem key={crop.id} value={crop.cropId}>
                  {crop.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h3" style={{ fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' }}>
            Farmer Production Decision-Making Chart
          </Typography>
          <ComplexChart
            chartSetting={chartSetting}
            barNames={barNames}
            barValues={barValues}
            markLine={markLine}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmerChart;
