import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";

export const TotalCustomers = ({ data }) => (
  <Card>
    <CardContent
      sx={{
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "30vh",
      }}
    >
      <Grid container spacing={3} sx={{ justifyContent: "space-between", flexDirection: "column" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            CUSTOMERS
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {data}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <PeopleIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
