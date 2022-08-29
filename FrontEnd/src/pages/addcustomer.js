import { Box, Container } from "@mui/material";
import Head from "next/head";
import NewCustomer from "../components/customer/NewCustomer";
import { DashboardLayout } from "../components/dashboard-layout";

const Addcustomer = () => {
  return (
    <>
      <Head>
        <title>Add Customer</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          {/* <CustomerListToolbar /> */}
          <div className="container max-w-4xl mx-auto pt-16 md:pt-32 text-center break-normal">
            <NewCustomer />
          </div>
        </Container>
      </Box>
    </>
  );
};
Addcustomer.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Addcustomer;
