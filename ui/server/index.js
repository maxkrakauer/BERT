// server/index.js

const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')
const PythonShell = require('python-shell')

const PORT = process.env.PORT || 3001;
var ans_en = 'no results yet'
var ans_heb = 'עדיין אין תוצאות...'
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.get("/heb", (req, res) => {
  res.json({ message: {ans_heb} });
});
app.get("/en", (req, res) => {
  res.json({ message: {ans_en} });
});

const execute_bert = (lang, text, mask, res)=>{
  var scriptPath = '';
  if(lang === 'en'){
    scriptPath = '../AlephBERT-main/models/alephbert-base/english-model.py'
  }
  else if(lang === 'heb'){
    scriptPath = '../AlephBERT-main/models/alephbert-base/hebrew-model.py'
  }
  const pyshell = new PythonShell.PythonShell(scriptPath, { args: [text, mask] })
  pyshell.on('message', (output) => {
    console.log('result:' + output)
    if(lang === 'en'){
      ans_en = output;
    }
    else if(lang === 'heb'){

      ans_heb = output;
    }
    res.send({response: output});
    return output

  })
  pyshell.end((err) => {
    if (err) {
      throw err;
    }
  })
  return 'somthing went wrong...';
}

app.post("/heb", (req, res) => {
  const body = req.body;
  const text = body.text;
  const mask = body.mask;
  const original = body.original
  console.log('working on: ' + text)
  console.log('with mask: ' + mask)
  ans_heb = 'loading...';
  ans_heb = execute_bert('heb', text, mask, res)
  return ans_heb
})

app.post("/en", (req, res) => {
  const body = req.body;
  const text = body.text;
  const mask = body.mask;
  console.log('working on: ' + text)
  console.log('with mask: ' + mask)
  ans_en = 'loading...';
  ans_en = execute_bert('en', text, mask, res)
  return ans_en;
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



