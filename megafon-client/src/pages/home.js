import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Shout from '../components/shout/Shout';
import Profile from '../components/profile/Profile.js';
import ShoutSkeleton from '../util/ShoutSkeleton.js';

import { connect } from 'react-redux';
import { getShouts } from '../redux/actions/dataActions';

export class Home extends Component {

  componentDidMount(){
    this.props.getShouts();
  }

  render() {
    const { shouts, loading } = this.props.data;
    let recentShoutsMarkup = !loading ? (
      shouts.map(shout => <Shout key={shout.shoutId} shout={shout}/>)
    ) : (
      <ShoutSkeleton />
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentShoutsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    )
  }
}

Home.propTypes = {
  getShouts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  data: state.data
})

export default connect(mapStateToProps, {getShouts})(Home);
