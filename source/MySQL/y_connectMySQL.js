const mysql = require('mysql2');
require('colors');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'botdb'
});

connection.connect((err) => {
  if (err) {
    console.error('✖ Erro ao conectar ao MySQL:'.red.bold, err.toString().red);
    return;
  }
  console.log('✔ Conectado ao MySQL com sucesso!'.green.bold);
  console.log(`⚡Banco de dados: ${connection.config.database}`.blue);
  console.log(`⚡Host: ${connection.config.host}`.blue);
});

module.exports = connection;