import React, { Fragment, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const EditLoyaltyCard = ({ card }) => {
  const [show, setShow] = useState(false);
  const [first_name, setFirstname] = useState(card.first_name);
  const [last_name, setLastname] = useState(card.last_name);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Update loyalty card
  const updateLoyaltyCard = async (e) => {
    e.preventDefault();
    try {
      const body = { first_name, last_name };
      const response = await fetch(`http://localhost:5000/loyalties/${card.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        handleClose();
      } else {
        console.error("Failed to update loyalty card");
      }
      window.location = '/';
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Loyalty Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateLoyaltyCard}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default EditLoyaltyCard;
