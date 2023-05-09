INSERT INTO users (name, email, password)
VALUES ('Ikora Rey', 'Ikora@tower.net', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Elizabeth Bray', 'ElsieBray@tower.net', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Banshee-44', 'Banshee44@exomail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Lux Apartment', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 1500, 6, 6, 10, 'Canada', '444 Nantucket Road', 'Mississauga', 'Ontario', 'R5M9V7', TRUE),
(1, 'Apartment', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 100, 1, 1, 1, 'Canada', '555 Coffee Blvd', 'Calgary', 'Alberta', 'G6M0B1', TRUE),
(1, 'Big Home', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 30000, 12, 10, 18, 'Canada', '333 Mountain View Road', 'Kamloops', 'British Columbia', 'F5V3I3', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2023-05-11', '2023-05-13', 1, 2),
('2023-06-01', '2023-06-05', 2, 3),
('2023-05-24', '2023-06-24', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, rating, message)
VALUES (2, 1, 1,'message'),
(3, 2, 2,'message'),
(2, 3, 3,'message');