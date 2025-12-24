import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { FC } from "react";
import { boardCollection } from "@/state/collections";
import { ColumnCard } from "./column-card";
import { moveTasks } from "@/lib/dnd";

type KanbanProps = {
  id: string;
};

const handleDragEnd = (result: DropResult) => {
  if (!result.destination) {
    return;
  }

  moveTasks({
    source: {
      columnId: result.source.droppableId,
      index: result.source.index,
    },
    destination: {
      columnId: result.destination.droppableId,
      index: result.destination.index,
    },
  });
};

export const KanbanBoard: FC<KanbanProps> = ({ id }) => {
  const { data: board } = useLiveQuery((q) =>
    q
      .from({ board: boardCollection })
      .where(({ board }) => eq(board.id, id))
      .findOne(),
  );

  if (!board) {
    // TODO: handle this better, return some form of skeleton component that shows board not found
    return null;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full overflow-x-auto h-full items-start justify-center flex gap-2">
        {board.columns.map((id) => (
          <ColumnCard id={id} />
        ))}
      </div>
    </DragDropContext>
  );
};
