import type { StudySettings, TimerPreset } from "./types";

export const CUSTOM_PRESET_ID = "custom";

export const TIMER_PRESETS: TimerPreset[] = [
  { id: "pomodoro-25-5", label: { th: "Pomodoro", en: "Pomodoro" }, studyMinutes: 25, breakMinutes: 5 },
  { id: "relaxed-30-10", label: { th: "สบาย ๆ", en: "Relaxed" }, studyMinutes: 30, breakMinutes: 10 },
  { id: "deep-50-10", label: { th: "โฟกัสลึก", en: "Deep focus" }, studyMinutes: 50, breakMinutes: 10 },
  { id: "sprint-60-15", label: { th: "เต็มชั่วโมง", en: "Full hour" }, studyMinutes: 60, breakMinutes: 15 },
];

export const CUSTOM_LIMITS = {
  study: { min: 5, max: 180 },
  break: { min: 1, max: 60 },
} as const;

export const DEFAULT_SETTINGS: StudySettings = {
  selectedPresetId: "pomodoro-25-5",
  customPreset: { studyMinutes: 45, breakMinutes: 15 },
  soundEnabled: true,
  autoStartBreak: false,
  focusShowsList: true,
};

export function activePreset(settings: StudySettings): { studyMinutes: number; breakMinutes: number } {
  if (settings.selectedPresetId === CUSTOM_PRESET_ID) return settings.customPreset;
  return TIMER_PRESETS.find((p) => p.id === settings.selectedPresetId) ?? TIMER_PRESETS[0];
}
