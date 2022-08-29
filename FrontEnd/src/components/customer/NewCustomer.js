import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { addCustomers } from "../../api";
const NewCustomer = () => {
  const router = useRouter();
  const [data, setData] = useState({
    type: 1,
    company_name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    country: "",
    id: "",
    password: "",
    password2: "",
    comment: "",
  });
  const state = { vertical: "top", horizontal: "center" };
  const { vertical, horizontal } = state;
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.password2) {
      setError("Passwords do not match");
      setOpen(true);
      return;
    }
    if (
      !data.company_name ||
      !data.address ||
      !data.city ||
      !data.phone ||
      !data.email ||
      !data.country ||
      !data.id ||
      !data.password ||
      !data.password2
    ) {
      setError("Please enter all fields");
      setOpen(true);
      return;
    }
    try {
      const response = await addCustomers(data);
      console.log(response);
      setError("");
      setOpen(false);
      router.push("/customers");
    } catch (error) {
      const response = error.response;
      console.log(response);
      setError(response.data.detail);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Box  sx={
      {
        zIndex: "99999999",
      }
    }>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={3000}
        key={vertical + horizontal}
        onClose={handleClose}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            id="outlined-basic"
            label="Email"
            fullWidth
            variant="outlined"
            value={data.email}
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Company Name"
            variant="outlined"
            value={data.company_name}
            onChange={(e) =>
              setData({
                ...data,
                company_name: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            value={data.password}
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Confirm Password"
            type="password"
            value={data.password2}
            onChange={(e) =>
              setData({
                ...data,
                password2: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Phone number"
            variant="outlined"
            value={data.phone}
            onChange={(e) =>
              setData({
                ...data,
                phone: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Adresse"
            variant="outlined"
            value={data.address}
            onChange={(e) =>
              setData({
                ...data,
                address: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Country"
            variant="outlined"
            value={data.country}
            onChange={(e) =>
              setData({
                ...data,
                country: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="City"
            variant="outlined"
            value={data.city}
            onChange={(e) =>
              setData({
                ...data,
                city: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={8} sm={8} md={8}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="CODE"
            variant="outlined"
            value={data.id}
            onChange={(e) =>
              setData({
                ...data,
                id: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Type"
              value={data.type}
              onChange={(e) =>
                setData({
                  ...data,
                  type: e.target.value,
                })
              }
            >
              <MenuItem value={1}>ICE</MenuItem>
              <MenuItem value={2}>IF</MenuItem>
              <MenuItem value={3}>SIRET</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Comment"
            variant="outlined"
            multiline
            rows={4}
            value={data.comment}
            onChange={(e) =>
              setData({
                ...data,
                comment: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box className="flex justify-center w-full ">
            <Box className="w-1/2">
              <Button
                color="primary"
                className="h-full"
                fullWidth
                variant="contained"
                onClick={handleSubmit}
              >
                Add Customer
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewCustomer;
