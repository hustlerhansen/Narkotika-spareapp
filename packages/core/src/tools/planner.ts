/**
 * Min plan – daily planner, weekly goals and the personal recovery plan.
 *
 * No scores, no penalties: missed tasks and goals are simply not done.
 * All dates are local calendar keys (YYYY-MM-DD) so recurrence is DST-safe.
 */
import type {
  AppState,
  IsoWeekday,
  PersonalRecoveryPlan,
  PlannerTask,
  TaskCategory,
  TaskRecurrence,
  WeeklyGoal,
} from "../model";
import { personalPlanSchema, plannerTaskSchema, weeklyGoalSchema } from "../schema";
import { addLocalDays, dateKeyToLocalDate, isDateKey, localDateKey, startOfLocalWeek } from "../time";
import { assert, clean, cleanList, parseOr, type ActionContext } from "./shared";

export function isoWeekday(dateKey: string): IsoWeekday {
  const d = dateKeyToLocalDate(dateKey).getDay();
  return (d === 0 ? 7 : d) as IsoWeekday;
}

export function weekStartKey(dateKey: string): string {
  return localDateKey(startOfLocalWeek(dateKeyToLocalDate(dateKey)));
}

export function shiftDateKey(dateKey: string, days: number): string {
  return localDateKey(addLocalDays(dateKeyToLocalDate(dateKey), days));
}

// ----------------------------------------------------------------------------- tasks

export interface TaskInput {
  title: string;
  category: TaskCategory;
  startDate: string;
  endDate?: string;
  time?: string;
  recurrence: TaskRecurrence;
  note?: string;
}

function buildTask(input: TaskInput, base: Pick<PlannerTask, "id" | "createdAt">, nowIso: string): PlannerTask {
  const recurrence: TaskRecurrence =
    input.recurrence.kind === "weekly"
      ? { kind: "weekly", days: [...new Set(input.recurrence.days)].sort() as IsoWeekday[] }
      : input.recurrence;
  const task: PlannerTask = {
    id: base.id,
    title: clean(input.title, 200) ?? "",
    category: input.category,
    startDate: input.startDate,
    endDate: recurrence.kind === "none" ? undefined : input.endDate || undefined,
    time: input.time || undefined,
    recurrence,
    note: clean(input.note, 2000),
    createdAt: base.createdAt,
    updatedAt: nowIso,
  };
  const parsed = parseOr<PlannerTask>(plannerTaskSchema, task);
  assert(!parsed.endDate || parsed.endDate >= parsed.startDate, "invalid_input");
  return parsed;
}

export function addPlannerTask(state: AppState, input: TaskInput, ctx: ActionContext): AppState {
  assert(state.plannerTasks.length < 500, "invalid_input");
  const nowIso = ctx.now.toISOString();
  return { ...state, plannerTasks: [...state.plannerTasks, buildTask(input, { id: ctx.newId(), createdAt: nowIso }, nowIso)] };
}

export function updatePlannerTask(state: AppState, taskId: string, input: TaskInput, ctx: ActionContext): AppState {
  const existing = state.plannerTasks.find((t) => t.id === taskId);
  assert(existing, "not_found");
  const task = buildTask(input, existing, ctx.now.toISOString());
  return { ...state, plannerTasks: state.plannerTasks.map((t) => (t.id === taskId ? task : t)) };
}

/** Deletes a task and all its completion marks. */
export function deletePlannerTask(state: AppState, taskId: string): AppState {
  assert(state.plannerTasks.some((t) => t.id === taskId), "not_found");
  return {
    ...state,
    plannerTasks: state.plannerTasks.filter((t) => t.id !== taskId),
    taskCompletions: state.taskCompletions.filter((c) => c.taskId !== taskId),
  };
}

/** Stops a repeating task from `dateKey` on (keeps earlier history). */
export function stopRepeatingFrom(state: AppState, taskId: string, dateKey: string, ctx: ActionContext): AppState {
  const task = state.plannerTasks.find((t) => t.id === taskId);
  assert(task && isDateKey(dateKey), "not_found");
  const lastDay = shiftDateKey(dateKey, -1);
  if (lastDay < task.startDate) return deletePlannerTask(state, taskId);
  return {
    ...state,
    plannerTasks: state.plannerTasks.map((t) => (t.id === taskId ? { ...t, endDate: lastDay, updatedAt: ctx.now.toISOString() } : t)),
    taskCompletions: state.taskCompletions.filter((c) => c.taskId !== taskId || c.date <= lastDay),
  };
}

export function occursOn(task: PlannerTask, dateKey: string): boolean {
  if (dateKey < task.startDate) return false;
  if (task.endDate && dateKey > task.endDate) return false;
  switch (task.recurrence.kind) {
    case "none":
      return dateKey === task.startDate;
    case "daily":
      return true;
    case "weekly":
      return task.recurrence.days.includes(isoWeekday(dateKey));
  }
}

