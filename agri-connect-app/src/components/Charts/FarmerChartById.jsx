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
import { useSelector } from "react-redux";
import { selectUser } from "./../../features/slices/authSlice.js";

const FarmerChartById = () => {
  const [barNames, setBarNames] = useState([]);
  const [barValues, setBarValues] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const user = useSelector(selectUser);
  const userId = user.id;

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await apiHelper("get", {
          url: "/years",
        });
        console.log("Year response:", response);
        const yearsData = response.data.years || response.data || [];
        setYears(yearsData);

        const currentYear = new Date().getFullYear().toString();

        const defaultYear = yearsData.find((year) => year.year === currentYear);
        if (defaultYear) {
          setSelectedYear(defaultYear);
        } else if (yearsData.length > 0) {
          setSelectedYear(yearsData[0]);
        }
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    fetchYears();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let data = [];
      if (selectedYear?.year) {
        try {
          const farmerAnalyst = await apiHelper("get", {
            url: `/analyst/farmerChart?year=${selectedYear.year}&userId=${userId}`,
          });
          console.log("Analyst data:", farmerAnalyst);
          data = farmerAnalyst?.data?.data;
          if (data) {
            const labelsArr = [];
            const valuesArr = [];
            data?.forEach((element) => {
              labelsArr.push(String(element.crops_name));
              valuesArr.push(
                parseFloat(element.farmer_monthly_production).toFixed(2)
              );
            });
            setBarNames(labelsArr);
            setBarValues(valuesArr);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [selectedYear, userId]);

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
    <Box m={2} sx={{ bgcolor: "#f7f7f7", borderRadius: "8px", p: 3, boxShadow: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear ? selectedYear.year : ""}
              onChange={(e) =>
                setSelectedYear(years.find((year) => year.year === e.target.value))
              }
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

        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Farmer Production Report
          </Typography>
          <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', p: 2, bgcolor: 'white' }}>
            <BarChart
              xAxis={[{ scaleType: "band", data: barNames }]}
              series={[{ data: barValues }]}
              width={1000}
              height={600}
              margin={{ left: 100 }}
              {...chartSetting}
              sx={{
                bgcolor: 'transparent', // Makes sure the chart background is transparent
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmerChartById;
