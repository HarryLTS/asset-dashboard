import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './../Title/Title';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { ACTION_TYPES } from './../../common/constants';
import { verifyIntegerInput } from './../../common/helper';

// Generate Order Data
function createData(id, symbol, name, price, quantity) {
  return { id, symbol, name, price, quantity, value: price * quantity };
}

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  invalidRow: {
    backgroundColor: "red",
  },
  unsettledRow: {
    backgroundColor: "#fffce5",
  }
}));


export default function StockOptions(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState(null);
  const addSymbolRef = useRef(null);
  const addQuantityRef = useRef(null);
  const editQuantityRef = useRef(null);
  const authToken = useSelector(state => state.client.authToken);
  const dispatch = useDispatch();
  const stockData = useSelector(state => state.client.stockData);

  const renderDialog = () => {
      if (!open || dialogInfo === null) return;
      if (dialogInfo.type === 'add') return renderAddDialog();
      else if (dialogInfo.type === 'edit') return renderEditDialog();
  }

  const handleEdit = (symbol) => {
    const quantity = editQuantityRef.current.valueAsNumber;

    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_STOCK_DATA,
      command: 'edit',
      authToken,
      symbol,
      quantity
    });
    handleClose();
  }

  const handleRemove = (symbol) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_STOCK_DATA,
      command: 'remove',
      authToken,
      symbol
    });
    handleClose();
  }

  const renderEditDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Stock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To change the quantity for stock {dialogInfo.symbol}, edit the field below.
          </DialogContentText>
          <TextField
            margin="dense"
            id="quantity"
            label="Quantity"
            defaultValue={1}
            inputRef={editQuantityRef}
            onChange={verifyIntegerInput}
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleRemove(dialogInfo.symbol)} color="secondary">
            Remove Stock
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleEdit(dialogInfo.symbol)} color="primary">
            Confirm Edit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const renderAddDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Stock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a stock, enter its symbol in the field below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="symbol"
            label="Symbol"
            inputProps={{
              maxLength: 5,
            }}
            inputRef={addSymbolRef}
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="quantity"
            label="Quantity"
            defaultValue={1}
            onChange={verifyIntegerInput}
            inputRef={addQuantityRef}
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const handleAddButtonClicked = () => {
    setDialogInfo({type: 'add'});
    setOpen(true);
  }

  const handleEditButtonClicked = (symbol) => {
    setDialogInfo({type: 'edit', symbol});
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleAdd = () => {
    const symbol = addSymbolRef.current.value.toUpperCase();
    const quantity = addQuantityRef.current.valueAsNumber;
    dispatch({
      type: ACTION_TYPES.UPDATE_CLIENT_STOCK_DATA,
      command: 'add',
      authToken,
      symbol,
      quantity
    });
    handleClose();
  }

  const renderRows = () => {
    let validRows = [];
    let unsettledRows = [];
    let invalidRows = [];
    Object.keys(stockData.data_by_symbol).forEach((symbol, i) => {
      const currentStock = stockData.data_by_symbol[symbol];
      if (currentStock.quote_status === 'invalid') invalidRows.push({id: i, symbol});
      else if (currentStock.quote_status === 'unsettled') unsettledRows.push({id: i, symbol});
      else validRows.push(createData(i, symbol, currentStock.name_status === 'valid' ? currentStock.name : "-", currentStock.quote.c, currentStock.quantity));
    });

    let tableRows = [];

    validRows.forEach(row => {
      tableRows.push(
        <TableRow key={row.id}>
          <TableCell>{row.symbol}</TableCell>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.price.toFixed(2)}</TableCell>
          <TableCell>{row.quantity}</TableCell>
          <TableCell>{row.value.toFixed(2)}</TableCell>
          {
          props.editMode &&
          <TableCell>
            <IconButton onClick={() => handleEditButtonClicked(row.symbol)} color="inherit" size='small'>
              <Edit />
            </IconButton>
          </TableCell>
          }
        </TableRow>
      );
    });

    unsettledRows.forEach(row => {
      tableRows.push(
        <TableRow key={row.id} className={classes.unsettledRow}>
          <TableCell>{row.symbol}</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          {
          props.editMode &&
          <TableCell>
            <IconButton onClick={() => handleEditButtonClicked(row.symbol)} color="inherit" size='small'>
              <Edit />
            </IconButton>
          </TableCell>
          }
        </TableRow>
      );
    });

    invalidRows.forEach(row => {
      tableRows.push(
        <TableRow key={row.id} className={classes.invalidRow}>
          <TableCell>{row.symbol}</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          {
          props.editMode &&
          <TableCell>
            <IconButton onClick={() => handleEditButtonClicked(row.symbol)} color="inherit" size='small'>
              <Edit />
            </IconButton>
          </TableCell>
          }
        </TableRow>
      );
    });

    return tableRows.length == 0 ?
    <div className='blank-filler'>
      <Typography>You haven't added any stocks yet.</Typography>
    </div>
    : tableRows;
  }

  return (
    <React.Fragment>
      <Title>My Stocks</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ticker</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price ($)</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total Value ($)</TableCell>
            {props.editMode && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows()}
        </TableBody>
      </Table>
      {props.editMode &&
      <div className={classes.seeMore}>
        <IconButton onClick={handleAddButtonClicked} color="inherit" size='small'>
          <Add />
        </IconButton>
      </div>
      }
      {renderDialog()}
    </React.Fragment>
  );
}
