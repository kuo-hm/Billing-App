import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getDevisById } from "../../api";
import { DashboardLayout } from "../../components/dashboard-layout";
import DevisEdit from "../../components/devis/DevisEdit";

const Devi = () => {
  const router = useRouter();

  const { id } = router.query;
  const { isLoading, error, data } = useQuery(["devis", id], () => getDevisById(id), {
    enabled: !!id,
  });
  if (isLoading) return <p>Loading...</p>;
  console.log(error);
  if (error?.response.status === 404) return <p>Devis not found</p>;
  return (
    <>
      <Head>
        <title>Devis</title>
      </Head>
      <Box>
        <div className="container max-w-4xl mx-auto pt-16 md:pt-32 text-center break-normal">
          <DevisEdit data={data} />
        </div>
      </Box>
    </>
  );
};

Devi.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Devi;
