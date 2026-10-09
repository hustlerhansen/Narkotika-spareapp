"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { goalsForWeek, localDateKey, setTaskDone, tasksForDate, weekStartKey, type AppState } from "@nystart/core";
import { Card } from "@/components/ui/Card";
import { cx } from "@/components/ui/cx";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";

/** "I dag": today's planned activities with one-tap completion. */
export function TodayCard({ state, now }: { state: AppState; now: Date }) {
  const t = useT();
  const today = localDateKey(now);
  const occ = tasksForDate(state, today);
  const goals = goalsForWeek(state, weekStartKey(today));
  return (
    <Card className="flex flex-col gap-3" aria-labelledby="today-title">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="today-title" className="text-lg font-semibold">
          {t.t("planner.today")}
        </h2>
        <Link href="/verktoy/plan" className="text-sm font-semibold text-primary underline">
          {t.t("planner.title")}
        </Link>
      </div>
      {occ.length === 0 ? (
        <p className="text-muted">{t.t("planner.noTasks")}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {occ.slice(0, 6).map(({ task, done }) => (
            <li key={task.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={done}
                onClick={() => store.apply((s, ctx) => setTaskDone(s, task.id, today, !done, ctx))}
                className="tap flex w-full items-center gap-3 rounded-xl px-2 text-left hover:bg-surface-2"
              >
                {done ? <CheckCircle2 aria-hidden="true" className="text-primary" /> : <Circle aria-hidden="true" className="text-muted" />}
                <span className={cx(done && "text-muted line-through")}>
                  {task.time ? `${task.time} · ` : ""}
                  {task.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {goals.length > 0 && (
        <p className="text-sm text-muted">
          {t.t("planner.overviewGoals", { reached: goals.filter((g) => g.progress >= g.target).length, total: goals.length })}
        </p>
      )}
    </Card>
  );
}
