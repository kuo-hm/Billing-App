import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCustomerDatabyId } from "../../api";
import LatestOrders from "../dashboard/latest-orders";
import LatestDevis from "../devis/latest-devis";
const ViewCustomer = ({ customer, uid }) => {
  const [devis, setDevis] = useState(false);
  const [facture, setFacture] = useState(false);
  const [ca, setCa] = useState(false);
  const { isLoading, error, data, isError } = useQuery(["userData", uid], () =>
    getCustomerDatabyId(uid)
  );

  const handleClick = (type) => {
    if (type === "devis") {
      setDevis(true);
      setFacture(false);
      setCa(false);
    }
    if (type === "facture") {
      setDevis(false);
      setFacture(true);
      setCa(false);
    }
    if (type === "ca") {
      setDevis(false);
      setFacture(false);
      setCa(true);
    }
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;
  return (
    <Box>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={4} md={4}>
          <Button
            color="primary"
            className="h-full"
            onClick={() => handleClick("devis")}
            fullWidth
            variant="contained"
          >
            Devis
          </Button>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Button
            color="primary"
            className="h-full"
            onClick={() => handleClick("ca")}
            fullWidth
            variant="contained"
          >
            Chiffre d&#x27; affaire
          </Button>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Button
            color="primary"
            className="h-full"
            onClick={() => handleClick("facture")}
            fullWidth
            variant="contained"
          >
            Facture
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          {ca && <Typography>{data.ca}</Typography>}
          {facture && <LatestOrders data={data.factures} text="Factures" />}
          {devis && <LatestDevis data={data.devis} />}
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            id="outlined-basic"
            value={customer.company_name}
            label="Username"
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            id="outlined-basic"
            value={customer.email}
            label="Email"
            fullWidth
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField
            fullWidth
            id="outlined-basic"
            value={customer.company_name}
            label="Company Name"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            fullWidth
            id="outlined-basic"
            value={customer.phone}
            label="Phone number"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Country"
            variant="outlined"
            value={customer.country}
            // onChange={(e) => setprice(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="City"
            variant="outlined"
            value={customer.city}
            // onChange={(e) => setprice(e.target.value)}
          />
        </Grid>
        <Grid item xs={8} sm={8} md={8}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="CODE"
            value={customer.id}
            variant="outlined"
            // onChange={(e) => setprice(e.target.value)}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Type"
            value={customer.type}
            variant="outlined"
            // onChange={(e) => setprice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box className="flex justify-center w-full ">
            <Box className="w-1/2">
              <Button color="primary" className="h-full" fullWidth variant="contained">
                Edit Customer
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box className="flex justify-center w-full "></Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box className=""></Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewCustomer;
