import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SentenceCompletionForm from './components/SentenceCompletionForm';
function App() {
  

  return (
    <div className="App">
      <header className="App-header">
        Welcome to our app!
      </header>
      <SentenceCompletionForm lang='heb'/>
      <SentenceCompletionForm lang='en'/>
    </div>
  );
}
export default App;
