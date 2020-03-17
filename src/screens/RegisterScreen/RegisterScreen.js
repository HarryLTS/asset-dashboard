import React, { useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import Copyright from './../../components/Copyright/Copyright';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router-dom';
import { ACTION_TYPES } from './../../common/constants';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


function RegisterScreen(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [apiRequestPending, setApiRequestPending] = useState(false);
  const [errorState, setErrorState] = useState({});
  const usernameRef = useRef(null);
  let emailRef = useRef(null);
  let passwordRef = useRef(null);

  const handleError = (responseData) => {
    console.log(responseData);
    setErrorState(responseData);
  }

  const renderLoadingDiv = () => {
    return (
      <div className="loading-icon">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  const redirectToLogin = () => {
    props.history.push('/login');
  }

  const handleRegister = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const username = usernameRef.current.value;

    dispatch({
      type: ACTION_TYPES.REGISTER,
      username,
      email,
      password,
      setApiRequestPending,
      handleError,
      redirectToLogin
    });
  }
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                error={errorState.hasOwnProperty("username")}
                helperText={errorState.hasOwnProperty("username") && errorState.username[0]}
                required
                fullWidth
                inputRef={usernameRef}
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                error={errorState.hasOwnProperty("email")}
                helperText={errorState.hasOwnProperty("email") && errorState.email[0]}
                required
                fullWidth
                inputRef={emailRef}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                error={errorState.hasOwnProperty("password")}
                helperText={errorState.hasOwnProperty("password") && errorState.password[0]}
                required
                fullWidth
                inputRef={passwordRef}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleRegister}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {apiRequestPending && renderLoadingDiv()}

      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default withRouter(RegisterScreen);
