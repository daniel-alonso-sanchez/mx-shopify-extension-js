import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ACTION_SET_VALUE = "changeValue";

function ProductSelect() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loadingError, setLoadingError] = useState(false);
  const [correlationId, setCorrelationId] = useState(null);
  const [productIdFromEvent, setProductIdFromEvent] = useState(null);


  useEffect(() => {
    window.addEventListener("message", async (event) => {
      if (event.data.action === 'init') {
        onInit(event.data);
      }
    })
    fetchData();

  }, []);

  function onInit(data){
    console.log (`CorrelationId: ${data.correlationId}`)
    const productIdToSelect = parseInt(data?.state?.value, 10);

    setCorrelationId(data.correlationId);
    setProductIdFromEvent(productIdToSelect);
  }
  function sendImageUrlToParent (){

    console.log(`product id: ${selectedProductId}`);
    parent.window.postMessage({
      action: ACTION_SET_VALUE,
      correlationId: correlationId,
      value: selectedProductId.toString()
    }, '*');
  }


  const fetchData = async () => {
    try {
      const response = await fetch('/api/items');

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

  useEffect(() => {
    if (productIdFromEvent && products.length > 0) {
      setSelectedProductId(productIdFromEvent.toString());
    }
  }, [productIdFromEvent, products]);

  useEffect(() => {
    if (selectedProductId !== '' && products.length > 0) {
      sendImageUrlToParent();
    }
  }, [selectedProductId, products]);

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
    </Box>
  );
}

export default ProductSelect;
