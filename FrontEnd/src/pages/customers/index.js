import { Box, Container } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { getCustomers } from "../../api";
import { CustomerListResults } from "../../components/customer/customer-list-results";
import CustomerListToolbar from "../../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
const Customers = () => {
  const router = useRouter();
  const [filterList, setfilterList] = useState([])
  const { isLoading, error, data,isSuccess } = useQuery(["customers"], getCustomers)

  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  if(isSuccess && filterList.length<=0 ) setfilterList(data)
  const clickHandler = (id) => {
    console.log(id);
    router.push(`/customers/${id}`);
  };
  return (
    <>
      <Head>
        <title>Customers</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar setFilteredList={setfilterList} customers={data} />
          <Box sx={{ mt: 3 }}>
            <CustomerListResults handleClick={clickHandler} customers={filterList} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
