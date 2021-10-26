import './App.css';
import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";
import { request } from "./request";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleChange = (event) => {
    event.preventDefault();
    setTask(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentTask = { name: task, timestamp: Date.now() };
    setTasks([...tasks, currentTask]);
    setTask("");
    request("POST", '/tasks', currentTask)
      .then(response =>
        response.ok ?
          setNotification("Work task logged to database") :
          Promise.reject("Unable to add task at this time"))
      .catch((err) => setError(err));
  }

  useEffect(() => {
    request("GET", '/tasks')
      .then(response => response.ok ? response.json() : Promise.reject("Unable to retrieve tasks at this time"))
      .then(response => setTasks(response))
      .catch((err) => setError(err))
  }, []);

  return (
    <div className="text-center">
      {notification ?
        (<div className="bg-green-300 text-green-700 border-2 border-green-700 notification">{notification}</div>) : null}
      {error ? (<div className="bg-red-300 text-red-700 border-2 border-red-700 notification">{error}</div>) : null}
      <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl mb-4 w-8/12 py-4 rounded border-2">Work Logger App</h1>
        <div className="grid grid-cols-2 gap-4 text-xl w-8/12 py-4 rounded border-2">
          <div className="text-blue-500">Task</div>
          <div className="text-blue-500">Timestamp</div>
          {
            tasks && tasks.map((t, idx) => (
              <React.Fragment key={idx}>
                <div className="text-white text-left ml-4">{t.name}</div>
                <div className="text-white">{dateFormat(t.timestamp, "ddd, mmm dS, yyyy, h:MM TT")}</div>
              </React.Fragment>
            ))
          }
        </div>
        <form className="flex text-4xl mb-4 w-8/12 py-4" onSubmit={handleSubmit}>
          <input type="text" autoFocus={true} placeholder="Add New Task" className="text-black text-2xl mx-4 pl-2 border-4 w-8/12 border-blue-500 rounded" value={task} onChange={handleChange} />
          <input type="submit" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg" value="Add New" />
        </form>
      </div>
    </div>
  );
}

export default App;