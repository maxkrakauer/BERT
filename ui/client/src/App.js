import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css";
//import 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css';

import { Container, Row, Col } from 'react-bootstrap';

import SentenceCompletionForm from './components/SentenceCompletionForm';
function App() {
  

  return (
    <div className="App bg-dark">
      <header className="App-header">
        Welcome to our app!
      </header>
      <Container>
        <Row>
          <Col>
            <h1 style={{color: 'darkgray'}}>Sentence Completion</h1>
          </Col>
          <Col>
            <h1 style={{color: 'darkgray'}}>השלמת משפט</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <SentenceCompletionForm lang='en'/>
          </Col>
          <Col>
            <SentenceCompletionForm lang='heb'/>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default App;
