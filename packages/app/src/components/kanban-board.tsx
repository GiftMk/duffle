import { eq, useLiveQuery } from "@tanstack/react-db";
import { FC } from "react";
import { boardCollection } from "@/state/collections";
import { ColumnCard } from "./column-card";

type KanbanProps = {
  id: string;
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
    <div className="w-full overflow-x-auto h-full items-start justify-center flex gap-8">
      {board.columns.map((id) => (
        <ColumnCard id={id} />
      ))}
    </div>
  );
};
