import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableData } from '../../pages/AdminPage';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

interface IProps<T extends TableData> {
  tableHeaders: string[];
  tableRows: T[];
}

export default function CustomTable<T extends TableData>({
  tableHeaders,
  tableRows,
}: IProps<T>) {
  const navigate = useNavigate();
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHeaders?.map((header) => (
              <TableCell style={{ textTransform: 'uppercase' }} key={header}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows?.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.price}</TableCell>

              <TableCell>
                <Button onClick={() => navigate('/edit-products/' + row.uuid)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
