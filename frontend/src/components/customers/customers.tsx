import { Box, CircularProgress, List, ListItemButton, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Customer {
  customers_id: number;
  first_name: string;
  last_name: string;
}

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/customers')
      .then(response => response.json())
      .then(data => {setCustomers(data);setLoading(false);})
      .catch(error => {console.error('Error fetching customers:', error);setLoading(false);});
  }, []);

  const handleListItemClick = (customerId: number
  ) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <div>
      <h1>Customers List</h1>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 350,
      }}
    >
        {customers.map((customer) => (
          <ListItemButton
            key={customer.customers_id}
            onClick={() => handleListItemClick(customer.customers_id)}
          >
            <ListItemText 
              primary={
                customer.first_name || customer.last_name 
                  ? `${customer.first_name} ${customer.last_name}` 
                  : "Unknown"
              } 
            />
          </ListItemButton>
        ))}
        </List>
      )}
    </div>
  );
};

export default Customers;