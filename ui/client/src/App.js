import './App.css';
import { useState, useEffect } from 'react';
import SentenceCopletionForm from './components/SentenceCopletionForm';
function App() {
  

  return (
    <div className="App">
      <header className="App-header">
        Welcome to our app!
      </header>
      <SentenceCopletionForm lang='heb'/>
      <SentenceCopletionForm lang='en'></SentenceCopletionForm>
    </div>
  );
}
export default App;
