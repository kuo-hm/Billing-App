import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField,
  Typography
} from "@mui/material";
import NextLink from "next/link";
import { useState } from 'react';
import { Search as SearchIcon } from "../../icons/search";


const CustomerListToolbar = ({ setFilteredList, customers }) => {
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    if (search.length === 0) {
      return;
    }
    const searchValue = search.toLowerCase();
    const filteredFactures = customers.filter((facture) => {
      return facture.company_name.toLowerCase().includes(searchValue);
    });
    setFilteredList(filteredFactures);
  };
  const handleChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length === 0) {
      return setFilteredList(customers);
    }
    handleSearch()
  };
  return(
  <Box>
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        m: -1,
      }}
    >
      <Box sx={{ m: 1 }}>
        {" "}
        <Typography sx={{ m: 1 }} variant="h4">
          Customers
        </Typography>
      </Box>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box className="flex flex-row justify-between ">
            <TextField
              fullWidth
              sx={{ maxWidth: 500 }}
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              value={search}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon fontSize="small" color="action">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                ),
              }}
              placeholder="Search for customers"
              variant="outlined"
            />
            <NextLink href="/addcustomer" passHref>
              <Button color="primary" variant="contained">
                Add Customers
              </Button>
            </NextLink>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);}
export default CustomerListToolbar;
