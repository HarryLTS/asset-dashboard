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
import DialogTitle from '@material-ui/core/DialogTitle';
import { verifyIntegerInput } from './../../common/helper';
import { ACTION_TYPES } from './../../common/constants';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import './CashFlows.css';

export default function CashFlows(props) {
  const [open, setOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});

  const [titleError, setTitleError] = useState("");
  const [valueError, setValueError] = useState("");
  const [frequencyError, setFrequencyError] = useState("");
  const dispatch = useDispatch();
  const authToken = useSelector(state => state.client.authToken);
  const cashFlows = useSelector(state => state.client.cashFlows);

  const TITLE_BLANK_ERROR = "This field cannot be blank.";
  const VALUE_NAN_ERROR = "This field is invalid.";
  const FREQUENCY_NAN_ZERO_ERROR = "This field is invalid";

  const titleRef = useRef(null);
  const valueRef = useRef(null);
  const frequencyRef = useRef(null);
  const titleEditRef = useRef(null);
  const valueEditRef = useRef(null);
  const frequencyEditRef = useRef(null);
  const cashFlowIds = [];

  const renderEditPanel = () => {
    return (
      <div className="cash-flow-edit">
        <div className="cash-flow-edit__income">
          <Button color="primary" onClick={()=>{
            setDialogInfo({type: "add"});
            setOpen(true);
          }}>Add Cash Flow</Button>
        </div>
        <div className="cash-flow-edit__expenditure">
          <Button color="secondary" onClick={()=>{
            setDialogInfo({type: "add"});
            setOpen(true);
          }}>Add Expenditure</Button>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleCreateCashFlow = () => {
    const title = titleRef.current.value;
    const value = valueRef.current.valueAsNumber;
    const frequency = frequencyRef.current.valueAsNumber;
    let valid = true;


    if (title === "") {
      setTitleError(TITLE_BLANK_ERROR);
      valid = false;
    }
    if (Number.isNaN(value)) {
      setValueError(VALUE_NAN_ERROR);
      valid = false;
    }
    if (Number.isNaN(frequency) || frequency <= 0) {
      setFrequencyError(FREQUENCY_NAN_ZERO_ERROR);
      valid = false;
    }

    if (!valid) return;

    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_CASH_FLOWS,
      command:'add',
      authToken,
      title,
      value,
      frequency
    });
    handleClose();
  }

  const renderAddCashFlowDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Cash Flow</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the options for the Cash Flow below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            inputRef={titleRef}
            error={titleError !== ""}
            helperText={titleError}
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
          <TextField
            margin="dense"
            id="frequency"
            label="Frequency (Days)"
            defaultValue={1}
            type="number"
            onChange={verifyIntegerInput}
            fullWidth
            error={frequencyError !== ""}
            helperText={frequencyError}
            inputRef={frequencyRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateCashFlow} color="primary">
            Create Cash Flow
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const renderEditCashFlowDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Cash Flow</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the options for the Cash Flow below.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              defaultValue={cashFlows[dialogInfo.id].title}
              inputRef={titleEditRef}
              error={titleError !== ""}
              helperText={titleError}
            />
            <TextField
              margin="dense"
              id="value"
              label="Value ($)"
              type="number"
              fullWidth
              defaultValue={cashFlows[dialogInfo.id].value}
              inputRef={valueEditRef}
              error={valueError !== ""}
              helperText={valueError}
            />
            <TextField
              margin="dense"
              id="frequency"
              label="Frequency (Days)"
              defaultValue={cashFlows[dialogInfo.id].frequency}
              type="number"
              onChange={verifyIntegerInput}
              fullWidth
              error={frequencyError !== ""}
              helperText={frequencyError}
              inputRef={frequencyEditRef}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleRemoveCashFlow(dialogInfo.id)}} color="secondary">
              Remove Cash Flow
            </Button>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleEditCashFlow(dialogInfo.id)} color="primary">
              Edit Cash Flow
            </Button>
          </DialogActions>
      </Dialog>
    );
  }

  const handleEditCashFlow = (id) => {
    const title = titleEditRef.current.value;
    const value = valueEditRef.current.valueAsNumber;
    const frequency = frequencyEditRef.current.valueAsNumber;
    let valid = true;


    if (title === "") {
      setTitleError(TITLE_BLANK_ERROR);
      valid = false;
    }
    if (Number.isNaN(value)) {
      setValueError(VALUE_NAN_ERROR);
      valid = false;
    }
    if (Number.isNaN(frequency) || frequency <= 0) {
      setFrequencyError(FREQUENCY_NAN_ZERO_ERROR);
      valid = false;
    }

    if (!valid) return;

    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_CASH_FLOWS,
      command:'edit',
      authToken,
      title,
      value,
      frequency,
      id
    });
    handleClose();
  }

  const handleRemoveCashFlow = (id) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_CASH_FLOWS,
      command:'remove',
      authToken,
      id
    });
    handleClose();
  }

  const renderDialog = () => {
    if (!open) return;
    if (dialogInfo.type == "add") return renderAddCashFlowDialog();
    else if (dialogInfo.type == "edit") return renderEditCashFlowDialog();

  }
  const handleEditButtonClicked = (id) => {
    setOpen(true);
    setDialogInfo({type: "edit", id:id});
  }

  const renderRows = () => {
    let rows = [];

    Object.keys(cashFlows).forEach((id, i) => {
      rows.push(
        <TableRow key={i}>
          <TableCell>{cashFlows[id].title}</TableCell>
          <TableCell>{cashFlows[id].value.toFixed(2)}</TableCell>
          <TableCell>{cashFlows[id].frequency}</TableCell>
          <TableCell>{cashFlows[id].last_invoked}</TableCell>
          <TableCell>{cashFlows[id].total_value_accrued}</TableCell>
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
      <Typography>You haven't added any cash flows yet.</Typography>
    </div>
    : rows;
  }
  return (
    <React.Fragment>
      <Title>Cash Flows</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Amount ($)</TableCell>
            <TableCell>Occurs Every (Days)</TableCell>
            <TableCell>Last Occured (Date)</TableCell>
            <TableCell>Total Valued Accrued ($)</TableCell>
            {props.editMode && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {cashFlows !== null && renderRows()}
        </TableBody>
      </Table>

      {props.editMode && renderEditPanel()}
      {renderDialog()}
    </React.Fragment>
  );
}
