import "./MyCheckbox.css";
const MyCheckbox = ({ setOriginal, original }) => {
  return (
    <article class="feature2" style={{border: original ? 'none':'solid'}}>
      <input
        type="checkbox"
        id="feature2"
        onClick={() => setOriginal(!original)}
      />
      <div>
        <span className="content">
          Use Original
          <br />
          Model
        </span>
      </div>
    </article>
  );
};

export default MyCheckbox;
