"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import {
  TASK_CATEGORIES,
  addPlannerTask,
  addWeeklyGoal,
  adjustWeeklyGoal,
  copyGoalsFromPreviousWeek,
  deletePlannerTask,
  deleteWeeklyGoal,
  goalsForWeek,
  localDateKey,
  personalPlanFilledSteps,
  setTaskDone,
  shiftDateKey,
  stopRepeatingFrom,
  tasksForDate,
  toolsOverview,
  updatePlannerTask,
  weekStartKey,
  type AppState,
  type IsoWeekday,
  type PlannerTask,
  type TaskCategory,
  type TaskRecurrence,
} from "@nystart/core";
import { RequireProfile } from "@/components/RequireProfile";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Chips } from "@/components/ui/Chips";
import { Field, Select, TextInput } from "@/components/ui/Field";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cx } from "@/components/ui/cx";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";
import { useNow } from "@/lib/use-now";

export function Planner() {
  return <RequireProfile>{(state) => <PlannerContent state={state} />}</RequireProfile>;
}

function PlannerContent({ state }: { state: AppState }) {
  const t = useT();
  const now = useNow(60_000);
  const [day, setDay] = useState<string | null>(null);
  if (!now) return null;
  const today = localDateKey(now);
  const current = day ?? today;
  const filled = personalPlanFilledSteps(state.personalPlan).length;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.t("planner.title")} intro={t.t("planner.subtitle")} />
      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t.t("personalPlan.title")}</h2>
        <p className="text-muted">{t.t("personalPlan.intro")}</p>
        <p className="text-sm text-muted">{t.t("personalPlan.filled", { count: filled })}</p>
        <ButtonLink href="/verktoy/plan/min-plan" variant="secondary">
          {t.t("personalPlan.open")}
        </ButtonLink>
      </Card>
      <DayView state={state} day={current} today={today} onDay={setDay} />
      <WeeklyGoals state={state} today={today} />
      <Overview state={state} now={now} />
    </div>
  );
}

