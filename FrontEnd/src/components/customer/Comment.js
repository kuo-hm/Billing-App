import { Box, Button, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { deleteCommentbyId } from "../../api";
const Comment = ({ comments }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [coment, setComent] = useState(comments);
  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Commeny</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coment.slice(0, limit).map((comment) => (
                <TableRow hover key={comment.id}>
                  <TableCell>{comment.id}</TableCell>
                  <TableCell>{comment.writer}</TableCell>
                  <TableCell>{comment.comment}</TableCell>
                  <TableCell>{comment.created_at}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        deleteCommentbyId(comment.id);
                        setComent(coment.filter((c) => c.id !== comment.id));
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default Comment;
