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
import './LoginScreen.css';

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function LoginScreen(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [apiRequestPending, setApiRequestPending] = useState(false);
  const [error, setError] = useState(false);
  let emailRef = useRef(null);
  let passwordRef = useRef(null);

  const redirectToHome = () => {
    props.history.push('/');
  }

  const handleLogin = (e) => {
      e.preventDefault();
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      dispatch({
        type: ACTION_TYPES.LOGIN,
        email,
        password,
        setApiRequestPending,
        setError,
        redirectToHome
      });
  }

  const renderLoadingDiv = () => {
    return (
      <div className="loading-icon">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  const renderErrorMessage = () => {
    return (
      <div className="error">
        <Typography variant="subtitle1" color="error">
          Your login credentials were incorrect. Please try again.
        </Typography>
      </div>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            inputRef={emailRef}
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            inputRef={passwordRef}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            onClick={handleLogin}
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>

            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {apiRequestPending && renderLoadingDiv()}
      {error && renderErrorMessage()}

      <Box mt={8}>
        <Copyright />
      </Box>

    </Container>
  );
}

export default withRouter(LoginScreen);
