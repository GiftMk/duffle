import { FC } from "react";
import { taskCollection } from "@/state/collections";
import { Badge } from "./ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { eq, useLiveQuery } from "@tanstack/react-db";

type TaskCardProps = {
  id: string;
};

export const TaskCard: FC<TaskCardProps> = ({ id }) => {
  const { data: task } = useLiveQuery((q) =>
    q
      .from({ task: taskCollection })
      .where(({ task }) => eq(task.id, id))
      .findOne(),
  );

  if (!task) {
    // TODO: handle this better, return some form of skeleton component that shows column not found
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="capitalize">{task.title}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between border-0">
        <Badge className="text-xs bg-muted-foreground">{task.code}</Badge>
      </CardFooter>
    </Card>
  );
};
