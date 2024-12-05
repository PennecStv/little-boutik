import React, { useEffect, useState } from 'react';

export const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch(' http://127.0.0.1:8000/customers')
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  return (
    <div>
      <h1>Customers List</h1>
      <ul>
      {customers.map((customer) => (
          <li key={customer.customers_id}>
            {customer.first_name} {customer.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;