import { Link } from "react-router-dom";
import AddTaskForm from "./AddTaskForm";
import Task from "./Task";

import axios from "axios";

import "./Tasks.scss";

const Tasks = ({
  list,
  onEditTitle,
  onAddTask,
  withoutEmpty,
  onRemoveTask,
  onEditTask,
  onCompleteTask,
}) => {
  const editTitle = () => {
    const newTitle = window.prompt("List name", list.name);
    if (newTitle) {
      onEditTitle(list.id, newTitle);
      axios
        .patch("http://localhost:3001/lists/" + list.id, {
          name: newTitle,
        })
        .catch(() => {
          alert("Failed to update");
        });
    }
  };

  return (
    <div className="tasks">
      <Link to={`/lists/${list.id}`}>
        <h2 style={{ color: list.color.hex }} className="tasks__title">
          {list.name}
          <svg
            onClick={editTitle}
            className="edit"
            width="14px"
            height="14px"
            viewBox="0 0 18 18"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              id="Icons"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="Rounded" transform="translate(-579.000000, -2771.000000)">
                <g id="Image" transform="translate(100.000000, 2626.000000)">
                  <g
                    id="-Round-/-Image-/-edit"
                    transform="translate(476.000000, 142.000000)"
                  >
                    <g transform="translate(0.000000, 0.000000)">
                      <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                      <path
                        d="M3,17.46 L3,20.5 C3,20.78 3.22,21 3.5,21 L6.54,21 C6.67,21 6.8,20.95 6.89,20.85 L17.81,9.94 L14.06,6.19 L3.15,17.1 C3.05,17.2 3,17.32 3,17.46 Z M20.71,7.04 C21.1,6.65 21.1,6.02 20.71,5.63 L18.37,3.29 C17.98,2.9 17.35,2.9 16.96,3.29 L15.13,5.12 L18.88,8.87 L20.71,7.04 Z"
                        fill="#1D1D1D"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </h2>
      </Link>
      <div className="tasks__items">
        {!withoutEmpty && list.tasks && !list.tasks.length && (
          <h2>Tasks not found</h2>
        )}
        {list.tasks &&
          list.tasks.map((task) => (
            <Task
              key={task.id}
              list={list}
              {...task}
              onRemove={onRemoveTask}
              onEdit={onEditTask}
              onComplete={onCompleteTask}
            />
          ))}
        <AddTaskForm list={list} onAddTask={onAddTask} />
      </div>
    </div>
  );
};

{
  /* <h2 style={{ color: list.color.hex }} className="tasks__title">
        {list.name}
        <svg
          onClick={editTitle}
          className="edit"
          width="14px"
          height="14px"
          viewBox="0 0 18 18"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="Icons"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g id="Rounded" transform="translate(-579.000000, -2771.000000)">
              <g id="Image" transform="translate(100.000000, 2626.000000)">
                <g
                  id="-Round-/-Image-/-edit"
                  transform="translate(476.000000, 142.000000)"
                >
                  <g transform="translate(0.000000, 0.000000)">
                    <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                    <path
                      d="M3,17.46 L3,20.5 C3,20.78 3.22,21 3.5,21 L6.54,21 C6.67,21 6.8,20.95 6.89,20.85 L17.81,9.94 L14.06,6.19 L3.15,17.1 C3.05,17.2 3,17.32 3,17.46 Z M20.71,7.04 C21.1,6.65 21.1,6.02 20.71,5.63 L18.37,3.29 C17.98,2.9 17.35,2.9 16.96,3.29 L15.13,5.12 L18.88,8.87 L20.71,7.04 Z"
                      fill="#1D1D1D"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </h2> */
}
export default Tasks;
