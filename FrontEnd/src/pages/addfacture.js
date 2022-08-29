import { Alert, Box, Container, Snackbar } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import jwt_decode from "jwt-decode";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { addFactures } from "../api";
import { DashboardLayout } from "../components/dashboard-layout";
import Facture from "../components/product/facture";
import NewFacture from "../components/product/new-facture";

const Addfacture = () => {
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
  const [cancellation_date, setCancellation_date] = useState(
    new Date().toLocaleString("sv-SE", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  );


  const { mutate, isLoading } = useMutation(addFactures, {
    onSuccess: data => {
      console.log(data);
      router.push("/facture");
    },
    onError: () => {
      console.log(err);
      setError("Check your data and try again");
      alert("Check your data and try again");
      setOpen(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries('create');
    }
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authTokens");
    const decoded = jwt_decode(token);
    const data = {
      customer_id: customer,
      writer_email: decoded.email,
      object: object,
      designation: design,
      price: price,
      quntity: quantity,
      unit: unity,
      cancellation_date: cancellation_date.replace(/\//g, "-"),
      status: 2,
      email_sent: false,
    };
    console.log(data);
    
    if (object && design && quantity && unity && price && customer) {
      mutate(data)
    }
  };

  return (
    <>
      <Head>
        <title>Add Facture</title>
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
            <NewFacture
              setobject={setobject}
              setdesign={setdesign}
              setquantity={setquantity}
              setunity={setunity}
              setprice={setprice}
              setCustomer={setCustomer}
              handleSubmit={handleSubmit}
              setCancellation_date={setCancellation_date}
              cancellation_date={cancellation_date}
              isLoading={isLoading} 
            />
          </div>
        </Container>
        <Container maxWidth={false}>
          <div className="container max-w-4xl mx-auto pt-16 md:pt-32 break-normal">
            <Facture
              object={object}
              design={design}
              quantity={quantity}
              unity={unity}
              customer={customer}
              price={price}
            />
          </div>
        </Container>
      </Box>
    </>
  );
};
Addfacture.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Addfacture;
