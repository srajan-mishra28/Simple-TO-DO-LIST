//! injected into the index.html
import "./styles.css";
import { useState } from "react";

//! simulating a backend ID system
let GLOBAL_TASK_ID = 46;

//! should contain all `action` on todoList?
function todoListReducer(currentValue, actionObj) {
  let copy = currentValue.slice();

  if (actionObj.type === "ADD_TASK") {
    const taskObj = {
      task: actionObj.val,
      completed: false,
      id: GLOBAL_TASK_ID++
    };

    copy.push(taskObj);

    return copy;
  } else if (actionObj.type === "DELETE_TASK") {
    //! new ref
    const copy = currentValue.filter((obj) => {
      //! keep all the elements which do not have
      //! current_id
      return obj.id !== actionObj.current_id;
    });
    return copy;
  } else if (actionObj.type === "EDIT_TASK") {
    //! do something
  } else if (actionObj.type === "MARK_COMPLETE") {
    //! add / modify in the new reference
    for (const obj of copy) {
      if (obj.id === actionObj.current_id) {
        obj.completed = !obj.completed;
      }
    }

    return copy;
  } else {
    throw new Error("action not recongnized");
  }
}

//! validation function
function isJustNumber(str) {
  return !isNaN(Number(str));
}

function Todo(props) {
  const task = props.task;
  const completed = props.completed;
  const current_id = props.id;

  let xyz = "non-do-tasks";
  if (task.startsWith("do")) {
    xyz = "do-tasks";
  } else if (task.startsWith("make")) {
    xyz = "make-tasks";
  }

  let taskEl = task;
  if (completed) {
    taskEl = <del>{task}</del>;
  }
  return (
    <>
      <li key={current_id} className={xyz}>
        {taskEl}
      </li>
      <button
        onClick={function () {
          props.setData(
            todoListReducer(props.data, {
              type: "MARK_COMPLETE",
              current_id: current_id
            })
          );
        }}
      >
        Mark
      </button>
      <button
        onClick={function () {
          props.setData(
            todoListReducer(props.data, { type: "DELETE_TASK", current_id })
          );
        }}
      >
        Delete
      </button>
      <button
        onClick={function () {
          //! IMPLEMENT
        }}
      >
        Edit
      </button>
    </>
  );
}

function TodoInput(props) {
  if (props.data.length === 3) {
    props.setData(null);
  }
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      onSubmit={function (event) {
        event.preventDefault();

        if (error.length > 0) {
          return;
        }

        props.setData(
          todoListReducer(props.data, { type: "ADD_TASK", val: inputVal })
        );

        setInputVal("");
      }}
    >
      <input
        type="text"
        onChange={function (event) {
          if (isEmpty(event.target.value)) {
            setError("Empty string!");
          } else if (isJustNumber(event.target.value)) {
            setError(
              "Cannot make task with just numbers. Try writing other things ..."
            );
          } else {
            setError("");
          }

          setInputVal(event.target.value);
        }}
        value={inputVal}
        required={true}
      />
      <button type="submit">Add</button>
      <div style={{ color: "red" }}>{error.length > 0 ? error : null}</div>
    </form>
  );
}

function isEmpty(str) {
  return str.length === 0;
}

function TodoList() {
  const [data, setData] = useState([]);

  let elm = data.map((todoData) => {
    return (
      <Todo
        task={todoData.task}
        id={todoData.id}
        completed={todoData.completed}
        setData={setData}
        data={data}
      />
    );
  });

  return (
    <div>
      <h1>What do you want to do today?</h1>
      <TodoInput setData={setData} data={data} />
      <ol>{elm}</ol>
    </div>
  );
}

export default function App() {
  return <TodoList />;
}
