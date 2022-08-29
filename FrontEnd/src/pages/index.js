import { Box, Container, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { fetchHome } from "../api";
import { DashboardLayout } from "../components/dashboard-layout";
import { Budget } from "../components/dashboard/budget";
import LatestOrders from "../components/dashboard/latest-orders";
import { Linegraph } from "../components/dashboard/Linegraph";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { TotalProfit } from "../components/dashboard/total-profit";
import { DevisChart } from "../components/devis/DevisChart";
import { FactureChart } from "../components/product/FactureChart";
const Dashboard = () => {
  const { isLoading, error, data } = useQuery(["home"], fetchHome);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={true}>
          <Grid container sx={{ height: "30vh" }} spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget sx={{ height: "30vh" }} data={data.ca} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalProfit sx={{ height: "30vh" }} data={data.latest_month_total} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TasksProgress sx={{ height: "30vh" }} data={data.devis_valide} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalCustomers sx={{ height: "30vh" }} data={data.customers_count} />
            </Grid>

            <Grid item lg={12} md={12} xl={12} xs={12}>
              <Linegraph chartData={data.line_graph_data} />
            </Grid>
            <Grid item lg={6} md={6} xl={6} xs={12}>
              <DevisChart sx={{ height: "100%" }} chartData={data.devis_pie_chart} />
            </Grid>
            <Grid item lg={6} md={6} xl={6} xs={12}>
              <FactureChart sx={{ height: "100%" }} chartData={data.facture_pie_chart} />
            </Grid>

            <Grid item lg={12} md={12} xl={12} xs={12}>
              <LatestOrders text="Factures" data={data.facture_by_last_added} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