function DayView({ state, day, today, onDay }: { state: AppState; day: string; today: string; onDay: (d: string) => void }) {
  const t = useT();
  const [editing, setEditing] = useState<PlannerTask | "new" | null>(null);
  const occurrences = tasksForDate(state, day);
  return (
    <section aria-labelledby="day-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" aria-label={t.t("planner.previousDay")} onClick={() => onDay(shiftDateKey(day, -1))}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <div className="text-center">
          <h2 id="day-title" className="text-lg font-semibold">
            {day === today ? t.t("planner.today") : t.formatDate(new Date(`${day}T12:00:00`), "long")}
          </h2>
          {day !== today && (
            <button type="button" className="text-sm font-semibold text-primary underline" onClick={() => onDay(today)}>
              {t.t("planner.goToday")}
            </button>
          )}
        </div>
        <Button variant="ghost" aria-label={t.t("planner.nextDay")} onClick={() => onDay(shiftDateKey(day, 1))}>
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      {occurrences.length === 0 ? (
        <p className="rounded-2xl bg-surface-2 p-4 text-muted">{t.t("planner.noTasks")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {occurrences.map(({ task, done }) => (
            <li key={task.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={done}
                aria-label={`${task.title}: ${done ? t.t("planner.markUndone") : t.t("planner.markDone")}`}
                onClick={() => store.apply((s, ctx) => setTaskDone(s, task.id, day, !done, ctx))}
                className="tap inline-flex shrink-0 items-center justify-center rounded-full text-primary"
              >
                {done ? <CheckCircle2 size={28} aria-hidden="true" /> : <Circle size={28} aria-hidden="true" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={cx("font-semibold", done && "text-muted line-through")}>{task.title}</p>
                <p className="text-sm text-muted">
                  {[task.time, t.tDynamic(`planner.categories.${task.category}`), task.recurrence.kind !== "none" ? t.tDynamic(`planner.repeatOptions.${task.recurrence.kind}`) : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <Button variant="ghost" aria-label={`${t.t("planner.editTask")}: ${task.title}`} onClick={() => setEditing(task)}>
                <Pencil aria-hidden="true" size={18} />
              </Button>
            </li>
          ))}
        </ul>
      )}
      {editing ? (
        <TaskForm key={editing === "new" ? "new" : editing.id} task={editing === "new" ? undefined : editing} day={day} onDone={() => setEditing(null)} />
      ) : (
        <Button variant="secondary" onClick={() => setEditing("new")}>
          <Plus aria-hidden="true" size={18} /> {t.t("planner.addTask")}
        </Button>
      )}
      <p className="text-sm text-muted">{t.t("planner.remindersNote")}</p>
    </section>
  );
}

const WEEKDAYS: IsoWeekday[] = [1, 2, 3, 4, 5, 6, 7];

function TaskForm({ task, day, onDone }: { task?: PlannerTask; day: string; onDone: () => void }) {
  const t = useT();
  const [title, setTitle] = useState(task?.title ?? "");
  const [category, setCategory] = useState<TaskCategory>(task?.category ?? "recovery");
  const [startDate, setStartDate] = useState(task?.startDate ?? day);
  const [time, setTime] = useState(task?.time ?? "");
  const [repeat, setRepeat] = useState<TaskRecurrence["kind"]>(task?.recurrence.kind ?? "none");
  const [days, setDays] = useState<IsoWeekday[]>(task?.recurrence.kind === "weekly" ? task.recurrence.days : []);
  const [endDate, setEndDate] = useState(task?.endDate ?? "");
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function save() {
    const recurrence: TaskRecurrence = repeat === "weekly" ? { kind: "weekly", days } : { kind: repeat };
    const input = { title, category, startDate, time: time || undefined, recurrence, endDate: endDate || undefined };
    const r = store.apply((s, ctx) => (task ? updatePlannerTask(s, task.id, input, ctx) : addPlannerTask(s, input, ctx)));
    if (r.ok) onDone();
    else setError(t.tDynamic(`errors.${r.code}`));
  }

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">{task ? t.t("planner.editTask") : t.t("planner.addTask")}</h3>
      <Field label={t.t("planner.taskTitle")}>
        {(p) => <TextInput {...p} maxLength={200} list="task-suggestions" value={title} onChange={(e) => setTitle(e.target.value)} />}
      </Field>
      <datalist id="task-suggestions">
        {t.list("planner.suggestions").map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t.t("planner.category")}>
          {(p) => (
            <Select {...p} value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t.tDynamic(`planner.categories.${c}`)}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label={t.t("planner.time")}>
          {(p) => <TextInput {...p} type="time" value={time} onChange={(e) => setTime(e.target.value)} />}
        </Field>
        <Field label={t.t("planner.startDate")}>
          {(p) => <TextInput {...p} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />}
        </Field>
        <Field label={t.t("planner.repeat")}>
          {(p) => (
            <Select {...p} value={repeat} onChange={(e) => setRepeat(e.target.value as TaskRecurrence["kind"])}>
              {(["none", "daily", "weekly"] as const).map((r) => (
                <option key={r} value={r}>
                  {t.t(`planner.repeatOptions.${r}`)}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      {repeat === "weekly" && (
        <Chips
          legend={t.t("planner.repeatOptions.weekly")}
          name="weekdays"
          type="checkbox"
          options={WEEKDAYS.map((d) => ({ value: d, label: t.tDynamic(`planner.weekdays.${d}`) }))}
          value={days}
          onChange={setDays}
        />
      )}
      {repeat !== "none" && (
        <Field label={t.t("planner.endDate")}>
          {(p) => <TextInput {...p} type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} />}
        </Field>
      )}
      {error && (
        <p role="alert" className="font-medium text-danger">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onDone}>
          {t.t("common.cancel")}
        </Button>
        <Button onClick={save}>{t.t("planner.save")}</Button>
      </div>
      {task && (
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          {task.recurrence.kind !== "none" && (
            <Button
              variant="ghost"
              className="self-start"
              onClick={() => {
                if (store.apply((s, ctx) => stopRepeatingFrom(s, task.id, day, ctx)).ok) onDone();
              }}
            >
              {t.t("planner.stopRepeating")}
            </Button>
          )}
          {confirmDelete ? (
            <div role="alertdialog" aria-labelledby="del-task" className="rounded-xl border border-danger bg-danger-soft p-3">
              <p id="del-task">{t.t("planner.deleteConfirm")}</p>
              <div className="mt-2 flex gap-2">
                <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                  {t.t("common.cancel")}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (store.apply((s) => deletePlannerTask(s, task.id)).ok) onDone();
                  }}
                >
                  {t.t("planner.delete")}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" className="self-start text-danger" onClick={() => setConfirmDelete(true)}>
              <Trash2 aria-hidden="true" size={18} /> {t.t("planner.delete")}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

function WeeklyGoals({ state, today }: { state: AppState; today: string }) {
  const t = useT();
  const [week, setWeek] = useState(() => weekStartKey(today));
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const goals = goalsForWeek(state, week);
  const hasPrevious = goalsForWeek(state, shiftDateKey(week, -7)).length > 0;

  function add() {
    const r = store.apply((s, ctx) => addWeeklyGoal(s, { weekStart: week, title, target: Number(target) }, ctx));
    if (r.ok) {
      setTitle("");
      setTarget("1");
      setError(null);
    } else setError(t.tDynamic(`errors.${r.code}`));
  }

  return (
    <Card className="flex flex-col gap-4" aria-labelledby="weekly-title">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" aria-label={t.t("planner.previousWeek")} onClick={() => setWeek(shiftDateKey(week, -7))}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <div className="text-center">
          <h2 id="weekly-title" className="text-lg font-semibold">
            {t.t("planner.weekly")}
          </h2>
          <p className="text-sm text-muted">{t.t("planner.weekOf", { date: t.formatDate(new Date(`${week}T12:00:00`), "medium") })}</p>
        </div>
        <Button variant="ghost" aria-label={t.t("planner.nextWeek")} onClick={() => setWeek(shiftDateKey(week, 7))}>
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      {goals.length === 0 ? (
        <p className="text-muted">{t.t("planner.weeklyEmpty")}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {goals.map((g) => (
            <li key={g.id} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold">{g.title}</span>
                <span className="text-sm text-muted">{t.t("planner.goalProgress", { progress: g.progress, target: g.target })}</span>
              </div>
              <ProgressBar value={g.progress / g.target} label={g.title} tone="accent" />
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="secondary" aria-label={`${t.t("planner.increase")}: ${g.title}`} onClick={() => store.apply((s, ctx) => adjustWeeklyGoal(s, g.id, 1, ctx))}>
                  <Plus aria-hidden="true" size={16} /> {t.t("planner.increase")}
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`${t.t("planner.decrease")}: ${g.title}`}
                  disabled={g.progress === 0}
                  onClick={() => store.apply((s, ctx) => adjustWeeklyGoal(s, g.id, -1, ctx))}
                >
                  <Minus aria-hidden="true" size={16} />
                </Button>
                <span className="text-sm text-muted">{g.progress >= g.target ? t.t("planner.goalReached") : t.t("planner.goalNotReached")}</span>
                <Button variant="ghost" className="ml-auto" aria-label={`${t.t("planner.deleteGoal")}: ${g.title}`} onClick={() => store.apply((s) => deleteWeeklyGoal(s, g.id))}>
                  <Trash2 aria-hidden="true" size={16} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {hasPrevious && (
        <Button variant="ghost" className="self-start" onClick={() => store.apply((s, ctx) => copyGoalsFromPreviousWeek(s, week, ctx))}>
          {t.t("planner.copyLastWeek")}
        </Button>
      )}
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Field label={t.t("planner.goalTitle")} error={error ?? undefined}>
          {(p) => <TextInput {...p} maxLength={200} list="goal-suggestions" value={title} onChange={(e) => setTitle(e.target.value)} />}
        </Field>
        <Field label={t.t("planner.goalTarget")}>
          {(p) => (
            <Select {...p} value={target} onChange={(e) => setTarget(e.target.value)}>
              {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <datalist id="goal-suggestions">
        {t.list("planner.goalSuggestions").map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <Button variant="secondary" onClick={add}>
        <Plus aria-hidden="true" size={18} /> {t.t("planner.addGoal")}
      </Button>
      <p className="text-sm text-muted">{t.t("planner.noPenalty")}</p>
    </Card>
  );
}

function Overview({ state, now }: { state: AppState; now: Date }) {
  const t = useT();
  const o = toolsOverview(state, now);
  const fmt = (n: number) => n.toLocaleString("nb-NO", { maximumFractionDigits: 1 });
  const wd = new Intl.DateTimeFormat(t.locale, { weekday: "short" });
  return (
    <Card className="flex flex-col gap-3" aria-labelledby="overview-title">
      <h2 id="overview-title" className="text-lg font-semibold">
        {t.t("planner.overview")}
      </h2>
      <p className="text-sm text-muted">{t.t("planner.overviewIntro")}</p>
      <h3 className="font-medium">{t.t("planner.overviewDays")}</h3>
      <ul className="grid grid-cols-7 gap-1 text-center text-xs">
        {o.days.map((d) => (
          <li key={d.date} className="flex flex-col items-center gap-1 rounded-lg bg-surface-2 p-1">
            <span className="text-muted">{wd.format(new Date(`${d.date}T12:00:00`))}</span>
            <span className="font-semibold tabular-nums">{d.planned ? t.t("planner.overviewDone", { done: d.done, planned: d.planned }) : "–"}</span>
          </li>
        ))}
      </ul>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
        <li>{t.t("planner.overviewGoals", { reached: o.weeklyGoals.reached, total: o.weeklyGoals.total })}</li>
        <li>{t.t("planner.overviewJournal", { last7: o.journalEntriesLast7, last30: o.journalEntriesLast30 })}</li>
        <li>{t.t("planner.overviewStrategies", { used: o.strategiesUsedLast30, helpful: o.strategiesRatedHelpfulLast30 })}</li>
        <li>
          {o.moodComparison
            ? t.t("planner.overviewMood", { recent: fmt(o.moodComparison.recentMean), previous: fmt(o.moodComparison.previousMean) })
            : t.t("planner.overviewNoMood")}
        </li>
      </ul>
      <Link href="/verktoy/dagbok" className="text-sm font-semibold text-primary underline">
        {t.t("journal.title")}
      </Link>
    </Card>
  );
}
