import { describe, expect, it } from "vitest";
import { createEmptyState } from "../model";
import { testContext } from "../test-utils";
import {
  addPlannerTask,
  addWeeklyGoal,
  adjustWeeklyGoal,
  copyGoalsFromPreviousWeek,
  deletePlannerTask,
  goalsForWeek,
  isoWeekday,
  occursOn,
  personalPlanFilledSteps,
  savePersonalPlan,
  setTaskDone,
  stopRepeatingFrom,
  tasksForDate,
  toolsOverview,
  updatePlannerTask,
  weekStartKey,
} from "./planner";
import { addJournalEntry } from "./journal";
import { parseAppState } from "../schema";

const ctx = testContext("2026-10-09T08:00:00.000Z"); // Friday

describe("planner tasks", () => {
  it("one-off, daily and weekly recurrence, sorted by time", () => {
    let s = addPlannerTask(createEmptyState(), { title: "Legetime", category: "appointment", startDate: "2026-10-09", time: "14:00", recurrence: { kind: "none" } }, ctx);
    s = addPlannerTask(s, { title: "Frokost", category: "meal", startDate: "2026-10-01", time: "08:00", recurrence: { kind: "daily" } }, ctx);
    s = addPlannerTask(s, { title: "NA-møte", category: "recovery", startDate: "2026-10-01", time: "19:00", recurrence: { kind: "weekly", days: [5, 2, 5] } }, ctx);
    expect(s.plannerTasks[2]!.recurrence).toEqual({ kind: "weekly", days: [2, 5] });
    expect(tasksForDate(s, "2026-10-09").map((o) => o.task.title)).toEqual(["Frokost", "Legetime", "NA-møte"]);
    expect(tasksForDate(s, "2026-10-10").map((o) => o.task.title)).toEqual(["Frokost"]);
    expect(tasksForDate(s, "2026-09-30")).toEqual([]);
    expect(parseAppState(JSON.parse(JSON.stringify(s))).ok).toBe(true);
  });

  it("weekday is computed from the local calendar across the DST change", () => {
    expect(isoWeekday("2026-10-25")).toBe(7); // Sunday, DST ends in Norway
    expect(isoWeekday("2026-10-26")).toBe(1);
    expect(weekStartKey("2026-10-25")).toBe("2026-10-19");
    expect(weekStartKey("2026-03-29")).toBe("2026-03-23"); // DST starts
  });

  it("completion is per occurrence and can be undone; no penalty for missed days", () => {
    let s = addPlannerTask(createEmptyState(), { title: "Gå tur", category: "exercise", startDate: "2026-10-05", recurrence: { kind: "daily" } }, ctx);
    const id = s.plannerTasks[0]!.id;
    s = setTaskDone(s, id, "2026-10-08", true, ctx);
    expect(tasksForDate(s, "2026-10-08")[0]!.done).toBe(true);
    expect(tasksForDate(s, "2026-10-09")[0]!.done).toBe(false);
    s = setTaskDone(s, id, "2026-10-08", false, ctx);
    expect(s.taskCompletions).toEqual([]);
    expect(() => setTaskDone(s, id, "2026-10-01", true, ctx)).toThrowError("not_found");
  });

  it("validates input and edits", () => {
    const s0 = createEmptyState();
    expect(() => addPlannerTask(s0, { title: " ", category: "meal", startDate: "2026-10-09", recurrence: { kind: "none" } }, ctx)).toThrowError("invalid_input");
    expect(() => addPlannerTask(s0, { title: "X", category: "meal", startDate: "2026-10-09", time: "25:00", recurrence: { kind: "none" } }, ctx)).toThrowError("invalid_input");
    expect(() =>
      addPlannerTask(s0, { title: "X", category: "meal", startDate: "2026-10-09", endDate: "2026-10-01", recurrence: { kind: "daily" } }, ctx),
    ).toThrowError("invalid_input");
    expect(() => addPlannerTask(s0, { title: "X", category: "meal", startDate: "2026-10-09", recurrence: { kind: "weekly", days: [] } }, ctx)).toThrowError(
      "invalid_input",
    );
    let s = addPlannerTask(s0, { title: "X", category: "meal", startDate: "2026-10-09", recurrence: { kind: "none" } }, ctx);
    s = updatePlannerTask(s, s.plannerTasks[0]!.id, { title: "Lunsj", category: "meal", startDate: "2026-10-10", recurrence: { kind: "none" } }, ctx);
    expect(s.plannerTasks[0]).toMatchObject({ title: "Lunsj", startDate: "2026-10-10" });
  });

  it("stop repeating keeps history; delete removes completions", () => {
    let s = addPlannerTask(createEmptyState(), { title: "Trening", category: "exercise", startDate: "2026-10-01", recurrence: { kind: "daily" } }, ctx);
    const id = s.plannerTasks[0]!.id;
    s = setTaskDone(s, id, "2026-10-03", true, ctx);
    s = setTaskDone(s, id, "2026-10-08", true, ctx);
    s = stopRepeatingFrom(s, id, "2026-10-05", ctx);
    expect(occursOn(s.plannerTasks[0]!, "2026-10-04")).toBe(true);
    expect(occursOn(s.plannerTasks[0]!, "2026-10-05")).toBe(false);
    expect(s.taskCompletions.map((c) => c.date)).toEqual(["2026-10-03"]);
    s = deletePlannerTask(s, id);
    expect(s.plannerTasks).toEqual([]);
    expect(s.taskCompletions).toEqual([]);
  });
});

