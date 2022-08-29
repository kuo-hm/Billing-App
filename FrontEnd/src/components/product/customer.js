import { Box, Button, Card, CardContent, InputAdornment, SvgIcon, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { getCustomers } from "../../api";
import { Search as SearchIcon } from "../../icons/search";
import { CustomerListResults } from "../customer/customer-list-results";
const Customer = ({ handleClick }) => {
  const router = useRouter();
  const [search, setsearch] = useState("");
  const { isLoading, error, data } = useQuery(["customers"], getCustomers);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent className='flex flex-row justify-between'>
            <Box sx={{ width: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search Client"
                variant="outlined"
              />
            </Box>
            <Button
            color="primary"
            onClick={() => router.push("/addcustomer")}
            variant="contained"
          >
            Add new Customer
          </Button>
          </CardContent>
        </Card>
      </Box>
      
     <CustomerListResults customers={data} handleClick={handleClick} />
    </Box>
  );
};

export default Customer;
