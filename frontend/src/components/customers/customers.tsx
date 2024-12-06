import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Customer {
  customers_id: number;
  first_name: string;
  last_name: string;
}

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/customers')
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
            <Link to={`/customers/${customer.customers_id}`}>
              {customer.first_name} {customer.last_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;