import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Twitter,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../features/thunks/authThunk.js";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/slices/authSlice.js";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

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
  }, [user, navigate]);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();

    // Validate email and password
    if (!email || !password) {
      setAlert({
        open: true,
        message: "Please fill in all required fields",
        severity: "warning",
      });
      return;
    }
    
    if (!isValidEmail(email)) {
      setAlert({
        open: true,
        message: "Please enter a valid email address",
        severity: "warning",
      });
      return;
    }

    const payload = {
      email,
      password,
    };

    console.log("clicking");

    try {
      const resultAction = await dispatch(signIn(payload));

      if (signIn.fulfilled.match(resultAction)) {
        // Handle successful sign-in (if needed)
      } else {
        setAlert({
          open: true,
          message: resultAction.payload || "Sign-in failed. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "An error occurred. Please try again later.",
        severity: "error",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, message: "", severity: "" });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNavigateToSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f6f2",
      }}
    >
      <Box
        sx={{
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          style={{
            fontWeight: "bold",
            color: "#333333",
            marginBottom: "1.5rem",
          }}
        >
          Sign In
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSignInSubmit}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Phone number, username or email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              style: {
                borderRadius: "8px",
              },
            }}
          />
          <Box sx={{ position: "relative" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
                endAdornment: (
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    style={{ position: "absolute", right: "10px", top: "10px" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Box>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember for 30 days"
            sx={{ mb: 2 }}
          />
         `Ω
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{
              backgroundColor: "#004d40",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "0.75rem",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s, box-shadow 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#00332c")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#004d40")
            }
          >
            Sign in
          </Button>
          <Button
            fullWidth
            variant="contained"
            style={{
              marginTop: "1rem",
              backgroundColor: "#d84315",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "0.75rem",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s, box-shadow 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#bf360c")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#d84315")
            }
            onClick={handleNavigateToSignUp} // Add the onClick handler
          >
            Create New Account
          </Button>
          
        </Box>
      </Box>
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
    </Container>
  );
};

export default SignIn;
