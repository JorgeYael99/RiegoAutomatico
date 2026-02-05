CREATE DATABASE IF NOT EXISTS usuariodb;
USE usuariodb;
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);

select * from usuarios;

SHOW VARIABLES LIKE 'bind_address';
SHOW VARIABLES LIKE 'port';

SHOW VARIABLES LIKE 'port';           -- Debe mostrar 3306
SHOW VARIABLES LIKE 'bind_address';   -- Debe mostrar *, 127.0.0.1, o 0.0.0.0
SHOW VARIABLES LIKE 'skip_networking'; -- Debe ser OFF