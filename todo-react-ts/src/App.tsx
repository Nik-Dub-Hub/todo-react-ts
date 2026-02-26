import { useState, useRef, useEffect } from "react";
import type { DragEvent } from "react";

type TodoItem = {
  index: number;
  value: string;
  isCheked: boolean;
};

type Setting = {
  index: number | null;
  value: string;
  visible: boolean;
};

export default function App() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [setting, setSetting] = useState<Setting>({
    index: null,
    value: "",
    visible: false,
  });
  const [draggedItem, setDraggedItem] = useState<TodoItem | null>();
  const [isDark, setIsDark] = useState(false);
  const [todoListItems, setTodoListItems] = useState<TodoItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("todoItems");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TodoItem[];
        setTodoListItems(
          parsed.length > 0
            ? parsed
            : [
                {
                  index: 1,
                  value: "Проверить почту и ответить на письма",
                  isCheked: true,
                },
                {
                  index: 2,
                  value: "Подготовить отчет по проекту",
                  isCheked: false,
                },
                {
                  index: 3,
                  value: "Позвонить клиенту для уточнения ТЗ",
                  isCheked: false,
                },
                {
                  index: 4,
                  value: "Протестировать новую фичу",
                  isCheked: false,
                },
              ],
        );
      } catch {
        setTodoListItems([
          {
            index: 1,
            value: "Проверить почту и ответить на письма",
            isCheked: true,
          },
          {
            index: 2,
            value: "Подготовить отчет по проекту",
            isCheked: false,
          },
          {
            index: 3,
            value: "Позвонить клиенту для уточнения ТЗ",
            isCheked: false,
          },
          {
            index: 4,
            value: "Протестировать новую фичу",
            isCheked: false,
          },
        ]);
      }
    }
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todoItems", JSON.stringify(todoListItems));
    localStorage.setItem("theme", JSON.stringify(isDark));
  }, [todoListItems, isDark]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [setting.value]);

  function handlerDragStart(e: DragEvent<HTMLLIElement>, item: TodoItem): void {
    setDraggedItem(item);
    e.dataTransfer!.effectAllowed = "move";
  }

  function handlerDragOver(e: DragEvent<HTMLLIElement>) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  }

  function handlerDragEnter(e: DragEvent<HTMLLIElement>) {
    e.preventDefault();
  }

  function handlerDrop(droppedItem: TodoItem) {
    if (!draggedItem) return;
    if (droppedItem.index === draggedItem.index) return;
    setTodoListItems((prev) => {
      const newListItems = [...prev];
      const draggedIndex = newListItems.findIndex(
        (item) => item.index === draggedItem.index,
      );
      const droppedIndex = newListItems.findIndex(
        (item) => item.index === droppedItem.index,
      );
      const [dragged] = newListItems.splice(draggedIndex, 1);
      newListItems.splice(droppedIndex, 0, dragged);
      return newListItems;
    });
    setDraggedItem(null);
  }

  function todoListItemsHendler() {
    if (inputValue !== "") {
      setTodoListItems((prev) => [
        ...prev,
        { index: Number(new Date()), value: inputValue, isCheked: false },
      ]);
      setInputValue("");
    }
  }

  function changeValueHandler() {
    if (setting.value !== "") {
      setTodoListItems((prev) =>
        prev.map((item) =>
          item.index === setting.index
            ? { ...item, value: setting.value }
            : item,
        ),
      );
      setSetting((prev) => ({
        value: "",
        index: null,
        visible: !prev.visible,
      }));
    }
  }

  function deleteHandler() {
    setTodoListItems((prev) => prev.filter((el) => el.index !== setting.index));
    setSetting((prev) => ({
      ...prev,
      index: null,
      visible: !prev.visible,
    }));
  }

  function chengCekboxHandler(index: number) {
    console.log(index, todoListItems);
    setTodoListItems((prev) =>
      prev.map((item) =>
        item.index === index ? { ...item, isCheked: !item.isCheked } : item,
      ),
    );
  }

  return (
    <>
      <div
        className={`
  min-h-screen w-full bg-gradient-to-br 
  ${
    isDark
      ? "from-gray-900 via-gray-900/80 to-gray-900"
      : "from-slate-100 via-blue-50 to-indigo-100"
  }
  p-4 sm:p-8 transition-all duration-500
`}
      >
        <div
          className={`
  max-w-4xl mx-auto p-8 bg-gradient-to-br 
  ${
    isDark
      ? "from-slate-800/50 to-slate-900/50 text-white border-white/20 backdrop-blur-xl"
      : "from-gray-50 to-gray-200 text-gray-900"
  }
  rounded-2xl shadow-2xl font-['Inter'] antialiased transition-all duration-500
`}
        >
          <div className="flex items-center justify-between mb-8">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDark}
                onChange={(e) => setIsDark(e.target.checked)}
              />
              <div
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
                  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                  peer-checked:after:border-white after:content-[''] after:absolute 
                  after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                  after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                  peer-checked:bg-blue-900"
              ></div>
            </label>
            <div className="flex items-center gap-2">
              {todoListItems.length > 0 && (
                <div
                  className={`
        px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
        ${
          isDark
            ? "bg-white/20 text-white/90 backdrop-blur-sm border border-white/30"
            : "bg-white/80 text-gray-700 border border-gray-200/50 shadow-sm"
        }
        transition-all duration-200
      `}
                >
                  <span>
                    {todoListItems.filter((item) => !item.isCheked).length}
                  </span>
                </div>
              )}
              <button
                className={`
        p-3 
        ${
          isDark
            ? "bg-white/20 hover:bg-white/30 text-white/90 hover:text-white border border-white/30"
            : "bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 border border-white/50"
        }
        backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl 
        transition-all duration-300 hover:scale-105 active:scale-95
      `}
                onClick={() => setTodoListItems([])}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-center mb-12">
            <h1
              className={`
        pb-5 text-5xl font-black drop-shadow-lg 
        ${isDark ? "text-white dark:drop-shadow-none" : "bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent"}
      `}
            >
              Things To Do
            </h1>
            <p
              className={`mt-2 ${isDark ? "text-gray-300 text-lg" : "text-gray-600 text-lg"}`}
            >
              Планируй Редактируй Перетаскивай
            </p>
          </div>
          <div
            className={`
    max-w-4xl mx-auto p-8 rounded-2xl shadow-xl font-['Inter'] antialiased transition-all duration-500
    ${
      isDark
        ? "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/20 backdrop-blur-xl text-white"
        : "bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-200/50 text-gray-900"
    }
  `}
          >
            <div className="flex gap-3 mb-6">
              <input
                className={`
    w-full p-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
    ${
      isDark
        ? "bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-white/30"
        : "bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500"
    }
  `}
                type="text"
                value={inputValue}
                placeholder="Надо сделать... (Enter для создания)"
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    todoListItemsHendler();
                  }
                }}
              />
              <button
                className={`
    px-6 py-3 rounded-lg font-medium shadow-lg 
    hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
    transition-all duration-200
    ${
      isDark
        ? "bg-gradient-to-r from-gray-800 via-blue-900 to-blue-900 text-white hover:from-gray-600 hover:via-blue-800 hover:to-blue-700"
        : "bg-gradient-to-r from-gray-400 via-blue-900 to-blue-900 text-white hover:from-gray-300 hover:via-blue-800 hover:to-blue-700"
    }
  `}
                onClick={() => todoListItemsHendler()}
              >
                Записать
              </button>
            </div>

            <ul>
              {todoListItems.map((item: TodoItem) => (
                <li
                  className={`
    flex flex-col gap-3 p-4 
    ${
      isDark
        ? "bg-slate-800/50 border-x border-white/10 hover:bg-white/10 hover:shadow-xl shadow-[0_-4px_6px_-4px_rgba(255,255,255,0.05)] text-white"
        : "bg-white border-x border-b border-gray-100 hover:bg-gray-50 shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.1)]"
    }
    ${
      item.index === 0
        ? "rounded-xl -mt-0 shadow-md border-b-0"
        : "rounded-t-2xl -mt-3 hover:shadow-md"
    }
    cursor-move transition-all group
    ${
      draggedItem?.index === item.index
        ? "opacity-50 scale-105 shadow-2xl z-20"
        : draggedItem
          ? ""
          : "hover:shadow-md"
    }
  `}
                  key={item.index}
                  draggable
                  onDragStart={(e) => handlerDragStart(e, item)}
                  onDragEnd={() => setDraggedItem(null)}
                  onDragOver={handlerDragOver}
                  onDragEnter={(e) => handlerDragEnter(e)}
                  onDrop={() => handlerDrop(item)}
                >
                  {setting.index === item.index && setting.visible ? (
                    <div className="w-full space-y-2">
                      <textarea
                        ref={inputRef}
                        className={`
    w-full p-3 border rounded-lg focus:outline-none focus:ring-2 resize-none min-h-[44px] max-h-32
    ${
      isDark
        ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-400"
        : "border-gray-200 focus:ring-blue-500"
    }
  `}
                        value={setting.value}
                        placeholder="Редактировать задачу..."
                        onChange={(e) =>
                          setSetting((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                        autoFocus
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          className="flex-1 py-2 px-4 bg-gradient-to-r via-blue-900 to-blue-900
    text-white rounded-lg font-medium shadow-lg 
    hover:from-gray-500 hover:via-blue-800 hover:to-blue-700
    hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
    transition-all duration-ё  200"
                          onClick={() => changeValueHandler()}
                        >
                          Сохранить
                        </button>
                        <button
                          className="flex-1 py-2 px-4 bg-gradient-to-r  via-blue-900 to-blue-900
    text-white rounded-lg font-medium shadow-lg 
    hover:from-gray-500 hover:via-blue-800 hover:to-blue-700
    hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
    transition-all duration-ё  200"
                          onClick={() => deleteHandler()}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.isCheked}
                        onChange={() => chengCekboxHandler(item.index)}
                        className="w-5 h-5 bg-white border-2 border-gray-300 rounded-md 
    focus:ring-0 cursor-pointer transition-all 
    hover:border-gray-400
    checked:bg-gradient-to-r checked:from-gray-900 checked:via-blue-900 checked:to-purple-900 
    checked:border-transparent checked:shadow-sm"
                      />

                      <span
                        className={`flex-1 min-w-0 truncate ${
                          item.isCheked ? "line-through opacity-30" : ""
                        }`}
                      >
                        {item.value}
                      </span>
                      <button
                        className={`
    ml-auto p-2 
    ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"} 
    rounded-lg transition-colors
  `}
                        onClick={() =>
                          setSetting((prev) => ({
                            ...prev,
                            index: item.index,
                            value: item.value,
                            visible: !prev.visible,
                          }))
                        }
                      >
                        <div className="flex flex-col justify-center gap-1 w-6 h-6 p-1">
                          <div className="w-5 h-0.5 bg-gray-300 rounded"></div>
                          <div className="w-5 h-0.5 bg-gray-300 rounded"></div>
                          <div className="w-5 h-0.5 bg-gray-300 rounded"></div>
                        </div>
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
