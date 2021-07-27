import { useState, useEffect } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import Results from "./Results";

function SentenceCompletionForm({ lang }) {
  const example =
    lang === "heb"
      ? "משפט לדוגמא לצורך עבודה"
      : "An Example sentence to work with";
  const [sentence, setSentence] = useState(example);
  const [mask, setMask] = useState(sentence.split(" ")[0]);
  const [result, setResult] = useState({ default: "" });
  const [answered, setAnswered] = useState(true);

  const label_for_mask = (
    <InputGroup.Text className="bg-dark" style={{ color: "darkgray" }}>
      {lang === "en" ? "MASK word:" : ":מילת מיסוך"}
    </InputGroup.Text>
  );

  const post = async (lang) => {
    console.log("before fetch");
    setAnswered(false);
    const res = await fetch("/" + lang, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: sentence,
        mask: mask,
      }),
    });
    console.log("after fetch");
    setAnswered(true);

    const as_json = await res.json();
    const content = as_json.response;
    setResult(JSON.parse(content));
  };
  return (
    <div className="App">
      <iframe
        title="dummy"
        name="dummyframe"
        id="dummyframe"
        style={{ display: "none" }}
      ></iframe>
      <Form
        target="dummyframe"
        id="sentence-completion-form"
        onSubmit={() => post(lang)}
      >
        <Form.Group className="mb-3">
          <Form.Label>{lang === "en" ? "Sentence" : "משפט"}:</Form.Label>
          <Form.Control
            className="Main-text-input bg-dark"
            type="text"
            name="textbox"
            value={sentence}
            onChange={(e) => {
              setSentence(e.target.value);
              setMask(e.target.value.split(" ")[0]);
            }}
            style={{ color: "white" }}
          />
          <br />
          <InputGroup className="mb-3">
            {lang === "en" ? label_for_mask : null}
            <Form.Select
              className="bg-dark"
              style={{ width: "auto", display: "inline-block", color: "white" }}
              id="masks"
              name="masklist"
              onChange={(e) => setMask(e.target.value)}
            >
              {sentence.split(" ").map((word, index) => (
                <option key={index} value={word}>
                  {word}
                </option>
              ))}
            </Form.Select>

            {lang === "heb" ? label_for_mask : null}
          </InputGroup>
          <fieldset disabled={!answered}>
            <Button
              className="btn btn-primary"
              type="submit"
              value={lang === "heb" ? "אישור" : "Submit"}
              disabled={!answered}
            >
              {lang === "heb" ? "אישור" : "Submit"}
            </Button>
          </fieldset>
          {answered ? <br /> : <Spinner animation="border" variant="primary" />}

          <Results json={result} />
        </Form.Group>
      </Form>
    </div>
  );
}

export default SentenceCompletionForm;
