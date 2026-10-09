import type { AppState, AppTranslator, UserTrigger } from "@nystart/core";

export function triggerLabel(t: AppTranslator, trigger: UserTrigger): string {
  return trigger.presetKey ? t.tDynamic(`triggers.presets.${trigger.presetKey}`) : (trigger.label ?? "");
}

export function strategyLabel(t: AppTranslator, state: AppState, key: string): string {
  if (key.startsWith("custom:")) return state.customCopingStrategies.find((c) => `custom:${c.id}` === key)?.label ?? key;
  return t.tDynamic(`coping.${key}`);
}
