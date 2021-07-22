// server/index.js

const express = require("express");
const bodyParser = require('body-parser')
const PythonShell = require('python-shell')

const PORT = process.env.PORT || 3001;
var ans = 'no results yet'
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ message: ans });
});


app.post("/", bodyParser.json(), (req, res) => {
  console.log('working on: ' + req.body.textbox)
  console.log('with mask: ' + req.body.masklist)
  const scriptPath = '../AlephBERT-main/models/alephbert-base/english-model.py'
  const pyshell = new PythonShell.PythonShell(scriptPath, { args: [req.body.textbox, req.body.masklist] })
  pyshell.on('message', (output) => {
    ans = output
    console.log('result:' + output)
  })
  pyshell.end((err) => {
    if (err) {
      throw err;
    }
  })


})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



