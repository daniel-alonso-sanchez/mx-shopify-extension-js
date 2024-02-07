import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SubscriptionManagement from './SubscriptionManagement.jsx';
import ProductsGrid from './ProductsGrid.jsx';
import { Grid } from '@mui/material';

export default function App() {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Grid container alignItems="flex-start" justifyContent="flex-end">
          <Grid item>
            <SubscriptionManagement />
          </Grid>
        </Grid>
        <ProductsGrid />
      </Box>
    </Container>
  );
}