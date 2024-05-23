import React, { Fragment, useEffect, useState } from "react";
import EditLoyaltyCard from "./edit";

const ListLoyaltyCard = () => {
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [sortedCards, setSortedCards] = useState([]);

  // Delete loyalty card
  const deleteLoyaltyCard = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/loyalties/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCards(cards.filter((card) => card.id !== id));
      } else {
        console.error("Failed to delete loyalty card");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Display loyalty cards
  const getLoyalty = async () => {
    try {
      const response = await fetch("http://localhost:5000/loyalties");
      const jsonData = await response.json();
      setCards(jsonData); 

      // Sort the cards based on date_creation property
      const sorted = [...jsonData].sort(
        (a, b) => new Date(b.date_creation) - new Date(a.date_creation)
      );
      setSortedCards(sorted); // Update sortedCards state
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getLoyalty();
  }, []); // Add an empty dependency array to run this effect only once

  useEffect(() => {
    
    // Filter the cards based on search query
    const filtered = sortedCards.filter((card) =>
      card.first_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCards(filtered);
  }, [searchQuery, sortedCards]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Fragment>
      <div className="mt-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by First Name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">first_name</th>
            <th scope="col">last_name</th>
            <th scope="col">date_creation</th>
            <th scope="col">date_expiry</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredCards.map((card) => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.first_name}</td>
              <td>{card.last_name}</td>
              <td>{card.date_creation}</td>
              <td>{card.date_expiry}</td>
              <td>
                <EditLoyaltyCard card={card} />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteLoyaltyCard(card.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ListLoyaltyCard;
