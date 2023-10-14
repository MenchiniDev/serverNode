const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000; // Puoi scegliere la porta desiderata

// Configura il middleware per analizzare il corpo delle richieste
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Imposta l'origine consentita, o '*' per consentire da qualsiasi origine.
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Specifica i metodi HTTP consentiti.
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Specifica gli header consentiti.
  next();
});
// Configura la connessione al tuo database MySQL
const db = mysql.createConnection({
  host: 'localhost', // Sostituisci con i dettagli del tuo database
  user: 'root',
  password: 'pigrecoeasy',
  database: 'nodeDbprova',
  port:3309
});

// Connetti al database
db.connect((err) => {
  if (err) {
    console.error('Errore nella connessione al database:', err);
  } else {
    console.log('Connesso al database MySQL');
  }
});

// Gestisci la richiesta POST dalla form React
app.post('/', (req, res) => {
  const { name, email, message } = req.body;

  // Inserisci i dati nel database
  const query = 'INSERT INTO contatti (name, email, message) VALUES (?, ?, ?)';
  db.query(query, [name, email, message], (err, result) => {
    if (err) {
      console.error('Errore nell\'inserimento dei dati nel database:', err);
      res.status(500).json({ message: 'Errore nell\'inserimento dei dati nel database' });
    } else {
      console.log('Dati inseriti con successo nel database');
      res.status(200).json({ message: 'Dati inseriti con successo nel database' });
    }
  });
});

const server = app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});

// Gestisci il segnale di terminazione del processo (ad esempio, CTRL + C)
process.on('SIGINT', () => {
  console.log('Chiusura pulita del server...');
  server.close(() => {
    console.log('Server chiuso correttamente');
    process.exit(0);
  });
});
