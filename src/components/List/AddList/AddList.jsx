import { useState, useEffect } from "react";
import Badge from "../Badge/Badge";
import List from "../List/List";

import "./AddList.scss";

import axios from "axios";

function AddList({ colors, onAddList }) {
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [selectedColor, setSelectedColor] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (Array.isArray(colors)) {
      setSelectedColor(colors[0].id);
    }
  }, [colors]);

  const closeList = () => {
    setVisiblePopup(false);
    setInputValue("");
    setSelectedColor(colors[0].id);
  };

  const addList = () => {
    if (!inputValue) {
      alert("Empty Field!");
      return;
    }
    setIsLoading(true);
    axios
      .post("http://localhost:3001/lists", {
        name: inputValue,
        colorId: selectedColor,
      })
      .then(({ data }) => {
        const color = colors.filter((c) => c.id === selectedColor)[0];
        const listObj = { ...data, color, tasks: [] };
        onAddList(listObj);
        closeList();
      })
      .catch(() => {
        alert("Error When Adding List!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="add-list">
      <List
        onClick={() => setVisiblePopup(true)}
        // onClick={() => setVisiblePopup(!visiblePopup)}
        items={[
          {
            className: "list__add-button",
            icon: (
              <svg
                width="10px"
                height="10px"
                viewBox="0 0 14 14"
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
                  <g
                    id="Rounded"
                    transform="translate(-411.000000, -1487.000000)"
                  >
                    <g
                      id="Content"
                      transform="translate(100.000000, 1428.000000)"
                    >
                      <g
                        id="-Round-/-Content-/-add"
                        transform="translate(306.000000, 54.000000)"
                      >
                        <g transform="translate(0.000000, 0.000000)">
                          <polygon
                            id="Path"
                            points="0 0 24 0 24 24 0 24"
                          ></polygon>
                          <path
                            d="M18,13 L13,13 L13,18 C13,18.55 12.55,19 12,19 C11.45,19 11,18.55 11,18 L11,13 L6,13 C5.45,13 5,12.55 5,12 C5,11.45 5.45,11 6,11 L11,11 L11,6 C11,5.45 11.45,5 12,5 C12.55,5 13,5.45 13,6 L13,11 L18,11 C18.55,11 19,11.45 19,12 C19,12.55 18.55,13 18,13 Z"
                            fill="#1D1D1D"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            ),
            name: "Add new list",
          },
        ]}
      />
      {visiblePopup && (
        <div className="add-list__popup">
          <svg
            // onClick={() => setVisiblePopup(false)}
            onClick={closeList}
            className="add-list__popup-close-btn"
            version="1.1"
            width="10px"
            height="10px"
            xmlns="http://www.w3.org/2000/svg"
            x="14px"
            y="0px"
            viewBox="0 0 60.963 60.842"
          >
            <path
              d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
	c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
	l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
	l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
	C61.42,57.647,61.42,54.687,59.595,52.861z"
            />
          </svg>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="field"
            type="text"
            placeholder="New list"
          ></input>
          <div className="add-list__popup-colors">
            {/* <Badge color="green" /> */}
            {colors.map((color, colorId) => (
              <Badge
                onClick={() => setSelectedColor(color.id)}
                key={colorId}
                color={color.name}
                className={selectedColor === color.id && "active"}
              />
            ))}
          </div>
          <button onClick={addList} className="button">
            {isLoading ? "Access..." : "Add"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AddList;
