import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './../Title/Title';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Overview(props) {
  const classes = useStyles();

  const date = new Date();

  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <Typography component="p" variant="h4">
        ${props.displayValue.toFixed(2)}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on {date.toLocaleString('default', { month: 'long' })} {date.getDate()}, {date.getFullYear()}
      </Typography>
    </React.Fragment>
  );
}
