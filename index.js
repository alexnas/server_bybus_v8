require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./src/config/db.config')
const router = require('./src/routes/index')
const errorHandler = require('./src/middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

// Error handling
app.use(errorHandler)

const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()
		app.listen(PORT, console.log('Server started on port ', PORT))

	} catch (e) {
		console.log(e);
	}
}

start()