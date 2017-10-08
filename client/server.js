const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')
const path = require('path')
const { Client, types} = require('pg')
const client = new Client()

types.setTypeParser(1700, (val) => { return parseFloat(val) })
types.setTypeParser(20, (val) => { return parseInt(val) })

client.connect()

const app = new express()
const port = 3001

app.get('/data', (req, res) => {
  client.query('SELECT * FROM corp_owners ORDER BY "total-units" DESC').then((r) => {
    console.log(r.rows[1])
    res.send({data: r.rows.slice(0,1000)})
  })
})

app.get('/property', (req, res) => {
  if (req.query.ownerAddress == "") {
    res.status(400).send('Malformed Request')
  }
  let ownerAddress = req.query.ownerAddress
  console.log(ownerAddress)
  let buildings = {
    text: 'SELECT address, latitude, longitude  FROM "sf-ownership" WHERE "owner-address" = $1',
    values: [ownerAddress],
  }
  let companyNames = {
    text: 'SELECT DISTINCT "owner-name" FROM "sf-ownership" WHERE "owner-address" = $1',
    values: [ownerAddress],
  }
  let buildingQuery = client.query(buildings)
  let ownerQuery = client.query(companyNames)

  Promise.all([buildingQuery, ownerQuery])
    .then(data => {
      let ret = {
        buildings: data[0].rows,
        owners: data[1].rows
      }
      console.log(ret)
      res.send(ret)
    })

})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
