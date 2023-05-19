const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const cors = require('cors');
const TripDB = require("./modules/tripDB.js");
const db = new TripDB();
require('dotenv').config();
const {MONGODB_CONN_STRING} = process.env;
// cyclic -> variables -> MONGODB_CONN_STRING register to key-value variable

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: "API Listening"});
});

// Add new trip
app.post("/api/trips", (req, res) => {
  // async function returns promise
  db.addNewTrip(req.body)
  .then(newTrip => {
    // return 201(Created)
    res.status(201).json(newTrip);
  })
  .catch(()=>{
    res.status(500).json({"message": "Server internal error"});
  });
});

// Get trips
app.get("/api/trips", (req, res) => {

  let page = req.query.page;
  let perPage = req.query.perPage

  if(!page || !perPage){
    res.status(500).json({"message": "parameter not provided page: " + req.query.page + ", perPage: " + req.query.perPage});
  }else{
    db.getAllTrips(page, perPage)
    .then((trips)=>{
      res.json(trips);
    }).catch(()=>{
      res.status(500).json({"message": "Server internal error"});
    });
  }
});

// Get one trip
app.get("/api/trips/:id", (req, res) => {
  db.getTripById(req.params.id)
  .then((trip) => {
    trip ? res.json(trip) : res.status(404).json({"message": "Trip not found"});
  })
  .catch(() => {
    res.status(500).json({"message": "Server internal error"});
  });
});

// Edit existing trip
app.put("/api/trips/:id", (req, res) => {
  if (req.body._id && req.params.id != req.body._id ) { 
    res.status(400).json({ "message": "IDs not match" });
  } else {
    db.updateTripById(req.body, req.params.id)
    .then((trip)=>{
      res.json(trip);
    }).catch(()=>{
      res.status(404).json({ "message": "Resource not found" });
    })
  }
});

// Delete item
app.delete("/api/trips/:id", (req, res) => {
    db.deleteTripById(req.params.id).then(()=>{
      res.status(204).end();
    }).catch(()=>{
      res.json({"message": "Server internal error"});
    })
});

app.use((req, res) => {
  res.status(404).send('Resource not found');
});

db.initialize(MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});