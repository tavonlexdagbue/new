const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//  MySQL Connection
async function createConnection() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });
    console.log('✅ Connected to MySQL');
    return connection;
}

//  GET /polling-units - List all polling units
app.get('/polling-units', async(req, res) => {
    const conn = await createConnection();
    try {
        const [rows] = await conn.query(
            'SELECT uniqueid, polling_unit_name FROM polling_unit'
        );
        res.json(rows); // returns: [{ uniqueid: 1, polling_unit_name: "PU 001" }, ...]
    } catch (err) {
        console.error('❌ /polling-units Error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        await conn.end();
    }
});

//  POST /polling-units - Submit results
app.post('/polling-units', async(req, res) => {
    const conn = await createConnection();
    const { polling_unit_uniqueid, results } = req.body;

    try {
        for (const r of results) {
            await conn.query(
                `INSERT INTO announced_pu_results 
        (polling_unit_uniqueid, party_abbreviation, party_score, entered_by_user, date_entered, user_ip_address) 
        VALUES (?, ?, ?, ?, NOW(), ?)`, [polling_unit_uniqueid, r.party, r.score, 'admin', '127.0.0.1']
            );
        }
        res.json({ success: true });
    } catch (err) {
        console.error('❌ /polling-units POST Error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        await conn.end();
    }
});

//  GET /totals - Total votes per party
app.get('/totals', async(req, res) => {
    const conn = await createConnection();
    try {
        const [rows] = await conn.query(
            `SELECT party_abbreviation, 
              SUM(party_score) AS total_votes 
       FROM announced_pu_results 
       GROUP BY party_abbreviation`
        );
        res.json(rows); // returns: [{ party_abbreviation: 'PDP', total_votes: 1200 }, ...]
    } catch (err) {
        console.error('❌ /totals Error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        await conn.end();
    }
});

//  GET /polling-units/:id - Results for specific polling unit
app.get('/polling-units/:id', async(req, res) => {
    const conn = await createConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(
            `SELECT party_abbreviation, party_score 
       FROM announced_pu_results 
       WHERE polling_unit_uniqueid = ?`, [id]
        );
        res.json(rows); // returns: [{ party_abbreviation: 'PDP', party_score: 300 }, ...]
    } catch (err) {
        console.error(`❌ /polling-units/${id} Error:`, err);
        res.status(500).json({ error: err.message });
    } finally {
        await conn.end();
    }
});

// ✅ Start Server
console.log('DB User:', process.env.MYSQL_USER);
console.log('DB Password:', process.env.MYSQL_PASSWORD ? '******' : '(none)');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});