describe("weekly goals", () => {
  it("tracks progress without penalties and can copy last week", () => {
    let s = addWeeklyGoal(createEmptyState(), { weekStart: "2026-10-05", title: "Gå på ett møte", target: 1 }, ctx);
    s = addWeeklyGoal(s, { weekStart: "2026-10-05", title: "Skrive i dagboka", target: 3 }, ctx);
    expect(() => addWeeklyGoal(s, { weekStart: "2026-10-06", title: "X", target: 1 }, ctx)).toThrowError("invalid_input");
    const id = s.weeklyGoals[0]!.id;
    s = adjustWeeklyGoal(s, id, 1, ctx);
    s = adjustWeeklyGoal(s, id, 1, ctx);
    expect(s.weeklyGoals[0]!.progress).toBe(2); // may exceed target – no cap at target
    s = adjustWeeklyGoal(s, s.weeklyGoals[1]!.id, -1, ctx);
    expect(s.weeklyGoals[1]!.progress).toBe(0);
    s = copyGoalsFromPreviousWeek(s, "2026-10-12", ctx);
    s = copyGoalsFromPreviousWeek(s, "2026-10-12", ctx); // idempotent
    expect(goalsForWeek(s, "2026-10-12").map((g) => [g.title, g.progress])).toEqual([
      ["Gå på ett møte", 0],
      ["Skrive i dagboka", 0],
    ]);
  });
});

describe("personal recovery plan", () => {
  it("saves sections incrementally and reports which are filled", () => {
    let s = savePersonalPlan(createEmptyState(), { reasons: "  Barna  ", goals: ["Sove bedre", "sove bedre", " ", "Sove bedre"] }, ctx);
    expect(s.personalPlan?.reasons).toBe("Barna");
    expect(s.personalPlan?.goals).toEqual(["Sove bedre", "sove bedre"]);
    s = savePersonalPlan(s, { afterUse: "Ringe Kari og gjøre en innsjekk", strategyKeys: ["breathing", "breathing"] }, ctx);
    expect(s.personalPlan?.reasons).toBe("Barna");
    expect(s.personalPlan?.strategyKeys).toEqual(["breathing"]);
    expect(personalPlanFilledSteps(s.personalPlan)).toEqual(["reasons", "goals", "strategies", "afterUse"]);
    expect(() => savePersonalPlan(s, { strategyKeys: ["magic"] }, ctx)).toThrowError("invalid_input");
    expect(parseAppState(JSON.parse(JSON.stringify(s))).ok).toBe(true);
  });
});

describe("overview", () => {
  it("summarises without a single score", () => {
    let s = addPlannerTask(createEmptyState(), { title: "Frokost", category: "meal", startDate: "2026-10-01", recurrence: { kind: "daily" } }, ctx);
    s = setTaskDone(s, s.plannerTasks[0]!.id, "2026-10-09", true, ctx);
    s = addJournalEntry(s, { date: "2026-10-09", mood: 6 }, ctx);
    const o = toolsOverview(s, new Date("2026-10-09T20:00:00+02:00"));
    expect(o.days).toHaveLength(7);
    expect(o.days[6]).toEqual({ date: "2026-10-09", planned: 1, done: 1 });
    expect(o.journalEntriesLast7).toBe(1);
    expect(o.moodComparison).toBeUndefined();
    expect(Object.keys(o)).not.toContain("score");
  });
});
