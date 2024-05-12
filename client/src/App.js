import React, { Fragment } from "react";
import "./App.css";
import CreateLoyaltyCard from './components/create';

function App(){
  return(
    <Fragment>
      <div className="container">
        <CreateLoyaltyCard />
      </div>
    </Fragment>
  )
}

export default App;
