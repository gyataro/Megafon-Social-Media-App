import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropType from 'prop-types';

const AuthRoute = ({component: Component, authenticated, ...rest}) => (
	<Route
	{...rest}
	render={(props) => authenticated === true ? <Redirect to='/'/> : <Component {...props} />
	}
	/>
)

const mapStateToProps = (state) => ({
	user: state.user,
	authenticated: state.user.authenticated
})

AuthRoute.propTypes = {
	user: PropType.object
};

export default connect(mapStateToProps)(AuthRoute);
