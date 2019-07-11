import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';

//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

//Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';

//Pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import User from './pages/user';
import axios from 'axios';

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL = "https://asia-east2-megafon-fc1c3.cloudfunctions.net/api";

const token = localStorage.FBIdToken;

if(token){
  console.log("authentication check");
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp * 1000 < Date.now()){
    console.log("authentication expired");
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    console.log("authentication passed");
    store.dispatch({type: SET_AUTHENTICATED});
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
} 

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
            <div className='container'>
              <Switch>
                <Route exact path='/' component={Home}/>
                <AuthRoute 
                  exact 
                  path='/login' 
                  component={Login} 
                />
                <AuthRoute 
                  exact 
                  path='/signup' 
                  component={Signup} 
                />
                <Route exact path='/users/:handle' component={User}/>
                <Route exact path='/users/:handle/shout/:shoutId' component={User}/>
              </Switch>
            </div>
        </Router>
      </Provider>
      </MuiThemeProvider>
    )
  }
}

export default App;
