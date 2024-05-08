CREATE DATABASE CRUD

CREATE TABLE loyalty(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_creation DATE,
    date_expiry DATE,
    remaining INTEGER
)