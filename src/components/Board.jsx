import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";

import Column from "./Column";
import Card from "./Card";
import AddCardModal from "./AddCardModal";
import { useKanbanStore } from "../store/useKanbanStore";

const Board = () => {
  const columns = useKanbanStore((s) => s.columns);
  const cards = useKanbanStore((s) => s.cards);
  const moveWithin = useKanbanStore((s) => s.moveCardWithinColumn);
  const moveAcross = useKanbanStore((s) => s.moveCardAcrossColumns);
  const addCard = useKanbanStore((s) => s.addCard);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const isFilterActive = searchTerm.trim() !== "" || priorityFilter !== "all";

  const handleDragStart = ({ active }) => {
    setActiveCardId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      setActiveCardId(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    const fromCol = activeData.columnId;
    const toCol = overData?.columnId || over.id;
    const fromIndex = activeData.index;
    const toIndex = overData?.index ?? 0;

    if (fromCol === toCol) {
      moveWithin(fromCol, fromIndex, toIndex);
    } else {
      moveAcross(fromCol, toCol, active.id, toIndex);
    }

    setActiveCardId(null);
  };

  const handleAddCard = (data) => {
    addCard({ ...data, columnId: "todo" });
    setIsModalOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriorityFilter("all");
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-2 lg:px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Card
        </button>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className={`px-2 lg:px-4 py-2 border rounded transition
            ${
              priorityFilter !== "all"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }
          `}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`px-2 lg:px-4 py-2 border rounded w-full lg:w-64 transition
            ${searchTerm ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          `}
        />

        <button
          onClick={clearFilters}
          disabled={!isFilterActive}
          className={`px-3 py-2 text-sm border rounded transition
    ${
      isFilterActive
        ? "border-red-400 text-red-600 hover:bg-red-50 cursor-pointer"
        : "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100"
    }
  `}
        >
          Clear Filters
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Object.values(columns).map((col) => (
            <Column
              key={col.id}
              column={col}
              searchTerm={searchTerm}
              priorityFilter={priorityFilter}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCardId && (
            <Card
              card={cards[activeCardId]}
              columnId={null}
              index={0}
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {isModalOpen && (
        <AddCardModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddCard}
        />
      )}
    </div>
  );
};

export default Board;
