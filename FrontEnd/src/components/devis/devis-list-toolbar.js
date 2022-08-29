import { Box, Button, Card, CardContent, InputAdornment, SvgIcon, TextField } from "@mui/material";
import NextLink from "next/link";
import { useState } from "react";
import { Search as SearchIcon } from "../../icons/search";
const DevisListToolbar = ({ setDevis, devis }) => {
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    if (search.length === 0) {
      return;
    }
    const searchValue = search.toLowerCase();
    const filteredDevis = devis.filter((devis) => {
      return devis.customer.toLowerCase().includes(searchValue);
    });
    setDevis(filteredDevis);
  };
  const handleChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length === 0) {
      setDevis(devis);
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
        <Box sx={{ m: 1 }}></Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box className="flex flex-row justify-between ">
              <Box className="flex flex-row">
                <TextField
                  fullWidth
                  sx={{ maxWidth: 500 }}
                  id="search"
                  label="Search"
                  value={search}
                  onChange={handleChange}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search devis"
                  variant="outlined"
                />
                <Button color="primary" cl variant="contained" onClick={handleSearch}>
                  Search
                </Button>
              </Box>
              <NextLink href="/addDevis" passHref>
                <Button color="primary" cl variant="contained">
                  Add devis
                </Button>
              </NextLink>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DevisListToolbar;
