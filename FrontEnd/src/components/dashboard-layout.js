import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { refreshToken } from "../api";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  // flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  // [theme.breakpoints.up("lg")]: {
  //   paddingLeft: 280,
  // },
}));

export const DashboardLayout = (props) => {
  const router = useRouter();
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      refreshToken(localStorage.getItem("x-refresh-token"))
        .then((res) => {
          const { access, refresh } = res;
          localStorage.setItem("authTokens", access);
          localStorage.setItem("x-refresh-token", refresh);
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem("authTokens");
          localStorage.removeItem("x-refresh-token");
          router.push("/login");
        });
    }, 1000 * 60 * 60 * 1);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            // flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </>
  );
};
