import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Callback from '../../Callback';
import Home from './../Pages/Home';
import auth0Client from '../../utils/Auth';
const jwt = require('jsonwebtoken');

class Wrapper extends React.Component {
  state = {
    auth: "no",
    test: 'test'
  };


getId = () => {
  return new Promise((resolve,reject) => {
    let token = auth0Client.getIdToken();
    console.log(token);
    let decodedObj = jwt.decode(token)
    console.log(decodedObj);
   // console.log(decodedObj.sub); //this is the user_id
    
   if(decodedObj !== null){

     resolve(decodedObj);
   }

   //do reject

  
  });
}


 
/*  getId = async () => {
  let token = auth0Client.getIdToken();
  let decodedObj = jwt.decode(token);
  console.log(decodedObj.sub);
  return decodedObj.sub;
 } */

 setId = async () => {
   const loginId = await this.getId(); 
   console.log(loginId);
  
     this.setState({
       auth: loginId
     })
  
    };
  

  componentDidMount(){
    if(this.state.auth === "no"){
      this.setId();
    }

  }

 

  render() {

    
    return (

      <Home></Home>

    
    )
  }

}

export default Wrapper;