CREATE DATABASE IF NOT EXISTS botdb;
USE botdb;

CREATE TABLE IF NOT EXISTS whitelist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    whitelist_id INT NOT NULL UNIQUE,
    discord_id VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    status TINYINT DEFAULT 0,
    whitelisted_at TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY (discord_id, username)
);