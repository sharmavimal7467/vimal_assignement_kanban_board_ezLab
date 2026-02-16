import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";

export const useKanbanStore = create(
  persist(
    (set) => ({
      columns: {
        todo: { id: "todo", title: "To Do", cardIds: [] },
        inprogress: { id: "inprogress", title: "In Progress", cardIds: [] },
        done: { id: "done", title: "Done", cardIds: [] },
      },
      cards: {},
      moveCardWithinColumn: (columnId, from, to) =>
        set((state) => ({
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              cardIds: arrayMove(state.columns[columnId].cardIds, from, to),
            },
          },
        })),

      moveCardAcrossColumns: (fromCol, toCol, cardId, toIndex) =>
        set((state) => {
          const fromCards = [...state.columns[fromCol].cardIds];
          const toCards = [...state.columns[toCol].cardIds];

          return {
            columns: {
              ...state.columns,
              [fromCol]: {
                ...state.columns[fromCol],
                cardIds: fromCards.filter((id) => id !== cardId),
              },
              [toCol]: {
                ...state.columns[toCol],
                cardIds: [...toCards.slice(0, toIndex), cardId, ...toCards.slice(toIndex)],
              },
            },
          };
        }),

      addCard: ({ title, description, assignee, priority, columnId }) =>
        set((state) => {
          const id = crypto.randomUUID();
          return {
            cards: {
              ...state.cards,
              [id]: { id, title, description, assignee, priority },
            },
            columns: {
              ...state.columns,
              [columnId]: {
                ...state.columns[columnId],
                cardIds: [...state.columns[columnId].cardIds, id],
              },
            },
          };
        }),

      updateCard: (cardId, updates) =>
        set((state) => ({
          cards: { ...state.cards, [cardId]: { ...state.cards[cardId], ...updates } },
        })),

      deleteCard: (cardId, columnId) =>
        set((state) => ({
          cards: Object.fromEntries(Object.entries(state.cards).filter(([id]) => id !== cardId)),
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              cardIds: state.columns[columnId].cardIds.filter((id) => id !== cardId),
            },
          },
        })),
    }),
    {
      name: "kanban-storage",
    }
  )
);