export interface TaskOccurrence {
  task: PlannerTask;
  date: string;
  done: boolean;
}

/** Tasks for one date, untimed first, then by time, then by title. */
export function tasksForDate(state: AppState, dateKey: string): TaskOccurrence[] {
  const done = new Set(state.taskCompletions.filter((c) => c.date === dateKey).map((c) => c.taskId));
  return state.plannerTasks
    .filter((t) => occursOn(t, dateKey))
    .map((task) => ({ task, date: dateKey, done: done.has(task.id) }))
    .sort((a, b) => (a.task.time ?? "").localeCompare(b.task.time ?? "") || a.task.title.localeCompare(b.task.title, "nb"));
}

export function setTaskDone(state: AppState, taskId: string, dateKey: string, done: boolean, ctx: ActionContext): AppState {
  const task = state.plannerTasks.find((t) => t.id === taskId);
  assert(task && isDateKey(dateKey) && occursOn(task, dateKey), "not_found");
  const rest = state.taskCompletions.filter((c) => !(c.taskId === taskId && c.date === dateKey));
  return {
    ...state,
    taskCompletions: done ? [...rest, { taskId, date: dateKey, completedAt: ctx.now.toISOString() }] : rest,
  };
}

// ----------------------------------------------------------------------------- weekly goals

export function addWeeklyGoal(state: AppState, input: { weekStart: string; title: string; target: number }, ctx: ActionContext): AppState {
  assert(isDateKey(input.weekStart) && weekStartKey(input.weekStart) === input.weekStart, "invalid_input");
  const nowIso = ctx.now.toISOString();
  const goal = parseOr<WeeklyGoal>(weeklyGoalSchema, {
    id: ctx.newId(),
    weekStart: input.weekStart,
    title: clean(input.title, 200) ?? "",
    target: input.target,
    progress: 0,
    createdAt: nowIso,
    updatedAt: nowIso,
  });
  assert(state.weeklyGoals.filter((g) => g.weekStart === input.weekStart).length < 20, "invalid_input");
  return { ...state, weeklyGoals: [...state.weeklyGoals, goal] };
}

export function adjustWeeklyGoal(state: AppState, goalId: string, delta: 1 | -1, ctx: ActionContext): AppState {
  assert(state.weeklyGoals.some((g) => g.id === goalId), "not_found");
  return {
    ...state,
    weeklyGoals: state.weeklyGoals.map((g) =>
      g.id === goalId ? { ...g, progress: Math.min(100, Math.max(0, g.progress + delta)), updatedAt: ctx.now.toISOString() } : g,
    ),
  };
}

export function deleteWeeklyGoal(state: AppState, goalId: string): AppState {
  assert(state.weeklyGoals.some((g) => g.id === goalId), "not_found");
  return { ...state, weeklyGoals: state.weeklyGoals.filter((g) => g.id !== goalId) };
}

/** Copies last week's goals (titles and targets, progress reset) into `weekStart`. Skips titles already present. */
export function copyGoalsFromPreviousWeek(state: AppState, weekStart: string, ctx: ActionContext): AppState {
  const prev = shiftDateKey(weekStart, -7);
  const existing = new Set(state.weeklyGoals.filter((g) => g.weekStart === weekStart).map((g) => g.title));
  let next = state;
  for (const g of state.weeklyGoals.filter((x) => x.weekStart === prev)) {
    if (!existing.has(g.title)) next = addWeeklyGoal(next, { weekStart, title: g.title, target: g.target }, ctx);
  }
  return next;
}

