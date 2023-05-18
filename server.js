const express = require('express');
const app = express();
const cors = require('cors');
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: "API Listening"});
});

app.use((req, res) => {
  res.status(404).send('Resource not found');
});

app.listen(HTTP_PORT, () => {
  console.log('Ready to handle requests on port ' + HTTP_PORT);
});