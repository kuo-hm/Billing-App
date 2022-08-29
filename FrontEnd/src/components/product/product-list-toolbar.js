import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useState } from "react";
import { Search as SearchIcon } from "../../icons/search";
const ProductListToolbar = ({ setFilteredList, factures }) => {
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    if (search.length === 0) {
      return;
    }
    const searchValue = search.toLowerCase();
    const filteredFactures = factures.filter((facture) => {
      return facture.customer.toLowerCase().includes(searchValue);
    });
    setFilteredList(filteredFactures);
  };
  const handleChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length === 0) {
      setFilteredList(factures);
    }
  };
  return (
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
        <Typography sx={{ m: 1 }} variant="h4">
          Factures
        </Typography>
        <Box sx={{ m: 1 }}>
          <NextLink href="/addfacture" passHref>
            <Button color="primary" variant="contained">
              Add facture
            </Button>
          </NextLink>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500, display: "flex", flexDirection: "row" }}>
              <TextField
                fullWidth
                onChange={handleChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                value={search}
                id="search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search product"
                variant="outlined"
              />{" "}
              <Button color="primary" variant="contained" onClick={handleSearch}>
                Search
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
export default ProductListToolbar;
