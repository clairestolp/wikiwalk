import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Navbar from './../../Navbar';
import Result from './Result';
import { Typography } from '@material-ui/core';
import DB from './../../../utils/DB';
import API from '../../../utils/API';
import GoogleMapsContainer from './GoogleMaps/GoogleMaps';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  toolbar: theme.mixins.toolbar, 
  header: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 2,
  }, 
  map: {
    position: 'relative',
    height: '300px'
  }
});


class Results extends Component {
  state = {
    geoArray: [],
    idArray: [],
    content: {},
    lon: null,
    lat: null,
    radius: 10000,
    limit: 10
  };

  componentDidMount() {
    if(this.props.favs){
      DB.getFavorites('114167404198811874512')
        .then(res => {
          console.log(res);
          this.setState({data: res.data});
        });
    }else{
      this.search();
    }
  }

  pageIdArray = () => {
    const idArray = [];
    this.geoArray.forEach(element => {
      idArray.push(element.pageid);
    });
    this.setState({
      idArray: idArray,
    });
  };

  search = () => {
    console.log(this.props.lat);
    console.log(this.props.lon);
    let lat = this.props.lat;
    let lon = this.props.lon;
    console.log("lattitue", lat);
    console.log("longitude", lon);
    this.setState({
      lat: lat,
      lon: lon
    });

    API.geoSearch(
      lat,
      lon,
      this.state.radius,
      this.state.limit
    )
      .then(res => {
        const geoArray = res.data.query.geosearch;
        const idArray = [];
        geoArray.forEach(element => {
          idArray.push(element.pageid);
          console.log(geoArray);
        });
        this.setState({
          geoArray: geoArray,
          idArray: idArray,
        });
        return idArray;
      })
      .then(idArray => {
        if(idArray.length > 0){
        API.idSearch(idArray).then(res => {
          console.log('hi', res.data.query.pages);
          const content = res.data.query.pages;
          delete content[0];
          this.setState({
            content: content
          });
        });
      }else{
        alert("no articles found!");
        // probably need to have a component to show that
      }
      })
      .catch(err => console.log(err));
  };

  renderContent = () => {
    const contentArray = [];
    for (const key in this.state.content) {
      if (this.state.content.hasOwnProperty(key)) {
        const element = this.state.content[key];
        contentArray.push(element);
      }
    }
    return contentArray;
  };


 //transform "article" into database consumable  
  
  

render() {
const {classes, favs } = this.props;
let contentArray = this.renderContent();
let content = contentArray.map(article => {
  return(
    <Result 
      title={article.title} 
      body={article.extract} 
      /* breadcrumb={article.breadcrumb} */ 
      url={article.fullurl} 
      key={article.pageid} 
      /* favorited={article.favorited} */
    />
  )
});
console.log('hit ', this.state.geoArray);
return(
      <div>
        <Navbar logout={this.props.logout} userId={this.props.userId} />
        <div className={ classes.toolbar }>
        
        <Typography variant="display2" className={classes.header}>
          {favs ? "Favorites" : "Results"}
        </Typography>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={12} md={8}>
            <Paper className={classes.map}>
              <GoogleMapsContainer
                geoArray={this.state.geoArray} 
                lat={this.state.lat} 
                lon={this.state.lon}
              />
            </Paper>
          </Grid> 
        </Grid>
        
        {content}
        </div>
      </div>
    );

};

};

export default withStyles(styles)(Results);



