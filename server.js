const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`Server now live on http://localhost:${port}`)
});