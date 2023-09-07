
//const sqlite3 = require('sqlite3').verbose();
import  sqlite3  from 'sqlite3';

// Create a new database or open an existing one
const db = new sqlite3.Database('ports.db');

// Create a table to hold ports
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS ports (
      id INTEGER PRIMARY KEY,
      value INTEGER NOT NULL
    )
  `);
});

// Function to add a new integer value to the table
const addPort = (value) => {

  db.run('INSERT INTO ports (id,value) VALUES (@0,@1)', [value,value], (err) => {
    if (err) {
      console.error('Error adding value:', err.message);
    } else {
      console.log('Value added:', value);
    }
  });
};

// Function to remove an integer value from the table
const removePort = (id) => {
  db.run('DELETE FROM ports WHERE id = ?', id, (err) => {
    if (err) {
      console.error('Error removing value:', err.message);
    } else {
      console.log('Value removed with ID:', id);
    }
  });
};

const getAllPorts = (callback) => {
    db.all('SELECT * FROM ports', (err, rows) => {
      if (err) {
        console.error('Error getting values:', err.message);
      } else {
        console.log('All integer values:');
        let ports=[]
        rows.forEach((row) => {
          console.log(`ID: ${row.id}, Value: ${row.value}`);
          ports.push(row.id);
        });
        callback(ports)
      }
    });
  };

  /*
// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
*/
export  {addPort,removePort,getAllPorts}
//module.exports= {addPort,removePort,getAllPorts}