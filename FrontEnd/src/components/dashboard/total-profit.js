import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";

export const TotalProfit = ({ data }) => (
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
            Factures payées ce mois-ci
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {data} DH
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            <AttachMoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
