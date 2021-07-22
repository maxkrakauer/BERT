import './App.css';
import { useState, useEffect, Component } from 'react';

function App() {
  const [sentence, setSentence] = useState('An Example sentence to work with');
  const [mask, setMask] = useState(sentence[0])
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setResult(data.message));
  }, [this])

  return (
    <div className="App">
      <header className="App-header">
        Welcome to our app!
      </header>
      <h1>Sentence Completion</h1>

      <form action='' id="sentence-completion-form" method='POST' onSubmit={ () => {
        fetch("/api")
          .then((res) => res.json())
          .then((data) => setResult(data.message));
      } }>
        <label htmlFor="fname">Sentence:</label>

        <input className='Main-text-input' type="text" id="text-box" name="textbox" value={ sentence } onChange={ (e) => setSentence(e.target.value) } />
        <br />

        <label htmlFor="masks">Choose a MASK word:</label>

        <select className="Mask-list-select" id="masks" name="masklist" onChange={ (e) => setMask(e.target.value) }>
          { sentence.split(' ').map(
            word => <option key={ word } value={ word }>{ word }</option>
          )
          }
        </select>

        <input type="submit" formMethod='post' />
      </form>
      <output>{ result }</output>
    </div>
  );
}

export default App;
