import { useState } from "react";
import "./styles.css";

export default function App() {
  let [val, setVal] = useState("");
  let [data, setData] = useState([]);
  let [error, setError] = useState("");
  let elm = data.map((dataEl) => {
    let xyz = "non-priority-task";
    if (
      dataEl.includes("priority") ||
      dataEl.includes("Priority") ||
      dataEl.toLowerCase().includes("important")
    ) {
      xyz = "priority-task";
    }

    return <li className={xyz}>{dataEl}</li>;
  });

  return (
    <div>
      What do you want to do?
      <form
        onSubmit={() => {
          if (error.length > 0) return;
          let temp = data.slice();
          temp.push(val);
          setData(temp);
          setVal("");
        }}
      >
        <input
          type="text"
          value={val}
          onChange={(event) => {
            if (event.target.value.length === 0) {
              setError("Empty String");
            } else if (containsOnlyDigit(event.target.value)) {
              setError("Contains only digits");
            } else {
              setError("");
            }
            setVal(event.target.value);
          }}
          required={true}
        ></input>
        <button type="submit">Add</button>
      </form>
      <div style={{ color: "red" }}>{error.length > 0 ? error : null}</div>
      <div>
        <ol>{elm}</ol>
      </div>
    </div>
  );
}
function containsOnlyDigit(string) {
  return !isNaN(Number(string));
}
