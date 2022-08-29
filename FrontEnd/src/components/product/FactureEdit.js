import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { editFactures } from "../../api";
import pdfDownload from "../../api/facutres/pdfDownload";
import sendEmail from "../../api/facutres/sendEmail";

const FactureEdit = ({ data }) => {
  const [facture, setFacture] = useState(data);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  console.log(facture);
  const handleEmail = () => {
    const data={
      id: facture.id,
      title: facture.object,
      tva: facture.tva,
      name: facture.customer,
      total: facture.total_price,
    }
    sendEmail(data).then(() => {
    setFacture({ ...facture, email_sent: true });
    }).catch(error => {
      console.log(error);
    }
    );
  }
  const handlePDF = () => {
    const data={
      id: facture.id
    }
    pdfDownload(facture.id).then(() => {
    }).catch(error => {
      console.log(error);
    }
    );
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    editFactures(facture)
      .then((data) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setError("Erreur lors de la modification de la facture");
        setOpen(true);
      });
    // wait 3 seconds and close the modal
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  return (
    <Box>
      <div
        id="toast-success"
        className={
          "flex items-center p-4 mb-4 w-full max-w-xs text-white rounded-lg shadow dark:white dark:shadow-none " +
          (error ? "bg-error-400 " : "bg-success-400 ") +
          (open ? " " : "hidden ")
        }
        role="alert"
      >
        <div
          className={
            "inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg " +
            (error
              ? "text-red-500 bg-red-100  dark:bg-red-800 dark:text-red-200"
              : "text-green-500 bg-green-100  dark:bg-green-800 dark:text-green-200")
          }
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {error ? (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            )}
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">
          {error ? error : "Item moved successfully."}{" "}
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-success"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          <span className="sr-only">Close</span>
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={12} sm={12} md={12}>
          <Typography variant="h6">{facture.customer}</Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            id="outlined-basic"
            value={facture.object}
            label="Object"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setFacture({ ...facture, object: e.target.value })}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            id="outlined-basic"
            value={facture.designation}
            defaultValue={facture.designation}
            label="Designation"
            fullWidth
            variant="outlined"
            type={"number"}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setFacture({ ...facture, designation: e.target.value })}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            value={facture.prix}
            label="Prix"
            variant="outlined"
            type={"number"}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setFacture({ ...facture, prix: parseInt(e.target.value) })}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Quantité"
            variant="outlined"
            type={"number"}
            InputLabelProps={{
              shrink: true,
            }}
            value={facture.quantity}
            onChange={(e) => setFacture({ ...facture, quantity: e.target.value })}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Unit"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={facture.unit}
            onChange={(e) => setFacture({ ...facture, unit: e.target.value })}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="tva"
            variant="outlined"
            type={"number"}
            InputLabelProps={{
              shrink: true,
            }}
            value={facture.prix * facture.quantity * 0.2}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ttc"
            value={facture.prix * facture.quantity * 0.2 + facture.prix * facture.quantity}
            variant="outlined"
            type={"number"}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Total price"
            value={facture.prix * facture.quantity}
            variant="outlined"
            type={"number"}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={facture.status}
              label="Status"
              onChange={(e) => setFacture({ ...facture, status: e.target.value })}
            >
              <MenuItem value={"1"}>Payé</MenuItem>
              <MenuItem value={"2"}>Non payé</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Cancellation date"
              inputFormat="MM-dd-yyyy"
              value={facture.cancellation_date}
              onChange={(date) =>
                setFacture({
                  ...facture,
                  cancellation_date: date.toLocaleDateString("sv-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                })
              }
              renderInput={(params) => <TextField fullWidth  {...params} />}
            />{" "}
          </LocalizationProvider>
        </Grid>
        {!facture.email_sent && (
          <Grid item xs={6} sm={6} md={6}>
             <Button
                color="primary"
                fullWidth
                onClick={handleEmail}
                variant="outlined"
              >
                Send Email
              </Button>
          </Grid>
        )}
                 <Grid item xs={6} sm={6} md={6}>
             <Button
                color="primary"
                fullWidth
                onClick={handlePDF}
                variant="outlined"
              >
                Download PDF
              </Button>
          </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box className="flex justify-center w-full ">
            <Box className="w-1/2">
              <Button
                color="primary"
                className="h-full"
                fullWidth
                onClick={handleSubmit}
                variant="contained"
              >
                Edit facture
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box className="flex justify-center w-full "></Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box className=""></Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FactureEdit;
