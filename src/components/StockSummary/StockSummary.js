import React, { useState } from 'react';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Chart from './../Chart/Chart';

const timeFrames = ['1 day', '5 days', '1 month', '6 months', '1 year', '5 years'];

export default function StockSummary(props) {
  const { classes } = props;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  let [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[0]);

  const renderTimeOptions = () => {
    const timeOptions = timeFrames.map((timeFrame, i) => {
      return (
        <Grid key={i} item xs={2}>
          <Button onClick={() => setSelectedTimeFrame(timeFrame)} color={timeFrame === selectedTimeFrame ? 'secondary' : 'default'}>{timeFrame}</Button>
        </Grid>
      );
    });

    return (
      <Grid container>
        {timeOptions}
      </Grid>
    );
  }

  return (
    <Grid item xs={12} md={8} lg={9}>
      <Paper className={fixedHeightPaper}>
        {renderTimeOptions()}
        <Chart />
      </Paper>
    </Grid>
  );
}
