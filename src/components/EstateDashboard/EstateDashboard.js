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
import EstateTable from './../EstateTable/EstateTable';

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
    height: 400,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const authToken = useSelector(state => state.client.authToken);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [editMode, setEditMode] = useState(false);
  const estateData = useSelector(state => state.client.estateData);

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.LOAD_CLIENT_ESTATE_DATA,
      authToken
    });
  }, [authToken, dispatch]);

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <DashboardHeader
            displayTitle={props.displayTitle}
            editMode={editMode}
            setEditMode={setEditMode}
            />
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={fixedHeightPaper}>
              <EstateTable editMode={editMode}/>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
            <Paper className={fixedHeightPaper}>
              {estateData != null && <Overview title="Estate Balance" displayValue={estateData.total_estate_value}/>}
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
