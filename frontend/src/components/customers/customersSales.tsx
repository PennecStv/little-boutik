import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Sale {
  sale_id: number;
}

export const CustomerSales: React.FC = () => {
  const { customerId } = useParams();
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/customer/${customerId}/sales`)
      .then(response => response.json())
      .then(data => setSales(data))
      .catch(error => console.error('Error fetching sales:', error));
  }, [customerId]);

  return (
    <div>
      <h1>Sales for Customer {customerId}</h1>
      <ul>
        {sales.map((sale) => (
          <li key={sale.sale_id}>
            {sale.sale_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerSales;