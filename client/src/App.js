import React, { Fragment } from "react";
import "./App.css";

//components
import CreateLoyaltyCard from "./components/create";
import ListLoyaltyCard from "./components/list";

function App() {
  return (
    <Fragment>
      <div className="container">
        <CreateLoyaltyCard />
        <ListLoyaltyCard />
      </div>
    </Fragment>
  );
}

export default App;
