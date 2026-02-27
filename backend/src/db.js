const sql = require('mssql');

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'Password123!',
    server: process.env.DB_SERVER || 'db',
    database: process.env.DB_NAME || 'master',
    options: {
        encrypt: true, // For Azure
        trustServerCertificate: true // For local dev
    }
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('SQL Server connection error:', err);
    }
};

module.exports = {
    sql,
    connectDB
};
