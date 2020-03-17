import React, { useState, useRef } from 'react';
import Title from './../Title/Title';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DialogTitle from '@material-ui/core/DialogTitle';
import { verifyIntegerInput } from './../../common/helper';
import { ACTION_TYPES } from './../../common/constants';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';

export default function CashFlows(props) {
  const [open, setOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});

  const [addressError, setAddressError] = useState("");
  const [valueError, setValueError] = useState("");

  const dispatch = useDispatch();
  const authToken = useSelector(state => state.client.authToken);

  const ADDRESS_BLANK_ERROR = "Address cannot be blank.";
  const VALUE_INVALID_ERROR = "This field is invalid.";

  const addressRef = useRef(null);
  const valueRef = useRef(null);
  const iprRef = useRef(null);
  const addressEditRef = useRef(null);
  const valueEditRef = useRef(null);
  const iprEditRef = useRef(null);

  const estateData = useSelector(state => state.client.estateData);
  const renderEditPanel = () => {
    return (
      <div className="cash-flow-edit">
        <div className="cash-flow-edit__income">
          <Button color="primary" onClick={()=>{
            setDialogInfo({type: "add"});
            setOpen(true);
          }}>Add Estate</Button>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleCreateEstate = () => {
    const address = addressRef.current.value;
    const value = valueRef.current.valueAsNumber;
    const isPrimaryResidence = iprRef.current.checked;

    let valid = true;

    if (address === "") {
      setAddressError(ADDRESS_BLANK_ERROR);
      valid = false;
    }
    if (Number.isNaN(value) || value < 0) {
      setValueError(VALUE_INVALID_ERROR);
      valid = false;
    }
    if (!valid) return;

    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_ESTATE_DATA,
      command:'add',
      authToken,
      address,
      isPrimaryResidence,
      value,
    });
    handleClose();
  }

  const renderAddEstateDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Estate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the options for the Estate below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            inputRef={addressRef}
            error={addressError !== ""}
            helperText={addressError}
          />
          <TextField
            margin="dense"
            id="value"
            label="Value ($)"
            type="number"
            fullWidth
            inputRef={valueRef}
            error={valueError !== ""}
            helperText={valueError}
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                inputRef={iprRef}
              />
            }
            label="Primary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateEstate} color="primary">
            Create Estate
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const renderEditEstateDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Remove Estate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please edit the options for the Estate below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            defaultValue={estateData.estate_list[dialogInfo.id].address}
            fullWidth
            inputRef={addressEditRef}
            error={addressError !== ""}
            helperText={addressError}
          />
          <TextField
            margin="dense"
            id="value"
            label="Value ($)"
            type="number"
            fullWidth
            defaultValue={estateData.estate_list[dialogInfo.id].value}
            inputRef={valueEditRef}
            error={valueError !== ""}
            helperText={valueError}
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={estateData.estate_list[dialogInfo.id].is_primary_residence}
                inputRef={iprEditRef}
              />
            }
            label="Primary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleRemoveEstate(dialogInfo.id)} color="secondary">
            Remove Estate
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={() => handleEditEstate(dialogInfo.id)} color="primary">
            Confirm Edit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const handleEditEstate = (id) => {
    const address = addressEditRef.current.value;
    const value = valueEditRef.current.valueAsNumber;
    const isPrimaryResidence = iprEditRef.current.checked;

    let valid = true;

    if (address === "") {
      setAddressError(ADDRESS_BLANK_ERROR);
      valid = false;
    }
    if (Number.isNaN(value) || value < 0) {
      setValueError(VALUE_INVALID_ERROR);
      valid = false;
    }
    if (!valid) return;

    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_ESTATE_DATA,
      command:'edit',
      authToken,
      address,
      isPrimaryResidence,
      value,
      id
    });
    handleClose();
  }

  const handleRemoveEstate = (id) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_ESTATE_DATA,
      command:'remove',
      authToken,
      id
    });
    handleClose();
  }

  const renderDialog = () => {
    if (!open) return;
    if (dialogInfo.type == "add") return renderAddEstateDialog();
    else if (dialogInfo.type == "edit") return renderEditEstateDialog();

  }
  const handleEditButtonClicked = (id) => {
    setOpen(true);
    setDialogInfo({type: "edit", id:id});
  }

  const renderRows = () => {
    let rows = [];

    Object.keys(estateData.estate_list).forEach((id, i) => {
      rows.push(
        <TableRow key={i}>
          <TableCell>{estateData.estate_list[id].address}</TableCell>
          <TableCell>{estateData.estate_list[id].value.toFixed(2)}</TableCell>
          <TableCell>{estateData.estate_list[id].is_primary_residence ? "Yes" : "No"}</TableCell>
          {
          props.editMode &&
          <TableCell>
            <IconButton onClick={(e)=>{handleEditButtonClicked(id)}} color="inherit" size='small'>
              <Edit />
            </IconButton>
          </TableCell>
          }
        </TableRow>
      );
    });

    return rows.length == 0 ?
    <div className='blank-filler'>
      <Typography>You haven't added any estates yet.</Typography>
    </div>
    : rows;
  }

  return (
    <React.Fragment>
      <Title>Estates</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Is Primary Residence (?)</TableCell>
            {props.editMode && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {estateData !== null && renderRows()}

        </TableBody>
      </Table>
      {props.editMode && renderEditPanel()}
      {renderDialog()}
    </React.Fragment>
  );
}
