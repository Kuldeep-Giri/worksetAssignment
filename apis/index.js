const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors')

const app = express();
const port = 5000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
  }
});

app.use(cors())
app.use('/uploads', express.static('uploads'))
const upload = multer({ storage });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'worksetdb'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

//routes
app.post('/upload', upload.single('image'), (req, res) => {
  const { filename, size, date } = req.file;
  const {  filetype } = req.body;
  const sql = 'INSERT INTO posts (filename, size,filetype) VALUES (?, ?,?)';
  db.query(sql, [filename, size,filetype], (err, result) => {
    if (err) {
      console.error( err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).json({ message: 'File uploaded successfully' });
  });
});

app.get('/allData', (req, res) => {
  const sql = 'SELECT * FROM posts ORDER BY filename';
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).json(result);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
