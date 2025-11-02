export type MacroTotals = {
  kcal: number;
  carbG: number;
  proteinG: number;
  fatG: number;
};

export type DaySummary = {
  date: string;          // 'YYYY-MM-DD'
  totals: MacroTotals;
  targetKcal: number;    // Goal.dailyCalories
};

export type WeekSummaryPoint = {
  date: string;          // 'YYYY-MM-DD'
  kcal: number;
};

export type ProfileDTO = {
  gender: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  activity: "sedentary" | "light" | "moderate" | "high" | "athlete";
  bmi: number;
  bmr: number;
  tdee: number;
  goalKcal: number | null;
};

export type FoodLogItem = {
  id: string;
  foodName: string;
  brand?: string | null;
  amountG: number;
  kcal: number;
  carbG: number;
  proteinG: number;
  fatG: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
};
