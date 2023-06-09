const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
    const query = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email]
    };

    return pool
    .query(query)
    .then(result => result.rows[0] || null)
    .catch(err => console.error('Error exectuting query', err.stack));
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    };
  
    return pool
    .query(query)
    .then(result => result.rows[0] || null)
    .catch(err => console.error('Error executing query', err.stack));
  };

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
    const query = {
      text: 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      values: [user.name, user.email, user.password]
    };
  
    return pool
    .query(query)
    .then(result => result.rows[0])
    .catch(err => console.error('Error executing query', err.stack));
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
    const query = {
      text: `
        SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating) AS average_rating
        FROM reservations
        JOIN properties ON reservations.property_id = properties.id
        JOIN property_reviews ON properties.id = property_reviews.property_id
        WHERE reservations.guest_id = $1
        GROUP BY properties.id, reservations.id
        ORDER BY reservations.start_date
        LIMIT $2;
      `,
      values: [guest_id, limit]
    };
    
    return pool.query(query)
    .then(res => res.rows)
    .catch(err => console.error('Error executing query', err.stack));
};

/// Properties

/**
 * Get all properties.
 * @param {{ owner_id: number, minimum_price_per_night: number, maximum_price_per_night: number, minimum_rating: number, city: string }} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
    const queryParams = [];
  
    let queryString = `
      SELECT properties.*, AVG(property_reviews.rating) AS average_rating
      FROM properties
      JOIN property_reviews ON properties.id = property_id
    `;
  
    const whereConditions = [];
  
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      whereConditions.push(`city LIKE $${queryParams.length}`);
    }
  
    if (options.owner_id) {
      queryParams.push(options.owner_id);
      whereConditions.push(`owner_id = $${queryParams.length}`);
    }
  
    if (options.minimum_price_per_night) {
      const minPriceInCents = options.minimum_price_per_night * 100;
      queryParams.push(minPriceInCents);
      whereConditions.push(`cost_per_night >= $${queryParams.length}`);
    }
  
    if (options.maximum_price_per_night) {
      const maxPriceInCents = options.maximum_price_per_night * 100;
      queryParams.push(maxPriceInCents);
      whereConditions.push(`cost_per_night <= $${queryParams.length}`);
    }
  
    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      whereConditions.push(`property_reviews.rating >= $${queryParams.length}`);
    }
  
    if (whereConditions.length > 0) {
      queryString += `WHERE ${whereConditions.join(' AND ')} `;
    }
  
    queryParams.push(limit);

    console.log('Query:', queryString);
    console.log('Params:', queryParams);

    queryString += `
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
    `;
  
  return pool
    .query(queryString, queryParams)
    .then((result) => result.rows)
    .catch((err) => {
      console.error('Error executing query', err.stack);
      throw err;
    });
};
  
  

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
    const queryString = `
      INSERT INTO properties (
        owner_id,
        title,
        description,
        thumbnail_photo_url,
        cover_photo_url,
        cost_per_night,
        street,
        city,
        province,
        post_code,
        country,
        parking_spaces,
        number_of_bathrooms,
        number_of_bedrooms
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;
    const values = [
      property.owner_id,
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      parseInt(property.cost_per_night) * 100, // Convert dollars to cents
      property.street,
      property.city,
      property.province,
      property.post_code,
      property.country,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms
    ];
  
    return pool.query(queryString, values)
      .then(res => res.rows[0])
      .catch(err => console.error('Error executing query', err.stack));
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
