/*
  Warnings:

  - Changed the type of `mealType` on the `FoodLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `gender` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `activity` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('sedentary', 'light', 'moderate', 'high', 'athlete');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- AlterTable
ALTER TABLE "FoodLog" DROP COLUMN "mealType",
ADD COLUMN     "mealType" "MealType" NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL,
DROP COLUMN "activity",
ADD COLUMN     "activity" "Activity" NOT NULL;

-- CreateIndex
CREATE INDEX "idx_food_name" ON "Food"("name");

-- CreateIndex
CREATE INDEX "idx_log_user_date" ON "FoodLog"("userId", "date");
