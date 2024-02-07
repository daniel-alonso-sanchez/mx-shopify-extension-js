import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

function SubscriptionManagement() {
  const [open, setOpen] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState('');

  // Function to open the dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle change in the text field
  const handleChange = (event) => {
    setSubscriptionId(event.target.value);
  };

  // Function to save the subscription_id to localStorage
  const handleSave = () => {
    localStorage.setItem('subscription_id', subscriptionId);
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Manage subscription
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Subscription ID</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="subscription_id"
            label="Subscription ID"
            type="text"
            fullWidth
            value={subscriptionId}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SubscriptionManagement;
