import { useState, useEffect } from "react";

function SentenceCompletionForm({ lang }) {
  const example =
    lang === "heb"
      ? "משפט לדוגמא לצורך עבודה"
      : "An Example sentence to work with";
  const [sentence, setSentence] = useState(example);
  const [mask, setMask] = useState(sentence.split(" ")[0]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/" + lang)
      .then((res) => res.json())
      .then((data) => setResult(data.message));
  }, []);

  const post = async (lang) => {
    console.log("before fetch");
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
      <form
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

        <select
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
        </select>

        <input type="submit" />
        <h1>{result}</h1>
      </form>
    </div>
  );
}

export default SentenceCompletionForm;