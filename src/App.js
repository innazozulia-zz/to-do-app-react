import { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { List, AddList, Tasks } from "./components";

import axios from "axios";

import "./App.css";

function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    // const newList = lists.find((list) => list.id === Number(listId));
    // const listId = location.pathname.split("lists/")[1];
    const newList = lists.filter((list) => {
      axios.patch("http://localhost:3001/lists/" + list.id);
      // if (list.id != activeItem) {
      //   axios.patch("http://localhost:3001/lists/" + list.id);
      console.log("active");
      //   console.log(location);
      // }
      console.log(list.id);
      // console.log(listId);
    });
    return newList;

    // const listId = location.pathname.split("lists/")[1];
    // const list = lists.find((list) => list.id === Number(listId));
    // setActiveItem(lists);
    // navigate(`/lists/${list.id}`);
    navigate(`/lists/${newList}`);
  };

  // useEffect(() => {
  //   return navigate((location) => {
  //     const listId = location.pathname.split("lists/")[1];
  //     if (lists) {
  //       const list = lists.find((list) => list.id === Number(listId));
  //       console.log(list);
  //       setActiveItem(list);
  //     }
  //   });
  // }, [lists, location]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setLists(data);
      });
    axios.get("http://localhost:3001/colors").then(({ data }) => {
      setColors(data);
    });
  }, []);

  const onCompleteTask = (listId, taskId, completed) => {
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    axios
      .patch("http://localhost:3001/tasks/" + taskId, { completed })
      .catch(() => {
        alert("Failed");
      });
  };

  const onAddList = (obj) => {
    const newList = [...lists, obj];
    setLists(newList);
  };

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setLists(newList);
  };

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm("Are you sure?")) {
      const newList = lists.map((item) => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter((task) => task.id !== taskId);
        }
        return item;
      });
      setLists(newList);
      axios.delete("http://localhost:3001/tasks/" + taskId).catch(() => {
        alert("Failed to delete");
      });
    }
  };

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt("New task text", taskObj.text);
    if (!newTaskText) {
      return;
    }
    const newList = lists.map((list) => {
      if (list.id === listId) {
        lists.tasks = list.tasks.map((task) => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    axios
      .patch("http://localhost:3001/tasks/" + taskObj.id, { text: newTaskText })
      .catch(() => {
        alert("Failed to delete");
      });
  };

  const onEditListTitle = (id, title) => {
    const newList = lists.map((item) => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
  };

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <div>
          <List
            onClick={(list) => console.log(list.id)}
            items={[
              {
                active: true,
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3" y2="6"></line>
                    <line x1="3" y1="12" x2="3" y2="12"></line>
                    <line x1="3" y1="18" x2="3" y2="18"></line>
                  </svg>
                ),
                name: "All tasks",
                active: true,
              },
            ]}
          />

          {lists ? (
            <List
              items={lists}
              onRemove={(id) => {
                const newLists = lists.filter((item) => item.id !== id);
                setLists(newLists);
              }}
              onClickItem={(listId) => {
                setActiveItem(listId);
                handleClick();
              }}
              activeItem={activeItem}
              isRemovable
            />
          ) : (
            "loading"
          )}
          <AddList onAddList={onAddList} colors={colors} />
        </div>
      </div>

      <div className="todo__tasks">
        <Routes>
          <Route
            exact
            path="/"
            element={
              lists &&
              lists.map((list) => (
                <Tasks
                  key={list.id}
                  list={list}
                  onAddTask={onAddTask}
                  onEditTtitle={onEditListTitle}
                  onRemoveTask={onRemoveTask}
                  onEditTask={onEditTask}
                  onCompleteTask={onCompleteTask}
                  withoutEmpty
                />
              ))
            }
          />
          <Route
            path="/lists/"
            element={
              lists &&
              lists.map((list) => (
                <Tasks
                  key={list.id}
                  list={list}
                  onAddTask={onAddTask}
                  onEditTtitle={onEditListTitle}
                  onRemoveTask={onRemoveTask}
                  onEditTask={onEditTask}
                  onCompleteTask={onCompleteTask}
                  withoutEmpty
                />
              ))
            }
          />
          <Route
            path="/lists/:id"
            element={
              lists &&
              activeItem && (
                <Tasks
                  list={activeItem}
                  onAddTask={onAddTask}
                  onEditTitle={onEditListTitle}
                  onRemoveTask={onRemoveTask}
                  onEditTask={onEditTask}
                  onCompleteTask={onCompleteTask}
                />
              )
            }
          />
          <Route />
        </Routes>
      </div>
    </div>
  );
}

export default App;
