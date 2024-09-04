const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "stb106stb106",
  database: "sittinon"
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// เพิ่มข้อมูล
app.post('/houses', (req, res) => {
  const { area, bedrooms, bathrooms, price, condi, type, year_built, parking_spaces, address } = req.body;

  // ตรวจสอบว่ามีข้อมูลครบถ้วน
  if (!area || !bedrooms || !bathrooms || !price || !condi || !type || !year_built || !parking_spaces || !address) {
    return res.status(400).send({ message: 'กรุณาระบุข้อมูลให้ครบถ้วน', status: false });
  }

  // เตรียมคำสั่ง SQL เพื่อป้องกัน SQL Injection
  const sql = `INSERT INTO houses (area, bedrooms, bathrooms, price, condi, type, year_built, parking_spaces, address ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // รันคำสั่ง SQL
  db.query(sql, [area, bedrooms, bathrooms, price, condi, type, year_built, parking_spaces, address], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).send({ message: 'Error saving data', status: false });
    }
    res.send({ message: 'Product saved successfully', status: true });
  });
});


app.get('/get/houses/:id', (req, res) => {
  const { id } = req.params; // ดึง id จาก URL
  const sql = `SELECT * FROM houses WHERE housesid = ?`; // ใช้ ? เพื่อป้องกัน SQL Injection

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error retrieving house:', err);
      return res.status(500).send({ message: 'Error retrieving house', status: false });
    }
    if (result.length === 0) {
      return res.status(404).send({ message: 'House not found', status: false });
    }
    result[0]['message']= 'success';
    result[0]['status']= true;
    res.send(result[0]); // ส่งข้อมูลของบ้านที่ตรงกับ id กลับไป
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
