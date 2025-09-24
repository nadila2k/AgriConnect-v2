import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box
} from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const crops = [
  "Beans", "Carrot", "Cabbage", "Tomato",
  "Brinjal", "Pumpkin", "Snake Gourd", "Green Chilli", "Lime"
];

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function PricePrediction() {
  const [date, setDate] = useState(getToday());
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPredictions = async (selectedDate) => {
    setLoading(true);
    setResults([]);
    const allPredictions = [];

    for (const crop of crops) {
      try {
        const res = await fetch('http://localhost:5003/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: crop, date: selectedDate })
        });
        const data = await res.json();
        allPredictions.push({ product: crop, ...data.predictions });
      } catch {
        allPredictions.push({ product: crop, error: 'Prediction failed' });
      }
    }

    setResults(allPredictions);
    setLoading(false);
  };

  useEffect(() => {
    fetchPredictions(date);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    fetchPredictions(date);
  };

  const chartData = {
    labels: results.map(r => r.product),
    datasets: [
      {
        label: 'Farm Price (LKR/kg)',
        data: results.map(r => r.farmprice || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Retail Pettah (LKR/kg)',
        data: results.map(r => r.retailpricepettah || 0),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
      {
        label: 'Retail Dambulla (LKR/kg)',
        data: results.map(r => r.retailpricedambulla || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `LKR ${context.raw.toFixed(2)} / kg`
        }
      },
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Crop Price Predictions (${date})`
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ccffcc', // light green for whole page
        py: 4, // vertical padding
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Crop Price Prediction
          </Typography>

          <form
            onSubmit={submit}
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}
          >
            <TextField
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || !date}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Predict All Crops'}
            </Button>
          </form>

          {results.length > 0 && (
            <>
              <Bar data={chartData} options={chartOptions} />
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Crop</TableCell>
                      <TableCell>Farm Price (LKR/kg)</TableCell>
                      <TableCell>Retail (Pettah, LKR/kg)</TableCell>
                      <TableCell>Retail (Dambulla, LKR/kg)</TableCell>
                      <TableCell>Avg. Spread (LKR/kg)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product}</TableCell>
                        <TableCell>{item.farmprice ? item.farmprice.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>{item.retailpricepettah ? item.retailpricepettah.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>{item.retailpricedambulla ? item.retailpricedambulla.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>{item.averagespread ? item.averagespread.toFixed(2) : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
