import './App.css';
import { useState, useEffect } from 'react';
import myOutput from './components/Output';
function App() {
  const [sentence, setSentence] = useState('An Example sentence to work with');
  const [mask, setMask] = useState(sentence[0])
  const [result, setResult] = useState(null)


  useEffect(() => {
   fetch("/api")
          .then((res) => res.json())
          .then((data) => setResult(data.message));

  }, [])
  const post = async () =>{
   const res = await fetch('/',{
      method: 'POST',
      headers: {
      Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: sentence,
        mask: mask
      })
    });
   const data = await res.json();
   setResult(data.response)
  }
    return (
    <div className="App">
      <header className="App-header">
        Welcome to our app!
      </header>
      <h1>Sentence Completion</h1>
      <form
          action='localhost:3000'
          id="sentence-completion-form"
          onSubmit={()=>post()}
      >
        <label htmlFor="fname">Sentence:</label>
        <input
            className='Main-text-input'
            type="text"
            name="textbox"
            value={ sentence }
            style={{width: '50%'}}
            onChange={
                (e) => setSentence(e.target.value)
            }/>

        <br />
        <label htmlFor="masks">Choose a MASK word:</label>

        <select className="Mask-list-select" id="masks" name="masklist" onChange={ (e) => setMask(e.target.value) }>
          {
              sentence.split(' ').map(
                  (word,index) => <option key={index} value={ word }>{ word }</option>
          )
          }
        </select>

        <input type="submit" />
        <h1>{result}</h1>
      </form>

    </div>
  );
}
export default App;
