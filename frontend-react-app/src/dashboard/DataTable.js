import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const DataTable = (props) => {
  return (
    <Grid item container>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "55vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Weight</TableCell>
                <TableCell align="left">Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.filteredData.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" sx={{ pl: 3 }}>
                    {row.formattedDate}
                  </TableCell>
                  <TableCell align="left" sx={{ pl: 3 }}>
                    {row.formattedWeight}
                  </TableCell>
                  <TableCell align="left" sx={{ pl: 3 }}>
                    {row.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
};
export default DataTable;
