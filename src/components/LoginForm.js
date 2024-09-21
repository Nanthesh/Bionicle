import React from "react";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Navbar from "./Navbar";  // Import the Navbar component

const LoginForm = () => {
  const { handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <Navbar /> {/* Include the Navbar component */}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: "#f5f5f5" }}  // Optional background color
      >
        <Box
          width="100%"
          maxWidth="400px"
          p={4}
          borderRadius={2}
          boxShadow={3}
          sx={{ backgroundColor: "#fff" }}  // Optional white background for the form
        >
          {/* Form Header */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h4">Login to EcosysTech</Typography>
            <Typography color="textSecondary">
              Please enter your email and password to access your account.
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box mb={2}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Box>

            {/* Buttons */}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#6B3E99", minWidth: "120px" }}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                color="secondary"
                style={{ backgroundColor: "#5A5559", minWidth: "120px" }}
              >
                Register
              </Button>
            </Box>

            {/* Forgot Password */}
            <Box textAlign="center">
              <Link href="#" variant="body2" color="textSecondary">
                Forgot password?
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default LoginForm;
