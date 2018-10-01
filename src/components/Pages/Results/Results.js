import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Navbar from './../../Navbar';
import Result from './Result';
import { Typography } from '@material-ui/core';
import DB from './../../../utils/DB';
import API from '../../../utils/API';

const styles = theme => ({
  toolbar: theme.mixins.toolbar, 
  header: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 2,
    
  }, 
});


class Results extends Component {
  state = {
    geoArray: [],
    idArray: [],
    content: {},
    data: [],
    radius: 10000,
    limit: 10
  };

  getResults = favorites => {
    if(favorites){
      DB.getFavorites(this.props.userId.split('|')[1])
        .then(res => {
          console.log('response', res.data)
          this.setState({data: res.data});
          console.log(this.state.data)
        });
    }else{
      this.search();
    }
  }

  componentDidMount() { 
    this.getResults(this.props.favs);
  }

  componentWillReceiveProps(nextProps) {
    this.getResults(nextProps.favs);
    console.log(this.state);
  }

  search = () => {
    let lat = this.props.lat;
    let lon = this.props.lon;


    API.geoSearch(lat, lon, this.state.radius, this.state.limit)
      .then(res => {
        const geoArray = res.data.query.geosearch;
        const idArray = [];
        geoArray.forEach(element => idArray.push(element.pageid));
        this.setState({
          geoArray: geoArray,
          idArray: idArray
        });
        return idArray;
      })
      .then(idArray => {
        if(idArray.length > 0){
        API.idSearch(idArray).then(res => {
          const data= res.data.query.pages;

          let content = [];
          for(let prop in data){
            const article = {
              title: data[prop].title,
              body: data[prop].extract,
              url: data[prop].fullurl,
              pageId: prop
            };

            content.push(article);
          }

          delete content[0];
          this.setState({data: content});
          
        });
      }else{
        alert("no articles found!");
        // probably need to have a component to show that
      }
      })
      .catch(err => console.log(err));
  };


 //transform "article" into database consumable  
 generateContent = (data, favorite) => {
  return data.map(article => (
      <Result 
        title={article.title} 
        body={article.body} 
        /* breadcrumb={article.breadcrumb} */ 
        url={article.url} key={article.pageid} 
        userId={this.props.userId}
        favorite={favorite}
        key={article.pageid}
        />
  ));
 }
  
render() {
const {classes, favs } = this.props;
console.log(this.state.data)
let content = this.generateContent(this.state.data);

return(
      <div>
        <Navbar logout={this.props.logout} userId={this.props.userId} setPage={this.props.setPage}/>
        <div className={ classes.toolbar }>
        <Typography variant="display2" className={classes.header}>
          {favs ? "Favorites" : "Results"}
        </Typography>
        {content}
        </div>
      </div>
    );

};

};

export default withStyles(styles)(Results);



