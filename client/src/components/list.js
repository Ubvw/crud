import React, { Fragment, useEffect, useState } from "react";

const ListLoyaltyCard = () => {
    const [cards, setCards] = useState([]);

    const getLoyalty = async () => {
        try {
            const response = await fetch("http://localhost:5000/loyalties");
            const jsonData = await response.json();
            setCards(jsonData); // Update state with fetched data
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        getLoyalty();
    }, []); // Add an empty dependency array to run this effect only once

    console.log(cards);

    return (
        <Fragment>
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
                    {cards.map((card) => (
                        <tr key={card.id}>
                            <td>{card.id}</td>
                            <td>{card.first_name}</td>
                            <td>{card.last_name}</td>
                            <td>{card.date_creation}</td>
                            <td>{card.date_expiry}</td>
                            <td>Edit</td>
                            <td>Delete</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
};

export default ListLoyaltyCard;
