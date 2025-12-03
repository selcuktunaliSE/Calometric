// BMI = weight_kg / (height_m^2)
function calculateBMI(weight_kg, height_cm) {
  if (!weight_kg || !height_cm) return null;
  const height_m = height_cm / 100;
  const bmi = weight_kg / (height_m * height_m);
  return Number(bmi.toFixed(2));
}

// Mifflin-St Jeor formülü
function calculateBMR({ gender, weight_kg, height_cm, age }) {
  if (!gender || !weight_kg || !height_cm || !age) return null;
  if (gender === "male") {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    // female
    return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
}

// Aktivite katsayısı basit: 1.2 (sedanter)
function calculateDailyCalorieTarget(profile) {
  const bmr = calculateBMR(profile);
  if (!bmr) return null;
  const activityFactor = 1.2;
  return Math.round(bmr * activityFactor);
}

module.exports = {
  calculateBMI,
  calculateDailyCalorieTarget,
};