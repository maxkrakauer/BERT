import { useState, useEffect } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import Results from "./Results";
import MyCheckbox from "./MyCheckbox";
import "./SentenceCompletionForm.css";
function SentenceCompletionForm({ lang }) {
  const example =
    lang === "heb"
      ? "משפט לדוגמא לצורך עבודה"
      : "An Example sentence to work with";
  const [sentence, setSentence] = useState(example);
  const [mask, setMask] = useState(sentence.split(" ")[0]);
  const [result, setResult] = useState({ default: "" });
  const [answered, setAnswered] = useState(true);
  const [original, setOriginal] = useState(false);

  const label_for_mask = (
    <InputGroup.Text className="bg-dark" style={{ color: "darkgray" }}>
      {lang === "en" ? "MASK word:" : ":מילת מיסוך"}
    </InputGroup.Text>
  );
  const label_for_sentence = (
    <InputGroup.Text className="bg-dark" style={{ color: "darkgray" }}>
      {lang === "en" ? "Sentence:" : ":משפט"}
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
        original: original,
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
          <InputGroup className="mb-3">
            {lang === "en" ? label_for_sentence : null}

            <Form.Control
              className="Main-text-input bg-dark"
              type="text"
              name="textbox"
              value={sentence}
              onChange={(e) => {
                const s = e.target.value;
                const ssplit = s.split(" ");
                const index = sentence.split(" ").indexOf(mask);
                const resindex = index >= ssplit.length ? 0 : index;
                setSentence(s);
                setMask(ssplit[resindex]);
              }}
              style={{ color: "white" }}
            />
            {lang === "heb" ? label_for_sentence : null}
          </InputGroup>
          <br />
          <InputGroup className="mb-3">
            {lang === "en" ? label_for_mask : null}
            <Form.Select
              className="bg-dark"
              style={{ width: "auto", display: "inline-block", color: "white" }}
              id="masks"
              name="masklist"
              onChange={(e) => {
                setMask(e.currentTarget.value);
              }}
              defaultValue={sentence.split(" ")[0]}
            >
              {sentence.split(" ").map((word, index) => (
                <option key={index} value={word}>
                  {word}
                </option>
              ))}
            </Form.Select>

            {lang === "heb" ? label_for_mask : null}
          </InputGroup>
          <fieldset disabled={!answered} style={{ display: "inline-block" }}>
            {lang === "heb" ? (
              <MyCheckbox
                setOriginal={setOriginal}
                original={original}
              ></MyCheckbox>
            ) : null}
            <Button
              className="btn btn-primary"
              type="submit"
              value={lang === "heb" ? "אישור" : "Submit"}
              style={{ marginBottom: "30px" }}
            >
              {lang === "heb" ? "אישור" : "Submit"}
            </Button>
            {answered ? (
              <br />
            ) : (
              <Spinner
                animation="border"
                variant="primary"
                style={{ margin: "10px" }}
              />
            )}
          </fieldset>

          <Results json={result} />
        </Form.Group>
      </Form>
    </div>
  );
}

export default SentenceCompletionForm;
