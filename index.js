require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const sequelize = require('./src/config/db.config')
const router = require('./src/routes/index')
const errorHandler = require('./src/middleware/ErrorHandlingMiddleware')
const path = require("path");

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors())
app.use(express.urlencoded({ limit: '500kb', extended: true }));
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({
    debug: true,
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "./tmp"),
  })
);

app.use('/api', router)

// Error handling
app.use(errorHandler)

const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()
		// await sequelize.sync({ alter: true })
		app.listen(PORT, console.log('Server started on port ', PORT))

	} catch (e) {
		console.log(e);
	}
}

start()