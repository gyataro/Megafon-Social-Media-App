import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/login.svg';
import { Link } from 'react-router-dom';

//Material UI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

//Redux stuff
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = {
  form: {
    textAlign: 'center'
  },
  image: {
    margin: '20px auto 20px auto'
  },
  pageTitle: {
    margin: '10px auto 10px auto'
  },
  textField: {
    margin: '10px auto 10px auto'
  },
  button: {
    marginTop: 20
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10
  },
  progress: {
    position: 'absolute'
  }
}

export class Login extends Component {
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      //loading: false,
      errors: {}
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.UI.errors){
      this.setState({errors: nextProps.UI.errors});
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    /*this.setState({
      loading: true
    })*/

    const userData = {
      email: this.state.email,
      password: this.state.password
    }

    this.props.loginUser(userData, this.props.history);

    /*axios.post('/login', userData)
      .then(res => {
        localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
        this.setState({
          loading: false
        });
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({
          errors: err.response.data,
          loading: false
        })
      })*/
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    const { classes, UI: { loading } } = this.props;
    const { errors } = this.state;
    return (
      <Grid container className={ classes.form }>
        <Grid item sm/>
        <Grid item sm>
          <img src={AppIcon} width='60%' alt='megaphone' className={classes.image}/>
          <Typography variant='h6' className={classes.pageTitle}>
            Welcome back.
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField 
              id='email' 
              name='email' 
              type='email' 
              label='Email' 
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email} 
              onChange={this.handleChange} 
              fullWidth
              variant='outlined'
            />
            <TextField 
              id='password' 
              name='password' 
              type='password' 
              label='Password' 
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password} 
              onChange={this.handleChange} 
              fullWidth 
              variant='outlined'
            />
            {errors.general && (
              <Typography variant='body2' className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button 
              type='submit' 
              variant='contained' 
              color='primary' 
              className={classes.button}
              disabled={loading}
            >
              Login
              {loading && (
                <CircularProgress size={30} className={classes.progress}></CircularProgress>
              )}
            </Button>
          </form>
          <br/>
          <small>Don't have an account? Sign up <Link to="/signup">here</Link></small>
        </Grid>
        <Grid item sm/>
      </Grid>
    )
  }
}

//Development type checks
Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));