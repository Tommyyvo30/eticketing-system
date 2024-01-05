import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TablePagination from "@mui/material/TablePagination";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import fetchWithAuth from "../utils/api";

const mapContainerStyle = {
  height: "400px",
  width: "1600px",
};

function ReviewTickets({ onBack }) {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("id-asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:3000/routes/tickets"
        );
        if (!response.ok) throw new Error("Failed to fetch tickets");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTickets();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const applyFilterAndSort = (tickets) => {
    return tickets
      .filter(
        (ticket) =>
          ticket.officer_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ticket.violation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.license_plate
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (ticket.address &&
            ticket.address.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        let order = sortOrder.split("-");
        let key = order[0];
        let direction = order[1] === "asc" ? 1 : -1;
        if (a[key] < b[key]) return -1 * direction;
        if (a[key] > b[key]) return 1 * direction;
        return 0;
      });
  };

  const sortedAndFilteredTickets = applyFilterAndSort(tickets).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBesNlwFe749CyepPgg2GcRnruEO4f4-cA", // ENTER API KEY
  });

  const handleAddressClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <Paper
      sx={{
        padding: "20px",
        margin: "20px",
        boxShadow: "none",
        maxHeight: "calc(100vh - 100px)",
        overflow: "auto",
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginBottom: "10px" }}
        onClick={onBack}
      >
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Review Tickets
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        placeholder="Search by officer name, violation, license plate, or address"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={handleSearchChange}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          id="sort-select"
          value={sortOrder}
          label="Sort By"
          onChange={handleSortChange}
        >
          <MenuItem value="id-asc">ID Ascending</MenuItem>
          <MenuItem value="id-desc">ID Descending</MenuItem>
          <MenuItem value="officer_name-asc">Officer Name Ascending</MenuItem>
          <MenuItem value="officer_name-desc">Officer Name Descending</MenuItem>
          <MenuItem value="violation-asc">Violation Ascending</MenuItem>
          <MenuItem value="violation-desc">Violation Descending</MenuItem>
          <MenuItem value="address-asc">Address Ascending</MenuItem>
          <MenuItem value="address-desc">Address Descending</MenuItem>
        </Select>
      </FormControl>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Officer Name</TableCell>
              <TableCell>Violation</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Amount Due</TableCell>
              <TableCell>License Plate</TableCell>
              <TableCell>Assigned User ID</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.officer_name}</TableCell>
                <TableCell>{ticket.violation}</TableCell>
                <TableCell>{ticket.details}</TableCell>
                <TableCell>{ticket.amount_due}</TableCell>
                <TableCell>{ticket.license_plate}</TableCell>
                <TableCell>{ticket.assigned_user_id}</TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleAddressClick(ticket)}
                >
                  {ticket.address}
                </TableCell>
                <TableCell>
                  {ticket.latitude ? ticket.latitude.toFixed(6) : "N/A"}
                </TableCell>
                <TableCell>
                  {ticket.longitude ? ticket.longitude.toFixed(6) : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={tickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {selectedTicket &&
        selectedTicket.latitude &&
        selectedTicket.longitude && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={14}
            center={{
              lat: selectedTicket.latitude,
              lng: selectedTicket.longitude,
            }}
          >
            <Marker
              position={{
                lat: selectedTicket.latitude,
                lng: selectedTicket.longitude,
              }}
            />
          </GoogleMap>
        )}
    </Paper>
  );
}

export default ReviewTickets;