export function goalsForWeek(state: AppState, weekStart: string): WeeklyGoal[] {
  return state.weeklyGoals.filter((g) => g.weekStart === weekStart).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

// ----------------------------------------------------------------------------- personal recovery plan

export const PERSONAL_PLAN_STEPS = [
  "reasons",
  "goals",
  "triggers",
  "warningSigns",
  "strategies",
  "contacts",
  "professional",
  "afterUse",
] as const;
export type PersonalPlanStep = (typeof PERSONAL_PLAN_STEPS)[number];

export function emptyPersonalPlan(nowIso: string): PersonalRecoveryPlan {
  return {
    reasons: "",
    goals: [],
    triggerIds: [],
    triggerNotes: "",
    warningSigns: [],
    strategyKeys: [],
    strategyNotes: "",
    contactIds: [],
    contactNotes: "",
    professionalResourceIds: [],
    professionalNotes: "",
    afterUse: "",
    updatedAt: nowIso,
  };
}

export function savePersonalPlan(state: AppState, patch: Partial<Omit<PersonalRecoveryPlan, "updatedAt">>, ctx: ActionContext): AppState {
  const nowIso = ctx.now.toISOString();
  const base = state.personalPlan ?? emptyPersonalPlan(nowIso);
  const merged: PersonalRecoveryPlan = {
    ...base,
    ...patch,
    reasons: (patch.reasons ?? base.reasons).trim().slice(0, 4000),
    goals: cleanList(patch.goals ?? base.goals, 20, 300),
    warningSigns: cleanList(patch.warningSigns ?? base.warningSigns, 20, 300),
    triggerNotes: (patch.triggerNotes ?? base.triggerNotes).trim().slice(0, 4000),
    strategyNotes: (patch.strategyNotes ?? base.strategyNotes).trim().slice(0, 4000),
    contactNotes: (patch.contactNotes ?? base.contactNotes).trim().slice(0, 4000),
    professionalNotes: (patch.professionalNotes ?? base.professionalNotes).trim().slice(0, 4000),
    afterUse: (patch.afterUse ?? base.afterUse).trim().slice(0, 4000),
    triggerIds: [...new Set(patch.triggerIds ?? base.triggerIds)],
    strategyKeys: [...new Set(patch.strategyKeys ?? base.strategyKeys)],
    contactIds: [...new Set(patch.contactIds ?? base.contactIds)],
    professionalResourceIds: [...new Set(patch.professionalResourceIds ?? base.professionalResourceIds)],
    updatedAt: nowIso,
  };
  return { ...state, personalPlan: parseOr<PersonalRecoveryPlan>(personalPlanSchema, merged) };
}

/** Which sections have content – for a gentle "x of 8 sections filled" hint (not a score). */
export function personalPlanFilledSteps(plan: PersonalRecoveryPlan | null): PersonalPlanStep[] {
  if (!plan) return [];
  const filled: Record<PersonalPlanStep, boolean> = {
    reasons: plan.reasons.length > 0,
    goals: plan.goals.length > 0,
    triggers: plan.triggerIds.length > 0 || plan.triggerNotes.length > 0,
    warningSigns: plan.warningSigns.length > 0,
    strategies: plan.strategyKeys.length > 0 || plan.strategyNotes.length > 0,
    contacts: plan.contactIds.length > 0 || plan.contactNotes.length > 0,
    professional: plan.professionalResourceIds.length > 0 || plan.professionalNotes.length > 0,
    afterUse: plan.afterUse.length > 0,
  };
  return PERSONAL_PLAN_STEPS.filter((s) => filled[s]);
}

// ----------------------------------------------------------------------------- overview (7.4)

export interface ToolsOverview {
  /** Last 7 days including today. */
  days: { date: string; planned: number; done: number }[];
  weeklyGoals: { total: number; reached: number };
  journalEntriesLast7: number;
  journalEntriesLast30: number;
  cravingLogsLast30: number;
  strategiesUsedLast30: number;
  strategiesRatedHelpfulLast30: number;
  /** Self-reported journal mood (1–10), last 14 days vs the 14 before. Undefined if < 3 ratings in either. */
  moodComparison?: { recentMean: number; previousMean: number };
}

/**
 * Descriptive overview. Deliberately NOT a single "recovery score".
 */
export function toolsOverview(state: AppState, now: Date): ToolsOverview {
  const today = localDateKey(now);
  const days = Array.from({ length: 7 }, (_, i) => shiftDateKey(today, i - 6)).map((date) => {
    const occ = tasksForDate(state, date);
    return { date, planned: occ.length, done: occ.filter((o) => o.done).length };
  });
  const goals = goalsForWeek(state, weekStartKey(today));
  const since = (n: number) => shiftDateKey(today, -(n - 1));
  const from30 = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const logs30 = state.cravingEvents.filter((e) => e.startedAt >= from30);
  const moods = (from: string, to: string) =>
    state.journal.filter((e) => e.mood !== undefined && e.date >= from && e.date <= to).map((e) => e.mood!);
  const recent = moods(since(14), today);
  const previous = moods(shiftDateKey(today, -27), shiftDateKey(today, -14));
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  return {
    days,
    weeklyGoals: { total: goals.length, reached: goals.filter((g) => g.progress >= g.target).length },
    journalEntriesLast7: state.journal.filter((e) => e.date >= since(7) && e.date <= today).length,
    journalEntriesLast30: state.journal.filter((e) => e.date >= since(30) && e.date <= today).length,
    cravingLogsLast30: logs30.length,
    strategiesUsedLast30: logs30.reduce((n, e) => n + (e.strategyKeys?.length ?? 0), 0),
    strategiesRatedHelpfulLast30: logs30.filter((e) => e.helpful === "yes" || e.helpful === "somewhat").length,
    moodComparison: recent.length >= 3 && previous.length >= 3 ? { recentMean: avg(recent), previousMean: avg(previous) } : undefined,
  };
}
