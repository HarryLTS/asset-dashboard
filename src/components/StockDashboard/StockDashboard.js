import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import StockSummary from './../StockSummary/StockSummary';
import Overview from './../Overview/Overview';
import StockOptions from './../StockOptions/StockOptions';
import Copyright from './../Copyright/Copyright';
import DashboardHeader from './../DashboardHeader/DashboardHeader';
import { useSelector, useDispatch } from 'react-redux';
import { ACTION_TYPES } from './../../common/constants';

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
  const stockData = useSelector(state => state.client.stockData);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.LOAD_CLIENT_STOCK_DATA,
      authToken: authToken
    });
  }, [authToken, dispatch]);

  const handleRefresh = (e) => {
    e.preventDefault();
    dispatch({
      type: ACTION_TYPES.LOAD_CLIENT_STOCK_DATA,
      authToken: authToken
    });
  }

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <DashboardHeader
            displayTitle={props.displayTitle}
            editMode={editMode}
            setEditMode={setEditMode}
            handleRefresh={handleRefresh}
            />
          {/*<StockSummary classes={classes}/>*/}

          <Grid item xs={12}>
            <Paper className={fixedHeightPaper}>
              {stockData !== null && <Overview title="Stock Balance" displayValue={stockData.stock_combined_value}/>}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper}>
              {stockData !== null && <StockOptions editMode={editMode}/>}
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
