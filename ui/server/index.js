// server/index.js

const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')
const PythonShell = require('python-shell')

const PORT = process.env.PORT || 3001;
var ans = 'no results yet'
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.get("/api", (req, res) => {
  res.json({ message: ans });
});

app.post("/", (req, res) => {
  const body = req.body;
  const text = body.text;
  const mask = body.mask;
  console.log('working on: ' + text)
  console.log('with mask: ' + mask)
  ans = 'loading...';
  const scriptPath = '../AlephBERT-main/models/alephbert-base/english-model.py'
  const pyshell = new PythonShell.PythonShell(scriptPath, { args: [text, mask] })
  pyshell.on('message', (output) => {
    ans = output
    console.log('result:' + output)

  })
  pyshell.end((err) => {
    if (err) {
      throw err;
    }
    res.send({response: ans});
  })


})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



