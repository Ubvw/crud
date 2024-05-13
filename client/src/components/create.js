import React, { Fragment, useState } from "react";

const CreateLoyaltyCard = () => {
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { first_name, last_name };
      const response = await fetch("http://localhost:5000/loyalties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
};

  return (
    <Fragment>
      <h1 className="text-center mt-5">Create Loyalty Card</h1>
      <form className="d-flex flex-column mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Firstname"
          value={first_name}
          onChange={e => setFirstname(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Lastname"
          value={last_name}
          onChange={e => setLastname(e.target.value)}
        />
        <button className="btn btn-success">Add</button>
      </form>
    </Fragment>
  );
};

export default CreateLoyaltyCard;
