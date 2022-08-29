import { Alert, Box, Button, Container, Snackbar, TextField } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { login } from "../../api";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const state = { vertical: "top", horizontal: "center" };
  const { vertical, horizontal } = state;
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(process.env.HOST)
    if (!email || !password) {
      setError("Please enter your email and password");
      setOpen(true);
      return;
    }
    try {
      setLoading(true);
      login(email, password)
        .then((response) => {
          const { access, refresh } = response;
          localStorage.setItem("authTokens", access);
          localStorage.setItem("x-refresh-token", refresh);
          setError("");
          setOpen(false);
          router.push("/");
        })
        .catch((error) => {
          // const response = error.response;
          // const status_code = response.status;
          // console.log(response);
          // setLoading(false);
          // if (status_code.toString() === "401") {
          //   setError("Invalid email or password");
          // }
          // if (status_code.toString() === "500") {
          //   setError("Internal server error");
          // }
          console.log(error);
          setOpen(true);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={3000}
            key={vertical + horizontal}
            onClose={handleClose}
          >
            <Alert severity="error">{error}</Alert>
          </Snackbar>
          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            value={email}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            variant="outlined"
          />
          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              fullWidth
              size="large"
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
            >
              Sign In Now
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Login;
