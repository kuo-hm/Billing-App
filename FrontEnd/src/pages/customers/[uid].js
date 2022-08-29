import { Box, Button, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCustomerbyId } from "../../api";
import Comment from "../../components/customer/Comment";
import ViewCustomer from "../../components/customer/ViewCustomer";
import { DashboardLayout } from "../../components/dashboard-layout";
const CustomerView = () => {
  const router = useRouter();
  const { uid } = router.query;

  const { isLoading, error, data, isError } = useQuery(["customerById", uid], () =>
    getCustomerbyId(uid)
  );
  console.log(data)
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>CustomerView</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
        <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        m: -1,
      }}
    >
      <Box sx={{ m: 1 }}>
        {" "}
        <Typography sx={{ m: 1 }} variant="h4">
          Customer: {data?.company_name}
        </Typography>
      </Box>
    </Box>
        </Container>
        <Container maxWidth={false}>
          {/* <CustomerListToolbar /> */}
          <div className="container max-w-4xl mx-auto pt-16 md:pt-32 text-center break-normal">
            {data && <ViewCustomer customer={data} uid={uid} />}
          </div>{" "}
          <div className="container mx-auto pt-16 md:pt-32b break-normal">
            {data && <Comment comments={data.comments} />}

            <Button variant="contained" color="primary">
              Add Comment
            </Button>
          </div>
        </Container>
      </Box>
    </>
  );
};
CustomerView.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CustomerView;
