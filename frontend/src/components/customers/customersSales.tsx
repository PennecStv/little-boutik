import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { IconButton, CircularProgress, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Sale {
  sale_id: number;
  product_name: string;
  amount: number;
  completed_at: string;
  total: number;
  currency: string;
}

const columns: GridColDef[] = [
  { field: 'sale_id', headerName: 'Sale ID', width: 200 },
  { field: 'created_at', headerName: 'Created At', width: 200 },
  { field: 'completed_at', headerName: 'Completed At', width: 200 },
  { field: 'currency', headerName: 'Currency', width: 150 },
  { field: 'total', headerName: 'Total', width: 150 },
];

const paginationModel = { page: 0, pageSize: 5 };

export const CustomerSales: React.FC = () => {
  const { customerId } = useParams();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/customer/${customerId}/sales`)
      .then(response => response.json())
      .then(data => {setSales(data); setLoading(false);})
      .catch(error => {console.error('Error fetching sales:', error); setLoading(false);});
  }, [customerId]);
  
  return (
    <div>
      <IconButton aria-label='back' onClick={() => navigate('/customers')}>
        <ArrowBackIcon />
      </IconButton>
      <h1>Sales for Customer {customerId}</h1>
      <Paper sx={{ height: 400, width: 900 }}>
      {loading ? (
        <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
      ) : (
          <DataGrid 
            rows={sales} 
            columns={columns} 
            getRowId={(row) => row.sale_id}
            initialState={{ pagination: { paginationModel } }}
            sx={{ border: 0 }} 
          />
        )}
        </Paper>
    </div>
  );
};

export default CustomerSales;