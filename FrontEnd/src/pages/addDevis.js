import { Alert, Box, Container, Snackbar } from "@mui/material";
import jwt from "jwt-decode"; // import dependency
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { addDevis } from "../api";
import { DashboardLayout } from "../components/dashboard-layout";
import NewDevis from "../components/devis/new-devis";

const AddDevi = () => {
  const router = useRouter();
  const [object, setobject] = useState("");
  const [design, setdesign] = useState("");
  const [quantity, setquantity] = useState(0);
  const [unity, setunity] = useState("");
  const [price, setprice] = useState(0);
  const [customer, setCustomer] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const state = { vertical: "top", horizontal: "center" };
  const { vertical, horizontal } = state;
  const [remainder_date, setremainder_date] = useState(
    new Date().toLocaleString("sv-SE", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  );
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authTokens");
    const decoded = jwt(token);

    const data = {
      customer_id: customer,
      writer_email: decoded.email,
      object: object,
      designation: design,
      price: price,
      quntity: quantity,
      unit: unity,
      remainder_date: remainder_date.replace(/\//g, "-"),
      status: 1,
      email_sent: false,
    };
    if (object && design && quantity && unity && price && customer) {
      addDevis(data)
        .then((res) => {
          console.log(res);
          router.push("/devis");
        })
        .catch((err) => {
          console.log(err);
          setError("Check your data and try again");
          setOpen(true);
        });
    }
  };

  return (
    <>
      <Head>
        <title>Add Devis</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={3000}
          key={vertical + horizontal}
          onClose={handleClose}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <Container maxWidth={false}>
          {/* <CustomerListToolbar /> */}
          <div className="container max-w-4xl mx-auto pt-16 md:pt-32 text-center break-normal">
            <NewDevis
              setobject={setobject}
              setdesign={setdesign}
              setquantity={setquantity}
              setunity={setunity}
              setprice={setprice}
              setCustomer={setCustomer}
              handleSubmit={handleSubmit}
              setremainder_date={setremainder_date}
              remainder_date={remainder_date}
            />
          </div>
        </Container>
      </Box>
    </>
  );
};
AddDevi.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AddDevi;
