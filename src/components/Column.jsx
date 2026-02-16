import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import { useKanbanStore } from "../store/useKanbanStore";

const Column = ({ column, searchTerm, priorityFilter }) => {
  const cards = useKanbanStore((s) => s.cards);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { columnId: column.id },
  });

  const totalCards = column.cardIds.length;

  const filteredCardIds = column.cardIds.filter((id) => {
    const card = cards[id];
    if (!card) return false;

    const matchSearch = card.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchPriority =
      priorityFilter === "all" ||
      card.priority?.toLowerCase() === priorityFilter;

    return matchSearch && matchPriority;
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-3 rounded min-h-[100px]"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">
          {column.title}
          <span className="ml-2 text-sm text-gray-600">
            ({totalCards})
          </span>
        </h3>
      </div>

      <div className="h-[250px] sm:h-[300px] lg:h-[400px] overflow-y-auto pr-2">
        {filteredCardIds.length === 0 ? (
          <p className="text-red-500 text-sm text-center mt-6">
            No task found
          </p>
        ) : (
          <SortableContext
            items={filteredCardIds}
            strategy={verticalListSortingStrategy}
          >
            {filteredCardIds.map((id, index) => (
              <Card
                key={id}
                card={cards[id]}
                columnId={column.id}
                index={index}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};

export default Column;
