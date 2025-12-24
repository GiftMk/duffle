import { eq, useLiveQuery } from "@tanstack/react-db";
import { FC } from "react";
import { columnCollection } from "@/state/collections";
import { TaskCard } from "./task-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

type ColumnCardProps = {
  id: string;
};

export const ColumnCard: FC<ColumnCardProps> = ({ id }) => {
  const { data: column } = useLiveQuery((q) =>
    q
      .from({ column: columnCollection })
      .where(({ column }) => eq(column.id, id))
      .findOne(),
  );

  if (!column) {
    // TODO: handle this better, return some form of skeleton component that shows column not found
    return null;
  }

  return (
    <Card className="w-full max-w-1/6 h-full bg-transparent ring-0 border-dashed">
      <CardHeader>
        <CardTitle>{column.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn("flex h-full w-full flex-col p-4", {
                "-outline-offset-8 outline-dashed outline-2 outline-stone-100":
                  snapshot.isDraggingOver,
              })}
            >
              {column?.tasks.map((id, i) => (
                <TaskCard key={id} id={id} index={i} />
              ))}
              <div>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};
