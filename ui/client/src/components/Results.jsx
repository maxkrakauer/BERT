import { Table } from "react-bootstrap";

function Results({ json }) {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr key="head">
          <th>#</th>
          <th>word</th>
          <th>probability</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(json).map(([w, p], index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{w}</td>
            <td>{p}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Results;
