import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Tabs,
  Tab,
  Slider,
  Button,
  Paper,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlaceIcon from "@mui/icons-material/Place";
import TimelineIcon from "@mui/icons-material/Timeline";
import OpacityIcon from "@mui/icons-material/Opacity";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import WarningIcon from "@mui/icons-material/Warning";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
} from "recharts";



// ---- THEME (no Tailwind) ---------------------------------------------------
const theme = createTheme({
  palette: {
    primary: { main: "#2E7D32" }, // deep green
    secondary: { main: "#0277BD" }, // sky blue
    warning: { main: "#F57C00" }, // orange
    info: { main: "#0288D1" },
    success: { main: "#388E3C" },
    background: { default: "#f5f5f5", paper: "#fafafa" },
  },
  typography: {
    fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`,
    h5: { fontWeight: 800 },
    subtitle1: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          background: "#fafafa",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTabs: {
      styleOverrides: { root: { paddingLeft: 8, paddingRight: 8 } },
    },
  },
});

// ---- Helpers ----------------------------------------------------------------
const prettyNum = (n, d = 1) =>
  n === null || n === undefined || Number.isNaN(n) ? "—" : Number(n).toFixed(d);

// Chart color palette (consistent, accessible)
const chartColors = {
  temp: "#E53935",
  rh: "#1E88E5",
  precip: "#42A5F5",
  et0: "#F9A825",
  wind: "#7E57C2",
  soilTemp: "#8D6E63",
  soilMoist: "#2E7D32",
  vpd: "#FB8C00",
  rainBar: "#64B5F6",
  et0Bar: "#FFD54F",
  needBar: "#81C784",
};

// ---- Minimal, curated city list (no online geocoding). ----------------------
const CITY_DB = [
  { name: "Colombo, Sri Lanka", lat: 6.9271, lon: 79.8612, elev: 13 },
  { name: "Kandy, Sri Lanka", lat: 7.2906, lon: 80.6336, elev: 500 },
  { name: "Galle, Sri Lanka", lat: 6.0535, lon: 80.221, elev: 12 },
  { name: "Jaffna, Sri Lanka", lat: 9.6615, lon: 80.0255, elev: 5 },
  { name: "Anuradhapura, Sri Lanka", lat: 8.3114, lon: 80.4037, elev: 81 },
  { name: "Trincomalee, Sri Lanka", lat: 8.5874, lon: 81.2152, elev: 7 },
  { name: "Batticaloa, Sri Lanka", lat: 7.717, lon: 81.7, elev: 4 },
  { name: "Matara, Sri Lanka", lat: 5.9549, lon: 80.554, elev: 10 },
  { name: "Kurunegala, Sri Lanka", lat: 7.4863, lon: 80.362, elev: 116 },
  { name: "Ratnapura, Sri Lanka", lat: 6.6828, lon: 80.399, elev: 75 },
  { name: "Badulla, Sri Lanka", lat: 6.9897, lon: 81.056, elev: 680 },
  { name: "Nuwara Eliya, Sri Lanka", lat: 6.9497, lon: 80.7891, elev: 1868 },
  { name: "Polonnaruwa, Sri Lanka", lat: 7.9385, lon: 81.0027, elev: 54 },
  { name: "Hambantota, Sri Lanka", lat: 6.1248, lon: 81.1185, elev: 20 },
  { name: "Ampara, Sri Lanka", lat: 7.2973, lon: 81.682, elev: 15 },
  { name: "Kilinochchi, Sri Lanka", lat: 9.3961, lon: 80.3982, elev: 15 },
  { name: "Vavuniya, Sri Lanka", lat: 8.7542, lon: 80.4976, elev: 104 },
  { name: "Puttalam, Sri Lanka", lat: 8.0402, lon: 79.8394, elev: 3 },
  { name: "Negombo, Sri Lanka", lat: 7.2083, lon: 79.8358, elev: 2 },
  { name: "Monaragala, Sri Lanka", lat: 6.871, lon: 81.348, elev: 200 },
  { name: "Kalutara, Sri Lanka", lat: 6.5854, lon: 79.9607, elev: 5 },
  { name: "Gampaha, Sri Lanka", lat: 7.0882, lon: 79.9956, elev: 10 },
  { name: "Mannar, Sri Lanka", lat: 8.977, lon: 79.904, elev: 2 },
  { name: "Hatton, Sri Lanka", lat: 6.8971, lon: 80.5997, elev: 1271 },
];

// ---- Transform helpers ------------------------------------------------------
const toHourlyRows = (json) => {
  const t = json?.hourly?.time || [];
  const obj = (key) => json?.hourly?.[key] || [];
  const rows = [];
  for (let i = 0; i < t.length; i++) {
    rows.push({
      time: t[i],
      temp: obj("temperature_2m")[i],
      rh: obj("relative_humidity_2m")[i],
      precip: obj("precipitation")[i],
      wind: obj("wind_speed_10m")[i],
      st0: obj("soil_temperature_0cm")[i],
      sm01: obj("soil_moisture_0_to_1cm")[i],
      sm13: obj("soil_moisture_1_to_3cm")[i],
      sm39: obj("soil_moisture_3_to_9cm")[i],
      et0: obj("et0_fao_evapotranspiration")[i],
      vpd: obj("vapour_pressure_deficit")[i],
    });
  }
  return rows;
};

const toDailyRows = (json) => {
  const t = json?.daily?.time || [];
  const obj = (key) => json?.daily?.[key] || [];
  const rows = [];
  for (let i = 0; i < t.length; i++) {
    rows.push({
      date: t[i],
      tMin: obj("temperature_2m_min")[i],
      tMax: obj("temperature_2m_max")[i],
      rainSum: obj("rain_sum")[i],
      precipSum: obj("precipitation_sum")[i],
      et0Sum: obj("et0_fao_evapotranspiration")[i],
      windMax: obj("wind_speed_10m_max")[i],
    });
  }
  return rows;
};

// ---- UI Components ----------------------------------------------------------
const StatChip = ({ icon, label, value, unit, color = "default" }) => (
  <Chip
    icon={icon}
    label={
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          {label}
        </Typography>
        <Typography variant="subtitle1" fontWeight={800}>
          {value}
        </Typography>
        {unit && <Typography variant="caption">{unit}</Typography>}
      </Box>
    }
    color={color}
    variant="filled"
    sx={{ px: 1, py: 2, borderRadius: 2 }}
  />
);

function useOpenMeteo({
  lat,
  lon,
  forecastDays,
  pastDays,
  model = "auto",
  reloadTick,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lat == null || lon == null) return;
    const controller = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const base = "https://api.open-meteo.com/v1/forecast";
        const hourly = [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "wind_speed_10m",
          "soil_temperature_0cm",
          "soil_moisture_0_to_1cm",
          "soil_moisture_1_to_3cm",
          "soil_moisture_3_to_9cm",
          "et0_fao_evapotranspiration",
          "vapour_pressure_deficit",
        ].join(",");
        const daily = [
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_sum",
          "rain_sum",
          "et0_fao_evapotranspiration",
          "wind_speed_10m_max",
        ].join(",");
        const url =
          `${base}?latitude=${lat}&longitude=${lon}&timezone=auto&forecast_days=${forecastDays}&past_days=${pastDays}&hourly=${hourly}&daily=${daily}` +
          (model && model !== "auto" ? `&models=${model}` : "");
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [lat, lon, forecastDays, pastDays, model, reloadTick]);

  return { data, loading, error };
}

const IrrigationCard = ({ daily }) => {
  // daily: [{date, rainSum, et0Sum}]
  const last7 = daily.slice(0, 7);
  const rows = last7.map((d) => ({
    date: d.date,
    et0: d.et0Sum ?? 0,
    rain: d.rainSum ?? 0,
    need: Math.max(0, (d.et0Sum ?? 0) - (d.rainSum ?? 0)),
  }));
  const totalNeed = rows.reduce((a, b) => a + b.need, 0);
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardHeader
        title="Irrigation Need (mm)"
        subheader="Simple estimate: ET₀ − Rain (last 7 days)"
      />
      <CardContent>
        <Box sx={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                angle={-20}
                height={50}
              />
              <YAxis />
              <RTooltip formatter={(v) => prettyNum(v, 1)} />
              <Legend />
              <Bar
                dataKey="et0"
                name="ET₀ (mm)"
                fill={chartColors.et0Bar}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="rain"
                name="Rain (mm)"
                fill={chartColors.rainBar}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="need"
                name="Irrigation (mm)"
                fill={chartColors.needBar}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2} alignItems="center">
          <AgricultureIcon color="primary" />
          <Typography variant="body2">
            Total suggested irrigation over last 7 days:
          </Typography>
          <Typography variant="h6" fontWeight={800}>
            {prettyNum(totalNeed, 1)} mm
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          This is a basic indicator. For real scheduling, adjust by crop
          coefficients (Kc), soil type, and root depth.
        </Typography>
      </CardContent>
    </Card>
  );
};

const HourlyCharts = ({ rows }) => {
  // Compute shallow-layer soil moisture average (0–9 cm)
  const withSmAvg = rows.map((r) => {
    const arr = [r.sm01, r.sm13, r.sm39].filter((x) => x != null);
    const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
    return { ...r, sm09: avg };
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardHeader title="Temperature & Humidity (Hourly)" />
          <CardContent>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(d) => d.slice(5, 16)}
                    height={50}
                    angle={-20}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RTooltip formatter={(v) => prettyNum(v, 1)} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temp"
                    name="Temp (°C)"
                    dot={false}
                    stroke={chartColors.temp}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rh"
                    name="RH (%)"
                    dot={false}
                    stroke={chartColors.rh}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardHeader title="Rainfall & ET₀ (Hourly)" />
          <CardContent>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <AreaChart data={rows}>
                  <defs>
                    <linearGradient id="gPrecip" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={chartColors.precip}
                        stopOpacity={0.6}
                      />
                      <stop
                        offset="100%"
                        stopColor={chartColors.precip}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient id="gET0" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={chartColors.et0}
                        stopOpacity={0.6}
                      />
                      <stop
                        offset="100%"
                        stopColor={chartColors.et0}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(d) => d.slice(5, 16)}
                    height={50}
                    angle={-20}
                  />
                  <YAxis />
                  <RTooltip formatter={(v) => prettyNum(v, 2)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="precip"
                    name="Precip (mm)"
                    dot={false}
                    fill="url(#gPrecip)"
                    stroke={chartColors.precip}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="et0"
                    name="ET₀ (mm)"
                    dot={false}
                    fill="url(#gET0)"
                    stroke={chartColors.et0}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardHeader title="Wind Speed (Hourly)" />
          <CardContent>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(d) => d.slice(5, 16)}
                    height={50}
                    angle={-20}
                  />
                  <YAxis />
                  <RTooltip formatter={(v) => prettyNum(v, 1)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="wind"
                    name="Wind (km/h)"
                    dot={false}
                    stroke={chartColors.wind}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardHeader title="Soil Temp & Moisture (0–9 cm approx.)" />
          <CardContent>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={withSmAvg}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(d) => d.slice(5, 16)}
                    height={50}
                    angle={-20}
                  />
                  <YAxis />
                  <RTooltip formatter={(v) => prettyNum(v, 3)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="st0"
                    name="Soil Temp 0 cm (°C)"
                    dot={false}
                    stroke={chartColors.soilTemp}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="sm09"
                    name="Soil Moisture 0–9 cm (m³/m³)"
                    dot={false}
                    stroke={chartColors.soilMoist}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card variant="outlined">
          <CardHeader title="Vapour Pressure Deficit (VPD, kPa)" />
          <CardContent>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(d) => d.slice(5, 16)}
                    height={50}
                    angle={-20}
                  />
                  <YAxis domain={[0, "auto"]} />
                  <RTooltip formatter={(v) => prettyNum(v, 2)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="vpd"
                    name="VPD (kPa)"
                    dot={false}
                    stroke={chartColors.vpd}
                    strokeWidth={2}
                  />
                  <ReferenceLine
                    y={1.6}
                    strokeDasharray="4 4"
                    label="High transpiration"
                  />
                  <ReferenceLine
                    y={0.4}
                    strokeDasharray="4 4"
                    label="Low transpiration"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const DailyCharts = ({ rows }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Card variant="outlined">
        <CardHeader title="Daily Temp Range" />
        <CardContent>
          <Box sx={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(5)}
                  height={50}
                  angle={-20}
                />
                <YAxis />
                <RTooltip formatter={(v) => prettyNum(v, 1)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tMin"
                  name="Min (°C)"
                  dot={false}
                  stroke={chartColors.rh}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="tMax"
                  name="Max (°C)"
                  dot={false}
                  stroke={chartColors.temp}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={6}>
      <Card variant="outlined">
        <CardHeader title="Rain vs ET₀ (Daily)" />
        <CardContent>
          <Box sx={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(5)}
                  height={50}
                  angle={-20}
                />
                <YAxis />
                <RTooltip formatter={(v) => prettyNum(v, 1)} />
                <Legend />
                <Bar
                  dataKey="rainSum"
                  name="Rain (mm)"
                  fill={chartColors.rainBar}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="et0Sum"
                  name="ET₀ (mm)"
                  fill={chartColors.et0Bar}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12}>
      <IrrigationCard daily={rows} />
    </Grid>
  </Grid>
);

const HeaderControls = ({
  query,
  setQuery,
  selectedCity,
  setSelectedCity,
  manual,
  setManual,
  forecastDays,
  setForecastDays,
  pastDays,
  setPastDays,
  onReload,
  model,
  setModel,
}) => {
  const filtered = useMemo(() => {
    if (!query) return CITY_DB;
    const q = query.toLowerCase();
    return CITY_DB.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search city (built‑in list, no online geocoding)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Paper
              variant="outlined"
              sx={{
                mt: 1.5,
                maxHeight: 220,
                overflowY: "auto",
                borderRadius: 1.5,
              }}
            >
              {filtered.map((c) => (
                <Box
                  key={c.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1.5,
                    py: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => setSelectedCity(c)}
                >
                  <PlaceIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{c.name}</Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    {c.lat.toFixed(3)}, {c.lon.toFixed(3)}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Manual Coordinates (optional)
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              useFlexGap
              sx={{ mb: 2 }}
            >
              <TextField
                label="Latitude"
                type="number"
                value={manual.lat ?? ""}
                onChange={(e) => setManual({ ...manual, lat: e.target.value })}
                size="small"
              />
              <TextField
                label="Longitude"
                type="number"
                value={manual.lon ?? ""}
                onChange={(e) => setManual({ ...manual, lon: e.target.value })}
                size="small"
              />
              <Button
                onClick={() =>
                  setSelectedCity({
                    name: "Custom",
                    lat: parseFloat(manual.lat),
                    lon: parseFloat(manual.lon),
                  })
                }
                disabled={!manual.lat || !manual.lon}
                variant="contained"
              >
                Use
              </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>
                  Forecast Days: {forecastDays}
                </Typography>
                <Slider
                  min={1}
                  max={16}
                  value={forecastDays}
                  onChange={(_, v) => setForecastDays(v)}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>
                  Past Days: {pastDays}
                </Typography>
                <Slider
                  min={0}
                  max={14}
                  value={pastDays}
                  onChange={(_, v) => setPastDays(v)}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>
                  Weather Model
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <MenuItem value="auto">Auto (best available)</MenuItem>
                  <MenuItem value="gfs">GFS (Global)</MenuItem>
                  <MenuItem value="icon">ICON (DWD)</MenuItem>
                  <MenuItem value="ifs">IFS (ECMWF)</MenuItem>
                  <MenuItem value="ukmo">UKMO</MenuItem>
                  <MenuItem value="access-g">ACCESS‑G (Australia)</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} display="flex" alignItems="center">
                <Tooltip title="Reload data">
                  <IconButton onClick={onReload} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default function AgriWeatherDashboard() {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(CITY_DB[0]);
  const [manual, setManual] = useState({ lat: "", lon: "" });
  const [forecastDays, setForecastDays] = useState(10);
  const [pastDays, setPastDays] = useState(7);
  const [model, setModel] = useState("auto");
  const [tab, setTab] = useState(0); // 0 = Hourly, 1 = Daily
  const [reloadTick, setReloadTick] = useState(0);

  const lat = selectedCity?.lat;
  const lon = selectedCity?.lon;

  const { data, loading, error } = useOpenMeteo({
    lat,
    lon,
    forecastDays,
    pastDays,
    model,
    reloadTick,
  });

  const hourly = useMemo(() => (data ? toHourlyRows(data) : []), [data]);
  const daily = useMemo(() => (data ? toDailyRows(data) : []), [data]);

  const currentIdx = useMemo(() => {
    if (!hourly.length) return 0;
    const idx = hourly.findIndex((r) => new Date(r.time) >= new Date());
    return Math.min(hourly.length - 1, Math.max(0, idx));
  }, [hourly]);
  const current = hourly[currentIdx] || {};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Typography variant="h5" color="primary">
            🌾 AgriConnect Weather Dashboard 
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" mb={2}>
          <HeaderControls
            query={query}
            setQuery={setQuery}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            manual={manual}
            setManual={setManual}
            forecastDays={forecastDays}
            setForecastDays={setForecastDays}
            pastDays={pastDays}
            setPastDays={setPastDays}
            onReload={() => setReloadTick((x) => x + 1)}
            model={model}
            setModel={setModel}
          />
        </Box>

        <Box display="flex" justifyContent="center" mb={2}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={8}>
              <Card variant="outlined">
                <CardHeader
                  title={selectedCity?.name || "—"}
                  subheader={`Lat ${lat?.toFixed?.(3)}, Lon ${lon?.toFixed?.(
                    3
                  )}`}
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  {loading && (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{ py: 6 }}
                    >
                      <CircularProgress color="secondary" />
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        Loading weather…
                      </Typography>
                    </Stack>
                  )}
                  {error && (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ py: 2 }}
                    >
                      <WarningIcon color="error" />
                      <Typography color="error">{String(error)}</Typography>
                    </Stack>
                  )}
                  {!loading && !error && data && (
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.2}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <StatChip
                        icon={<ThermostatIcon />}
                        label="Temp"
                        value={`${prettyNum(current.temp, 1)}`}
                        unit="°C"
                        color="primary"
                      />
                      <StatChip
                        icon={<OpacityIcon />}
                        label="Humidity"
                        value={`${prettyNum(current.rh, 0)}`}
                        unit="%"
                        color="info"
                      />
                      <StatChip
                        icon={<WaterDropIcon />}
                        label="Rain (1h)"
                        value={`${prettyNum(current.precip, 2)}`}
                        unit="mm"
                        color="secondary"
                      />
                      <StatChip
                        icon={<AirIcon />}
                        label="Wind"
                        value={`${prettyNum(current.wind, 1)}`}
                        unit="km/h"
                        color="success"
                      />
                      <StatChip
                        icon={<TimelineIcon />}
                        label="ET₀ (1h)"
                        value={`${prettyNum(current.et0, 2)}`}
                        unit="mm"
                        color="warning"
                      />
                      <StatChip
                        icon={<AgricultureIcon />}
                        label="Soil T (0 cm)"
                        value={`${prettyNum(current.st0, 1)}`}
                        unit="°C"
                        color="default"
                      />
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardHeader title="Quick Tips" />
                <CardContent sx={{ pt: 0 }}>
                  <Typography variant="body2">
                    • VPD &gt; 1.6 kPa → high plant water loss; consider
                    irrigation if soil moisture is low.
                  </Typography>
                  <Typography variant="body2">
                    • Compare ET₀ vs Rain to gauge daily water requirement.
                  </Typography>
                  <Typography variant="body2">
                    • Watch wind &gt; 25 km/h for spraying — drift risk.
                  </Typography>
                  <Typography variant="body2">
                    • Soil T near 10–15 °C is critical for germination in many
                    crops.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Hourly" />
            <Tab label="Daily" />
          </Tabs>
          <Divider />
          <CardContent>
            {tab === 0 && <HourlyCharts rows={hourly} />}
            {tab === 1 && <DailyCharts rows={daily} />}
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
