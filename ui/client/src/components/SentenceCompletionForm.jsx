import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

function SentenceCompletionForm({ lang }) {
  const example =
    lang === "heb"
      ? "משפט לדוגמא לצורך עבודה"
      : "An Example sentence to work with";
  const [sentence, setSentence] = useState(example);
  const [mask, setMask] = useState(sentence.split(" ")[0]);
  const [result, setResult] = useState(null);
  const [answered, setAnswered] = useState(true);

  useEffect(() => {
    fetch("/" + lang)
      .then((res) => res.json())
      .then((data) => setResult(data.message));
  }, [lang]);

  const post = async (lang) => {
    console.log("before fetch");
    setAnswered(false);
    setResult(lang === "heb" ? "אנא המתן" : "loading...");
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
    console.log(res);
    const data = await res.json();
    setResult(data.response);
  };
  return (
    <div className="App">
      <h1>{lang === "heb" ? "השלמת משפט" : "Sentence Completion"}</h1>
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
        <label htmlFor="fname">Sentence:</label>
        <input
          className="Main-text-input"
          type="text"
          name="textbox"
          value={sentence}
          style={{ width: "50%" }}
          onChange={(e) => setSentence(e.target.value)}
        />
        <br />
        <label htmlFor="masks">Choose a MASK word:</label>
        <Form.Select
          style={{ width: "auto", display: "inline-block" }}
          className="Mask-list-select"
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
        <br />
        <textarea defaultValue={result}>{result}</textarea>
      </Form>
    </div>
  );
}

export default SentenceCompletionForm;
