import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import {
  AccountCircle,
  Email,
  Lock,
  Phone,
  LocationOn,
  Person,
} from "@mui/icons-material";
import { districts } from "./../../config/data";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../features/slices/authSlice";
import { signUp } from "../../features/thunks/authThunk";

// Define CSS for spinner animation
const Spinner = styled.div`
  border: 8px solid rgba(0, 0, 0, 0.1); /* Light grey background */
  border-left: 8px solid #3498db; /* Blue spinner */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const user = useSelector(selectUser);

  useEffect(() => {
    if (user.role === 0) {
      navigate("/admin");
    } else if (user.role === 1) {
      navigate("/farmer");
    } else if (user.role === 2) {
      navigate("/FertilizerVender");
    } else if (user.role === 3) {
      navigate("/MachineryVendor");
    }
  }, [navigate, user]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;


    if (
      !firstName ||
      !lastName ||
      !email ||
      !district ||
      !phoneNumber ||
      !role ||
      !password
    ) {
      setAlert({
        open: true,
        message: "Please fill in all required fields",
        severity: "warning",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      setAlert({
        open: true,
        message: "Please enter a valid email address",
        severity: "warning",
      });
      return;
    }


    if (!phoneRegex.test(phoneNumber) || isNaN(phoneNumber)) {
      setAlert({
        open: true,
        message: "Please enter a valid phone number (10 digits, numeric only)",
        severity: "warning",
      });
      return;
    }

    setLoading(true);

    const payload = {
      firstName,
      lastName,
      email,
      district,
      phoneNumber,
      role,
      password,
    };

    console.log("clicking");

    dispatch(signUp(payload));
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, message: "", severity: "" });
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
      }}
    >
      <Box
        sx={{
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "500px",
          width: "100%",
          position: "relative",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "12px",
              width: "100%",
              height: "100%",
            }}
          >
            <Spinner /> {/* Custom spinner */}
          </Box>
        )}
        <Typography
          component="h1"
          variant="h4"
          style={{
            fontWeight: "bold",
            color: "#2c3e50",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Create Your Account
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person style={{ color: "#3498db" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: "8px",
                backgroundColor: "#ecf0f1",
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle style={{ color: "#3498db" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: "8px",
                backgroundColor: "#ecf0f1",
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email style={{ color: "#3498db" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: "8px",
                backgroundColor: "#ecf0f1",
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="district"
            name="district"
            select
            label="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn style={{ color: "#3498db" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: "8px",
                backgroundColor: "#ecf0f1",
              },
            }}
          >
            {districts?.map((district) => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone style={{ color: "#3498db" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: "8px",
                backgroundColor: "#ecf0f1",
              },
            }}
          />
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend" style={{ color: "#2c3e50" }}>
              User Role
            </FormLabel>
            <RadioGroup
              row
              value={role}
              name="role"
              onChange={(e) => setRole(e.target.value)}
              sx={{ justifyContent: "space-between" }}
            >
              <FormControlLabel
                value="1"
                control={<Radio color="primary" />}
                label="Farmer"
              />
              <FormControlLabel
                value="2"
                control={<Radio color="primary" />}
                label="Fertilizer Vendor"
              />
              <FormControlLabel
                value="3"
                control={<Radio color="primary" />}
                label="Machinery Vendor"
              />
             
            </RadioGroup>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#3498db" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: "8px",
                backgroundColor: "#ecf0f1",
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#3498db",
              "&:hover": {
                backgroundColor: "#2980b9",
              },
              borderRadius: "8px",
            }}
            onClick={handleSignUpSubmit}
          >
            Sign Up
          </Button>
        </Box>
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default SignUp;

