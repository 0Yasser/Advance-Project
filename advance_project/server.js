const express = require('express')
const next = require('next')
require('dotenv').config();
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
// const { getCookieParser } = require('next/dist/server/api-utils')
// const userRoute=require('./routes/userRoute')
// const placeRoute=require('./routes/placeRoute')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const userRoute = require('./pages/api/routes/userRoute')


app.prepare().then(() => {
  const server = express()
  server.use(express.json())
  server.use(userRoute)
  server.use(cookieParser())
  // app.use(getCookieParser)
  // app.use(userRoute)
  // app.use(PlaceRoute)
  server.all('*', (req, res) => {
    return handle(req, res)
  })
mongoose.connect(process.env.DB,
{useNewUrlParser:true,
useUnifiedTopology:true}).then(()=>{
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Connected with mongoose and Ready on http://localhost:${port}`)
  })
})
})