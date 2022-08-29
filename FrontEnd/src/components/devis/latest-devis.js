import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { SeverityPill } from "../severity-pill";

const LatestDevis = ({ data, handleClick = () => retrun }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const [orderBy, setOrderBy] = useState("createdAt");
  const [selected, setSelected] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const handleChange = (e) => {
    setStatus(e.target.value);
  };
  return (
    <Card>
      <CardHeader title="Devis" />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Ref</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Object</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>email sent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow hover key={order.id} onClick={() => handleClick(order.id)}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.object}</TableCell>
                  <TableCell>{order.creation_date}</TableCell>
                  <TableCell>
                    <SeverityPill
                      color={
                        (order.status === "2" && "success") ||
                        (order.status === "3" && "error") ||
                        "warning"
                      }
                    >
                      {order.status === "1" && "En attente"}
                      {order.status === "2" && "Validé"}
                      {order.status === "3" && "Refusé"}
                    </SeverityPill>
                  </TableCell>

                  <TableCell>
                    <Checkbox defaultChecked checked={order.email_sent} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default LatestDevis;
