import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import StockSummary from './../StockSummary/StockSummary';
import Overview from './../Overview/Overview';
import Copyright from './../Copyright/Copyright';
import DashboardHeader from './../DashboardHeader/DashboardHeader';
import { useSelector, useDispatch } from 'react-redux';
import { ACTION_TYPES } from './../../common/constants';
import CashEditLogs from './../CashEditLogs/CashEditLogs';
import CashFlows from './../CashFlows/CashFlows';

const useStyles = makeStyles(theme => ({
  appBarSpacer: {
    height: '50px',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 250,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const authToken = useSelector(state => state.client.authToken);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [editMode, setEditMode] = useState(false);
  const estateData = useSelector(state => state.client.estateData);
  const cashAmount = useSelector(state => state.client.cashAmount);
  const stockData = useSelector(state => state.client.stockData);
  const editLogs = useSelector(state => state.client.editLogs);
  const cashFlows = useSelector(state => state.client.cashFlows);

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.LOAD_CLIENT_ESTATE_DATA,
      authToken
    });
    dispatch({
      type: ACTION_TYPES.LOAD_CLIENT_STOCK_DATA,
      authToken: authToken
    });
    dispatch({
      type: ACTION_TYPES.GET_CLIENT_CASH_FLOWS,
      authToken: authToken
    });
    dispatch({
      type: ACTION_TYPES.GET_CLIENT_EDIT_LOGS,
      authToken: authToken
    });
  }, [authToken, dispatch]);

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2}>
          <DashboardHeader
            displayTitle={props.displayTitle}
            />
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper}>
              {stockData !== null && estateData != null && <Overview title="Master Balance" displayValue={stockData.stock_combined_value + estateData.total_estate_value + cashAmount}/>}
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper className={fixedHeightPaper}>
              {stockData !== null && <Overview title="Stock Balance" displayValue={stockData.stock_combined_value}/>}
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={fixedHeightPaper}>
              {estateData != null && <Overview title="Estate Balance" displayValue={estateData.total_estate_value}/>}
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={fixedHeightPaper}>
              <Overview title="Cash Balance" displayValue={cashAmount}/>
            </Paper>
          </Grid>

        </Grid>
        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </main>
  );
}
