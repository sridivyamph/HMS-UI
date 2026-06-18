import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { receptionLoginCall } from "../../../Redux/Modules/Reception/ReceptionThunk";
import Logo from "../../../assets/Logo.svg";
import { useNavigate } from "react-router-dom";
import {
  updateReceptionLogin,
  updateReceptionTokenAction,
} from "../../../Redux/Modules/Reception/ReceptionSlice";

const ReceptionLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const receptionLoginResponse = useSelector((state) => state.reception);
  const isLoginError = useSelector((state) => state.reception?.isErrorFound);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const { appConfig } = useSelector((state) => state.auth);
  const hospitalId = appConfig?.hospitalId;
  useEffect(() => {
    if (
      !receptionLoginResponse?.isLoading &&
      receptionLoginResponse?.isNavigate
    ) {
      try {
        navigate("/reception/dashboard");
        localStorage.setItem("isReceptionLogin", true);
      } catch (error) {}
    }
  }, [receptionLoginResponse?.isLoginSuccess]);
  const LoginAction = () => {
    if (username && password !== "") {
      dispatch(
        receptionLoginCall(hospitalId, {
          username: username,
          password: password,
        })
      );
      setValidationError(false);
    } else {
      setValidationError(true);
    }
  };
  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          height: "calc(100vh - 64px)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <img src={Logo} alt="Logo" style={{ width: 100, marginBottom: 16 }} />
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isLoginError && (
            <Typography variant="h5" gutterBottom>
              Error Found
            </Typography>
          )}
          {validationError && (
            <Typography variant="h8" color={"red"} gutterBottom>
              Please enter the required fields
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => LoginAction()}
          >
            Login
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ReceptionLogin;
