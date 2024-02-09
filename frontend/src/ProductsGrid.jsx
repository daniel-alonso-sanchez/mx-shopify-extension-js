import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import * as React from 'react';

function ProductsGrid() {
  const [rows, setRows] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

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
      setRows(data.products);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error loading');
    }
  };

  const handleRowClick = (params) => {
    const id = params.row.id;
    setSelectedItemId(id);
    const selectedItem = rows.find((item) => item.id === id);
    setSelectedItem(selectedItem);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItemId(null);
    setSelectedItem(null);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'productType', headerName: 'Product Type', width: 150 },
    { field: 'updatedAt', headerName: 'Updated At', width: 200 },
    { field: 'tags', headerName: 'Tags', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
  ];

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Grid container alignItems="flex-start" justifyContent="flex-end">
          <Grid item>
            <div style={{ width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                onRowClick={handleRowClick}
              />
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Item Details</DialogTitle>
                <DialogContent>
                  {selectedItem && (
                    <div>
                      <Typography>ID: {selectedItem.id}</Typography>
                      <Typography>Title: {selectedItem.title}</Typography>
                      <Typography>Product Type: {selectedItem.productType}</Typography>
                      <Typography>Updated At: {selectedItem.updatedAt}</Typography>
                      <Typography>Tags: {selectedItem.tags}</Typography>
                      <Typography>Status: {selectedItem.status}</Typography>
                      {selectedItem.image && (
                        <img src={selectedItem.image.src} alt="Item Image"
                             style={{ maxWidth: '100%', marginTop: 10 }} />
                      )}
                    </div>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ProductsGrid;
