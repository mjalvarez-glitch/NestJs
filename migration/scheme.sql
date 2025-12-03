-- I added 3 columns (full_name, age, sex)
-- In sex column I created a folder to call is choices
-- The folder is named "enums" on "users" folder

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    sex ENUM('M', 'F') NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    refresh_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE positions (
	position_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    position_code VARCHAR(100) NOT NULL,
    position_name VARCHAR(100) NOT NULL,
    id INT NOT NULL,
    FOREIGN KEY (id) REFERENCES users (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    label VARCHAR(200) NOT NULL,            
    recipient_name VARCHAR(200) NOT NULL,  
    street_address VARCHAR(200) NOT NULL,  
    city VARCHAR(200) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);