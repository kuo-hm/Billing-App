import { Box, Button, ButtonGroup, Container } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDevis } from "../../api";
import { DashboardLayout } from "../../components/dashboard-layout";
import DevisListToolbar from "../../components/devis/devis-list-toolbar";
import { DevisChart } from "../../components/devis/DevisChart";
import LatestDevis from "../../components/devis/latest-devis";
const Products = () => {
  const [devis, setDevis] = useState(null);
  const [chart, setChart] = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const router = useRouter();
  const { sort } = router.query;
  useEffect(() => {
    if (!devis) {
      getDevis()
        .then((data) => {
          console.log(data.devis_chart);
          setDevis(data.devis);
          setFilteredList(data.devis);
          setChart(data.devis_chart);
          console.log(data.devis_chart);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (sort && devis) {
      console.log(sort);
      if (sort === "Validé") filterByStatus("2");
      if (sort === "Non Validé") filterByStatus("3");
      if (sort === "En Cours") filterByStatus("1");
    }
  }, [sort, devis]);
  const filterByStatus = (status) => {
    setFilteredList(devis.filter((devi) => devi.status === status));
  };
  const filterByEmailSent = (sent) => {
    setFilteredList(devis.filter((devi) => devi.email_sent === sent));
  };
  const clickHandler = (uid) => {
    router.push(`/devis/${uid}`);
  };
  return (
    <>
      <Head>
        <title>Devis</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          {devis && chart && (
            <>
              <DevisChart sx={{ height: "100%" }} chartData={chart} />
              <DevisListToolbar setDevis={setFilteredList} devis={devis} />
              <div className="flex w-full justify-center">
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                  <Button onClick={() => filterByStatus("1")}>encours</Button>
                  <Button onClick={() => filterByStatus("2")}>valide</Button>
                  <Button onClick={() => filterByStatus("3")}>not valide</Button>
                  <Button onClick={() => filterByEmailSent(true)}>email sent</Button>
                  <Button onClick={() => filterByEmailSent(false)}>email not sent</Button>
                  <Button onClick={() => setFilteredList(devis)}>Reset</Button>
                </ButtonGroup>
              </div>
              <LatestDevis data={filteredList} handleClick={clickHandler} />
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

Products.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Products;
