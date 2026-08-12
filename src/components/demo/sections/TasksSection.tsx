"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useDemoData } from "@/components/demo/DemoDataProvider";
import { Avatar } from "@/components/demo/ui/Avatar";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import type { Locale } from "@/lib/i18n/config";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE } from "@/lib/demo/labels";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/demo/types";

const STRINGS: Record<
  Locale,
  {
    filters: { id: TaskStatus | "todas"; label: string }[];
    markPending: (title: string) => string;
    markCompleted: (title: string) => string;
    empty: string;
  }
> = {
  es: {
    filters: [
      { id: "todas", label: "Todas" },
      { id: "pendiente", label: "Pendientes" },
      { id: "completada", label: "Completadas" },
    ],
    markPending: (title) => `Marcar "${title}" como pendiente`,
    markCompleted: (title) => `Marcar "${title}" como completada`,
    empty: "No hay tareas en este filtro.",
  },
  en: {
    filters: [
      { id: "todas", label: "All" },
      { id: "pendiente", label: "Pending" },
      { id: "completada", label: "Completed" },
    ],
    markPending: (title) => `Mark "${title}" as pending`,
    markCompleted: (title) => `Mark "${title}" as completed`,
    empty: "No tasks in this filter.",
  },
};

export function TasksSection({ locale }: { locale: Locale }) {
  const { state, toggleTask } = useDemoData();
  const strings = STRINGS[locale];
  const [filter, setFilter] = useState<TaskStatus | "todas">("todas");

  const tasks = state.tasks.filter((task) => filter === "todas" || task.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {strings.filters.map((item) => (
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
                  completed ? strings.markPending(task.title) : strings.markCompleted(task.title)
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
                {TASK_PRIORITY_LABEL[locale][task.priority]}
              </StatusBadge>
            </li>
          );
        })}
        {tasks.length === 0 && (
          <li className="p-6 text-center text-sm text-slate">{strings.empty}</li>
        )}
      </ul>
    </div>
  );
}
