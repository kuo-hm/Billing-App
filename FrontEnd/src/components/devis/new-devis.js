import { Box, Button, Grid, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import Customer from "../product/customer";

const NewDevis = ({
  setprice,
  setobject,
  setdesign,
  setquantity,
  setunity,
  setCustomer,
  handleSubmit,
  setremainder_date,
  remainder_date,
}) => {
  const [choose, setchoose] = useState(false);
  const [email, setemail] = useState(null);

  const handleClick = (cust, name) => {
    setCustomer(cust);
    setemail(name);
    setchoose(false);
    console.log(name);
  };
  return (
    <Box>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={4} md={4}>
          <Button
            color="primary"
            className="h-full"
            onClick={() => setchoose(!choose)}
            fullWidth
            variant="contained"
          >
            Choose Customer
          </Button>
        </Grid>

        {choose && (
          <Grid item xs={12} sm={12} md={12}>
            <Customer handleClick={handleClick} />
          </Grid>
        )}
        {email && (
          <Grid item xs={12} sm={12} md={12}>
            {" "}
            {email}
          </Grid>
        )}

        <Grid item xs={12} sm={12} md={12}>
          <TextField
            id="outlined-basic"
            label="Objet"
            fullWidth
            variant="outlined"
            onChange={(e) => setobject(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            id="outlined-basic"
            multiline
            rows={4}
            label="Désignation"
            fullWidth
            variant="outlined"
            onChange={(e) => setdesign(e.target.value)}
          />
        </Grid>

        <Grid item xs={8} sm={8} md={8}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Quantité"
            variant="outlined"
            onChange={(e) => setquantity(e.target.value)}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Unité"
            variant="outlined"
            onChange={(e) => setunity(e.target.value)}
          />
        </Grid>
        <Grid item xs={8} sm={8} md={8}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Prix"
            variant="outlined"
            onChange={(e) => setprice(e.target.value)}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Remainder date"
              inputFormat="MM-dd-yyyy"
              value={remainder_date}
              onChange={(date) =>
                setremainder_date(
                  date.toLocaleDateString("sv-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                )
              }
              renderInput={(params) => <TextField {...params} />}
            />{" "}
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            color="primary"
            className="h-full"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            Add devis
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewDevis;
