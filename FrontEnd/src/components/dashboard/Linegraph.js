import { Box, Card, CardContent, CardHeader, Divider, useTheme } from "@mui/material";
import { useState } from "react";
import { Line } from "react-chartjs-2";

export const Linegraph = ({ chartData }) => {
  const theme = useTheme();
  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },

    stacked: false,
    plugins: {
      title: {
        display: false,
        text: "",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
    },
    animation: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const data = {
    labels,
    datasets: [
      {
        label: "Devis With email sent",
        data: [
          chartData.devis_email_sent.january,
          chartData.devis_email_sent.february,
          chartData.devis_email_sent.march,
          chartData.devis_email_sent.april,
          chartData.devis_email_sent.may,
          chartData.devis_email_sent.june,
          chartData.devis_email_sent.july,
          chartData.devis_email_sent.august,
          chartData.devis_email_sent.september,
          chartData.devis_email_sent.october,
          chartData.devis_email_sent.november,
          chartData.devis_email_sent.december,
        ],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Devis validated",
        data: [
          chartData.devis_count_month.january,
          chartData.devis_count_month.february,
          chartData.devis_count_month.march,
          chartData.devis_count_month.april,
          chartData.devis_count_month.may,
          chartData.devis_count_month.june,
          chartData.devis_count_month.july,
          chartData.devis_count_month.august,
          chartData.devis_count_month.september,
          chartData.devis_count_month.october,
          chartData.devis_count_month.november,
          chartData.devis_count_month.december,
        ],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Factures validated",
        data: [
          chartData.factures_count_month.january,
          chartData.factures_count_month.february,
          chartData.factures_count_month.march,
          chartData.factures_count_month.april,
          chartData.factures_count_month.may,
          chartData.factures_count_month.june,
          chartData.factures_count_month.july,
          chartData.factures_count_month.august,
          chartData.factures_count_month.september,
          chartData.factures_count_month.october,
          chartData.factures_count_month.november,
          chartData.factures_count_month.december,
        ],
        borderColor: "rgb(53, 0, 235)",
        backgroundColor: "rgba(100, 162, 200, 0.5)",
        yAxisID: "y",
      },
    ],
  };
  const [selector, setSelector] = useState("");
  const handleChange = (event) => {
    setSelector(event.target.value);
  };
  return (
    <Card>
      <CardHeader
        // action={
        //   <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        //     <InputLabel id="demo-simple-select-standard-label">Selector</InputLabel>
        //     <Select
        //       labelId="demo-simple-select-standard-label"
        //       id="demo-simple-select-standard"
        //       value={selector}
        //       onChange={handleChange}
        //       label="Age"
        //     >
        //       <MenuItem value={10}>By months</MenuItem>
        //       <MenuItem value={20}>By years</MenuItem>
        //     </Select>
        //   </FormControl>
        // }
        title="Chiffre D'affaire"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 500,
            position: "relative",
          }}
        >
          <Line data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button>
      </Box> */}
    </Card>
  );
};
