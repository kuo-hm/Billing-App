import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";

export const TasksProgress = ({ data }) => (
  <Card sx={{ height: "30vh" }}>
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
            DEVIS VALIDÉS
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {data}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "warning.main",
              height: 56,
              width: 56,
            }}
          >
            <InsertChartIcon />
          </Avatar>
        </Grid>
      </Grid>

    </CardContent>
  </Card>
);
