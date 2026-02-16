import ReactDOM from "react-dom";

const CardDetailModal = ({ card, onClose }) => {
  if (!card) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] p-6 rounded shadow-lg mx-5">
        <h2 className="text-lg font-semibold mb-4">Card Details</h2>

        <div className="space-y-2">
          <div>
            <span className="font-semibold">Title:</span> {card.title}
          </div>

          <div>
            <span className="font-semibold">Description:</span>{" "}
            {card.description || "-"}
          </div>

          <div>
            <span className="font-semibold">Assignee:</span>{" "}
            {card.assignee || "Unassigned"}
          </div>

          <div>
            <span className="font-semibold">Priority:</span> {card.priority}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body 
  );
};

export default CardDetailModal;

