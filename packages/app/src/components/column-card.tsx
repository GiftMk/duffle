import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TaskCard } from "./task-card";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { columnCollection } from "@/state/collections";

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
      <CardContent className="flex flex-col gap-6">
        {column.tasks.map((id) => (
          <TaskCard key={id} id={id} />
        ))}
      </CardContent>
    </Card>
  );
};
