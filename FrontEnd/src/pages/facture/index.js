import { Box, Button, ButtonGroup, Container } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getFactures } from "../../api";
import { DashboardLayout } from "../../components/dashboard-layout";
import FactureList from "../../components/product/FactureList";
import ProductListToolbar from "../../components/product/product-list-toolbar";

const Products = () => {
  const [filteredList, setFilteredList] = useState(null);

  const router = useRouter();
  const { sort } = router.query;

  const { isLoading, error, data, isError } = useQuery(["factures"], getFactures);

  useEffect(() => {
    if (data && !filteredList) {
      setFilteredList(data);
    }

    if (sort && data) {
      if (sort === "Facture envoyée") filterByEmailSent(true);
      if (sort === "Facture non envoyée") filterByEmailSent(false);
      if (sort === "Depassement de delai") filterByStatus("1");
      if (sort === "Facture echec") filterByStatus("2");
    }
  }, [sort, data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error :{error.message}</p>;
  }

  const filterByStatus = (status) => {
    setFilteredList(data.filter((facture) => facture.status === status));
  };
  const filterByEmailSent = (sent) => {
    setFilteredList(data.filter((facture) => facture.email_sent === sent));
  };
  const clickHandler = (uid) => {
    router.push(`/facture/${uid}`);
  };

  return (
    <>
      <Head>
        <title>Factures</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar setFilteredList={setFilteredList} factures={data} />
          <div className="flex w-full justify-center">
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button onClick={() => filterByStatus("1")}>Paye</Button>
              <Button onClick={() => filterByStatus("2")}>Non paye</Button>
              <Button onClick={() => filterByEmailSent(true)}>email sent</Button>
              <Button onClick={() => filterByEmailSent(false)}>email not sent</Button>
              <Button onClick={() => setFilteredList(data)}>Reset</Button>
            </ButtonGroup>
          </div>
          {filteredList && <FactureList data={filteredList} handleClick={clickHandler} />}
        </Container>
      </Box>
    </>
  );
};

Products.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Products;
