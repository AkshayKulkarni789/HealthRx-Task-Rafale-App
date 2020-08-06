import React, { Component } from 'react';
import Home from "./components/Home"
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Map from "./components/Map"


class App extends Component{
  render() {
    return(
      <BrowserRouter>
      <div className="App">
        <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route path="/map" component={Map}></Route>
        </Switch>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;