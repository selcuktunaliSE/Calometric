export type Gender = "male" | "female";
export type Activity = "sedentary" | "light" | "moderate" | "high" | "athlete";

export const tdeeFactor: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9,
};

export function bmiKgCm(weightKg: number, heightCm: number) {
  return weightKg / Math.pow(heightCm / 100, 2);
}

export function bmrMifflinStJeor(gender: Gender, age: number, heightCm: number, weightKg: number) {
  return gender === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export function tdeeFromBmr(bmr: number, activity: Activity) {
  return Math.round(bmr * tdeeFactor[activity]);
}
