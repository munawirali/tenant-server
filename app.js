const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors())
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

app.get('/', (req,res) => {
  res.send('server')
})

const tenant_company = require('./routers/tenant_company')

app.use('/tenant_company', tenant_company)

module.exports = app
