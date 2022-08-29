import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import PhoneIcon from "@mui/icons-material/Phone";
import TabletIcon from "@mui/icons-material/Tablet";
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
export const FactureChart = ({ chartData }) => {
  const theme = useTheme();
  const router = useRouter();
  const data01 = [
    { name: "Facture envoyée", value: chartData.email_sent.total_price },
    { name: "Facture echec", value: chartData.month.total_price },
    { name: "Depassement de delai", value: chartData.week.total_price },
  ];
  const RADIAN = Math.PI / 180;
  const lbl = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const devices = [
    {
      title: "Facture envoyée",
      value: chartData.email_sent.total_email_sent,
      icon: LaptopMacIcon,
      color: "#3F51B5",
    },
    {
      title: "Facture echec",
      value: chartData.month.total_facture,
      icon: TabletIcon,
      color: "#E53935",
    },
    {
      title: "Depassement de delai",
      value: chartData.week.total_facture,
      icon: PhoneIcon,
      color: "#FB8C00",
    },
  ];
  const COLORS = ["#3F51B5", "#E53935", "#FB8C00"];
  const handleClick = (data) => {
    console.log("data", data);

    router.push(`/facture?sort=${data.name}`);
  };
  return (
    <Card>
      <CardHeader title="Les factures" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width="100%" height="100%">
              <Pie
                data={data01}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={lbl}
                outerRadius={80}
                fill="#8884d8"
                className="cursor-pointer"
                dataKey="value"
                onClick={(e) => handleClick(e)}
              >
                {data01.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
          }}
        >
          {devices.map(({ color, icon: Icon, title, value }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: "center",
              }}
            >
              <Icon color="action" />
              <Typography color="textPrimary" variant="body1">
                {title}
              </Typography>
              <Typography style={{ color }} variant="h4">
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
