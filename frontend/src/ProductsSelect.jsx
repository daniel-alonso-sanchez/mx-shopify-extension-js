import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function ProductSelect() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const subscriptionId = localStorage.getItem('subscription_id');
      const response = await fetch('/api/items', {
        headers: {
          'subscription-id': subscriptionId,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoadingError(true);
    }
  };

  const handleProductChange = (event) => {
    setSelectedProductId(event.target.value);
  };

  if (loadingError) {
    return <Typography>Error loading data</Typography>;
  }

  return (
    <Box>
      <Select
        value={selectedProductId}
        onChange={handleProductChange}
        displayEmpty
        fullWidth
      >
        <MenuItem value="" disabled>
          Select a product
        </MenuItem>
        {products.map(product => (
          <MenuItem key={product.id} value={product.id}>
            {product.title}
          </MenuItem>
        ))}
      </Select>
      {selectedProductId && (
        <Box mt={2}>
          <Typography variant="h6">Selected Product Image:</Typography>
          <img src={products.find(product => product.id === selectedProductId)?.image?.src || ''} alt="Selected Product" style={{ maxWidth: '100%' }} />
        </Box>
      )}
    </Box>
  );
}

export default ProductSelect;
