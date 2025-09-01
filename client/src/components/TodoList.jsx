import { useState } from "react";
import { CheckCircle, Circle, Plus, Trash2, ListTodo } from "lucide-react";
import { usePopup } from "../context/PopupContext";
import { useAuth } from "../store/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function TodoList() {
  const { showTodo, closeAll, todos, addTodo, toggleTodoItem, deleteTodo } = usePopup();
  const { isLoggedIn } = useAuth();
  const [newTodo, setNewTodo] = useState("");
  const [open, setOpen] = useState(false); // widget toggle state

  const handleAdd = () => {
    if (!isLoggedIn) return;
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo("");
    }
  };

  // Ensure todos is always an array
  const todoList = Array.isArray(todos) ? todos : [];

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: 15 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="fixed bottom-4 right-4 z-50 p-4 rounded-full shadow-lg bg-primary text-white hover:bg-primary-dark transition"
      >
        <ListTodo size={24} />
      </motion.button>

      {/* Todo Widget */}
      <AnimatePresence>
        {open && showTodo && (
          <motion.div
            key="todo-widget"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-20 right-4 z-50 w-80 max-w-full"
          >
            <motion.div
              layout
              className="p-4 rounded-2xl shadow-xl shadow-black/30 bg-white dark:bg-dark-bg-primary transition-colors"
            >
              {/* Header */}
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-xl font-bold mb-4 flex justify-between items-center text-black dark:text-dark-text-primary"
              >
                Todo List
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary flex items-center gap-2">
                  <CheckCircle className="text-success" />{" "}
                  {todoList.filter((t) => t.completed).length} /{" "}
                  {todoList.length}
                </span>
              </motion.h2>

              {!isLoggedIn && (
                <p className="text-sm text-red-500 mb-2">
                  Please log in to manage your todos.
                </p>
              )}

              {/* Todos */}
              {todoList.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-500 dark:text-dark-text-secondary text-center py-4"
                >
                  No tasks available.
                </motion.p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {todoList.map((todo, idx) => (
                      <motion.li
                        key={todo._id || todo.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{
                          duration: 0.25,
                          delay: idx * 0.05,
                          type: "spring",
                          stiffness: 120,
                        }}
                        layout
                        className="flex items-center gap-2 p-2 border rounded border-gray-300 dark:border-dark-border"
                      >
                        <button
                          disabled={!isLoggedIn}
                          onClick={() =>
                            toggleTodoItem(todo._id || todo.id)
                          }
                        >
                          {todo.completed ? (
                            <CheckCircle className="text-success" />
                          ) : (
                            <Circle className="text-gray-500 dark:text-dark-text-secondary" />
                          )}
                        </button>
                        <span
                          className={`${
                            todo.completed
                              ? "line-through text-gray-500 dark:text-dark-text-secondary"
                              : "text-black dark:text-dark-text-primary"
                          } flex-1`}
                        >
                          {todo.text}
                        </span>
                        <button
                          disabled={!isLoggedIn}
                          onClick={() => deleteTodo(todo._id || todo.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {/* Input + Add Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 mt-4"
              >
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                  }}
                  placeholder={isLoggedIn ? "New task..." : "Login to add tasks"}
                  disabled={!isLoggedIn}
                  className="flex-1 p-2 border rounded border-gray-300 dark:border-dark-border bg-gray-50 dark:bg-dark-bg-secondary text-black dark:text-dark-text-primary"
                />

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAdd}
                  disabled={!isLoggedIn}
                  className={`p-2 rounded flex items-center ${
                    isLoggedIn
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <Plus size={18} />
                </motion.button>
              </motion.div>

              {/* Close button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex justify-end mt-2"
              >
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-500 dark:text-dark-text-secondary hover:underline"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
