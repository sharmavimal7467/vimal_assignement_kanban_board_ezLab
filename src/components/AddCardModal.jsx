import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const USERS = [
  "Aarav","Riya","Vimal","Rahul","Sneha",
  "Ankit","Neha","Pooja","Karan","Aditi",
  "Rohit","Priya",
];

const AddCardModal = ({ onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");
  const [showList, setShowList] = useState(false);

  const [errors, setErrors] = useState({});

  const titleRef = useRef();
  const descRef = useRef();
  const assigneeRef = useRef();
  const priorityRef = useRef();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignee("");
    setPriority("");
    setShowList(false);
    setErrors({});
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? "");
      setDescription(initialData.description ?? "");
      setAssignee(initialData.assignee ?? "");
      setPriority(initialData.priority ?? "");
    } else {
      resetForm();
    }
  }, [initialData]);

  const filteredUsers = USERS.filter((u) =>
    u.toLowerCase().includes(assignee.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!assignee.trim()) newErrors.assignee = "Assignee is required";
    if (!priority) newErrors.priority = "Priority is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.title) titleRef.current.focus();
      else if (newErrors.description) descRef.current.focus();
      else if (newErrors.assignee) assigneeRef.current.focus();
      else if (newErrors.priority) priorityRef.current.focus();
      return;
    }

    onSubmit({ title, description, assignee, priority });
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[400px] p-6 rounded mx-5">
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Card" : "Add Card"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full border p-2 rounded"
            />
            {errors.title && (
              <div className="text-red-500 text-xs mt-1">{errors.title}</div>
            )}
          </div>

          <div>
            <input
              ref={descRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />
            {errors.description && (
              <div className="text-red-500 text-xs mt-1">{errors.description}</div>
            )}
          </div>

          <div className="relative">
            <input
              ref={assigneeRef}
              value={assignee}
              onChange={(e) => {
                setAssignee(e.target.value);
                setShowList(true);
              }}
              placeholder="Assignee"
              className="w-full border p-2 rounded"
            />
            {errors.assignee && (
              <div className="text-red-500 text-xs mt-1">{errors.assignee}</div>
            )}
            {showList && assignee && (
              <ul className="absolute w-full bg-white border rounded mt-1 max-h-40 overflow-auto z-10">
                {filteredUsers.map((user) => (
                  <li
                    key={user}
                    onClick={() => {
                      setAssignee(user);
                      setShowList(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {user}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <select
              ref={priorityRef}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <div className="text-red-500 text-xs mt-1">{errors.priority}</div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="border border-blue-600 hover:border-blue-500 text-blue-600 hover:text-blue-500 px-3 py-1 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body 
  );
};

export default AddCardModal;
