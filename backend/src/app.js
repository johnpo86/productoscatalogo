const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Products API',
            version: '1.0.0',
            description: 'API for managing products'
        },
        servers: [
            {
                url: 'http://localhost:4000'
            }
        ]
    },
    apis: ['src/app.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Returns the health status of the API
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

module.exports = app;