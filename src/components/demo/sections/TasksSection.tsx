"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useDemoData } from "@/components/demo/DemoDataProvider";
import { Avatar } from "@/components/demo/ui/Avatar";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE } from "@/lib/demo/labels";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/demo/types";

const FILTERS: { id: TaskStatus | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "pendiente", label: "Pendientes" },
  { id: "completada", label: "Completadas" },
];

export function TasksSection() {
  const { state, toggleTask } = useDemoData();
  const [filter, setFilter] = useState<TaskStatus | "todas">("todas");

  const tasks = state.tasks.filter((task) => filter === "todas" || task.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={cn(
              "border px-3 py-1.5 text-xs font-semibold transition-colors",
              filter === item.id
                ? "border-navy bg-navy text-cream"
                : "border-line/70 text-slate hover:border-navy/30"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-line/70 border border-line/70 bg-cream">
        {tasks.map((task) => {
          const employee = state.employees.find((e) => e.id === task.employeeId);
          const completed = task.status === "completada";
          return (
            <li key={task.id} className="flex items-center gap-3 p-4">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                aria-pressed={completed}
                aria-label={
                  completed ? `Marcar "${task.title}" como pendiente` : `Marcar "${task.title}" como completada`
                }
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center border transition-colors",
                  completed
                    ? "border-success bg-success text-cream"
                    : "border-navy/25 text-transparent hover:border-navy/50"
                )}
              >
                <Check size={14} aria-hidden="true" />
              </button>

              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-medium", completed ? "text-slate line-through" : "text-navy")}>
                  {task.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate">
                  {employee && (
                    <span className="inline-flex items-center gap-1.5">
                      <Avatar initials={employee.initials} size="sm" />
                      {employee.name}
                    </span>
                  )}
                  <span>· {task.dueDate}</span>
                </div>
              </div>

              <StatusBadge tone={TASK_PRIORITY_TONE[task.priority]}>
                {TASK_PRIORITY_LABEL[task.priority]}
              </StatusBadge>
            </li>
          );
        })}
        {tasks.length === 0 && (
          <li className="p-6 text-center text-sm text-slate">
            No hay tareas en este filtro.
          </li>
        )}
      </ul>
    </div>
  );
}
