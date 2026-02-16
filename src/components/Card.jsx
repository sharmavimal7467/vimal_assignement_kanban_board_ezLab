import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddCardModal from "./AddCardModal";
import CardDetailModal from "./CardDetailModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useKanbanStore } from "../store/useKanbanStore";

const PRIORITY_COLORS = {
  low: "bg-green-500",
  medium: "bg-yellow-400",
  high: "bg-red-500",
};

const Card = ({ card, columnId, index, isOverlay = false }) => {
  const updateCard = useKanbanStore((s) => s.updateCard);
  const deleteCard = useKanbanStore((s) => s.deleteCard);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const enableSortable = !isOverlay && !isDetailOpen && !isEditOpen && !isDeleteConfirmOpen;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: card.id,
    data: { columnId, index },
    animateLayoutChanges: () => !isOverlay,
    disabled: !enableSortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isOverlay ? "grabbing" : enableSortable ? "grab" : "default",
    boxShadow: isOverlay
      ? "0 10px 25px rgba(0,0,0,0.2)"
      : isHover && enableSortable
      ? "0 4px 12px rgba(0,0,0,0.15)"
      : "0 1px 3px rgba(0,0,0,0.1)",
    opacity: enableSortable ? 1 : 0.6, 
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    marginBottom: "0.5rem",
    border: (isHover && enableSortable) ? "1px solid #ddd" : "1px solid transparent",
    position: "relative",
    pointerEvents: enableSortable ? "auto" : "none",
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(enableSortable ? attributes : {})}
        {...(enableSortable ? listeners : {})}
        onMouseEnter={enableSortable ? () => setIsHover(true) : undefined}
        onMouseLeave={enableSortable ? () => setIsHover(false) : undefined}
      >
        <div
          className={`absolute top-2 right-2 w-3 h-3 rounded-full ${PRIORITY_COLORS[card.priority]}`}
          title={`Priority: ${card.priority}`}
        />

        <div className="font-medium">{card.title}</div>
        <div className="text-xs text-gray-500 mt-1">
          <span className="text-amber-500">{card.assignee || "Unassigned"}</span>
        </div>

        {enableSortable && !isOverlay && (
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs font-semibold px-2 py-1 rounded-full border border-gray-300 text-gray-700">
              {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailOpen(true);
                }}
                className="text-green-600 text-xs cursor-pointer hover:underline"
              >
                View
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditOpen(true);
                }}
                className="text-blue-600 text-xs cursor-pointer hover:underline"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteConfirmOpen(true);
                }}
                className="text-red-600 text-xs cursor-pointer hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditOpen && (
        <AddCardModal
          initialData={card}
          onClose={() => setIsEditOpen(false)}
          onSubmit={(data) => {
            updateCard(card.id, data);
            setIsEditOpen(false);
          }}
        />
      )}

      {isDetailOpen && (
        <CardDetailModal
          card={card}
          onClose={() => setIsDetailOpen(false)}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => deleteCard(card.id, columnId)}
      />
    </>
  );
};


export default Card;
