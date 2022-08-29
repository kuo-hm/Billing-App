import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getFacturesById } from "../../api";
import { DashboardLayout } from "../../components/dashboard-layout";
import FactureEdit from "../../components/product/FactureEdit";

const Products = () => {
  const router = useRouter();

  const { id } = router.query;
  const { isLoading, error, data } = useQuery(["facture", id], () => getFacturesById(id), {
    enabled: !!id,
  });
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <Head>
        <title>Factures</title>
      </Head>
      <Box>
        <div className="container max-w-4xl mx-auto pt-16 md:pt-32 text-center break-normal">
          <FactureEdit data={data} />
        </div>
      </Box>
    </>
  );
};

Products.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Products;
