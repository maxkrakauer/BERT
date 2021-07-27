import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
            <h1>Sentence Completion</h1>
          </Col>
          <Col>
            <h1>השלמת משפט</h1>
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
