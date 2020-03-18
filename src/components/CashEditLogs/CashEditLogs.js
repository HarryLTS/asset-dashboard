import React, { useState, useRef } from 'react';
import Title from './../Title/Title';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { verifyIntegerInput } from './../../common/helper';
import { ACTION_TYPES } from './../../common/constants';
import { useSelector, useDispatch } from 'react-redux';
import Delete from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import './CashEditLogs.css';

export default function CashEditLogs(props) {
  const INVALID_VALUE = "This field is invalid.";
  const [open, setOpen] = useState(false);
  const [removeLogOpen, setRemoveLogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});

  const [valueError, setValueError] = useState("");

  const dispatch = useDispatch();
  const authToken = useSelector(state => state.client.authToken);
  const descriptionRef = useRef(null);
  const valueRef = useRef(null);
  const editLogs = useSelector(state => state.client.editLogs);

  const handleClose = () => {
    setOpen(false);
    setValueError("");
  }


  const handleCreateTransaction = () => {
      const value = valueRef.current.valueAsNumber;
      const description = descriptionRef.current.value;

      if (Number.isNaN(value)) {
        setValueError(INVALID_VALUE);
        return;
      } else {
        setValueError("");
      }

      setValueError("");
      dispatch({
        type: ACTION_TYPES.UPDATE_CLIENT_EDIT_LOGS,
        command: 'add',
        authToken,
        value,
        description
      });

      handleClose();
  }

  const handleRemoveTransaction = (id) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_EDIT_LOGS,
      command: 'remove',
      authToken,
      id
    });
    handleClose();
  }
  const renderRemoveEditLogDialog = () => {
    return (
      <div>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Remove edit log
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              Are you sure you want to remove this item?
              NOTE: Removing a log will not affect your balance.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button autoFocus onClick={() => handleRemoveTransaction(dialogInfo.id)} color="secondary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  const renderAddEditLogDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the options for the transaction below.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="value"
            label="Amount ($)"
            type="number"
            fullWidth
            inputRef={valueRef}
            error={valueError !== ""}
            helperText={valueError}
          />
          <TextField
            margin="dense"
            id="desc"
            label="Description"
            type="text"
            fullWidth
            inputRef={descriptionRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateTransaction} color="primary">
            Create Transaction
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const handleAddButtonClicked = () => {
    setOpen(true);
    setDialogInfo({type: 'add'});
  }
  const renderEditPanel = () => {
    return (
      <div className="edit-log-edit">
        <div className="edit-log-edit__button">
          <Button color="primary" onClick={handleAddButtonClicked}>
            Create New Transaction
          </Button>
        </div>
      </div>
    );
  }

  const handleEditButtonClicked = (id) => {
    setOpen(true);
    setDialogInfo({type: 'edit', id});
  }

  const renderDialog = () => {
    if (!open) return;
    if (dialogInfo.type === 'add') return renderAddEditLogDialog();
    else if (dialogInfo.type === 'edit') return renderRemoveEditLogDialog();
  }

  const renderRows = () => {
    let rows = [];

    Object.keys(editLogs).forEach((id, i) => {
      rows.push(
        <TableRow key={i}>
          <TableCell>{editLogs[id].description == "" ? "None" : editLogs[id].description}</TableCell>
          <TableCell>{editLogs[id].time_created}</TableCell>
          <TableCell>{editLogs[id].value.toFixed(2)}</TableCell>
          {
          props.editMode &&
          <TableCell>
            <IconButton onClick={(e)=>{handleEditButtonClicked(id)}} color="inherit" size='small'>
              <Delete color='secondary' />
            </IconButton>
          </TableCell>
          }
        </TableRow>
      );
    });

    return rows.length == 0 ?
    <div className='blank-filler'>
      <Typography>Your transactions will appear here.</Typography>
    </div>
    : rows;
  }

  return (
    <React.Fragment>
      <div className="log-header-wrapper">
        <Title>Transaction Logs</Title>
        {props.editMode && renderEditPanel()}
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Reason</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount ($)</TableCell>
            {props.editMode && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {editLogs !== null && renderRows()}
        </TableBody>
      </Table>
      {renderDialog()}
    </React.Fragment>
  );
}
