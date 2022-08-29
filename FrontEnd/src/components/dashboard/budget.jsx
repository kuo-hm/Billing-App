import MoneyIcon from "@mui/icons-material/Money";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";

export const Budget = ({ data }) => (
  <Card sx={{ height: "30vh" }}>
    <CardContent
      sx={{
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
        height: "30vh",
      }}
    >
      <Grid container spacing={3} sx={{ justifyContent: "space-between", flexDirection: "column" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            Chiffre D affaire total
          </Typography>
          <Typography color="textPrimary" variant="h4">
            <>
            {data}DH</>
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <MoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
    
    </CardContent>
  </Card>
);
