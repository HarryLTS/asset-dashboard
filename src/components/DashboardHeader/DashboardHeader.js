import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Build from '@material-ui/icons/Build';
import Refresh from '@material-ui/icons/Refresh';
import { useSelector, useDispatch } from 'react-redux';
import { ACTION_TYPES } from './../../common/constants';
export default function DashboardHeader(props) {
  return (
    <>
      <Grid item xs={10}>
        <Typography variant='h4'>
          {props.displayTitle}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <IconButton
          color="primary"
          onClick={props.handleRefresh}
          >
          {props.hasOwnProperty('handleRefresh') && <Refresh />}
        </IconButton>
      </Grid>

      <Grid item xs={1}>
        <IconButton
          color={props.editMode ? "secondary" : "inherit"}
          onClick={()=>{props.setEditMode(!props.editMode)}}
          >
          {props.hasOwnProperty('editMode') && <Build />}
        </IconButton>
      </Grid>
    </>
  );
}
