import test from "node:test";
import assert from "node:assert/strict";
import { WorkoutServiceModel } from "../workout/WorkoutServiceModel.js";
import { ExerciseCategoryValueModel } from "../workout/ExerciseCategoryValueModel.js";
import { ExerciseEntityModel } from "../workout/ExerciseEntityModel.js";
import { CONFIG } from "../js/Config.js";

/**
 * Returns a workout service instance with mock data
 *
 * @returns {WorkoutServiceModel}
 */
function createService() {
  const mockCategories = new Response(
    JSON.stringify({
      exerciseCategories: [
        { name: "Chest + Arms", emoji: "💪" },
        { name: "Legs", emoji: "🦵" },
      ],
    }),
  );

  const mockExercises = new Response(
    JSON.stringify({
      exercises: [
        {
          name: "Push-ups",
          description:
            "A basic exercise to strengthen the chest, shoulders, and triceps.",
          category: "Chest + Arms",
        },
        {
          name: "Calf Raises",
          description:
            "An exercise to strengthen the calf muscles by raising the heels off the ground.",
          category: "Legs",
        },
      ],
    }),
  );

  return new WorkoutServiceModel(mockCategories, mockExercises);
}

test("WorkoutServiceModel initializes with default round and category-change values", () => {
  const service = createService();

  assert.equal(service.getExerciseRounds(), CONFIG.DEFAULT_ROUNDS);
  assert.equal(service.getCategoryChange(), CONFIG.DEFAULT_CATEGORY_CHANGE);
});

test("WorkoutServiceModel clamps exercise rounds to configured limits", () => {
  const service = createService();

  service.setExerciseRounds(CONFIG.MIN_ROUNDS - 10);
  assert.equal(service.getExerciseRounds(), CONFIG.MIN_ROUNDS);

  service.setExerciseRounds(CONFIG.MAX_ROUNDS + 10);
  assert.equal(service.getExerciseRounds(), CONFIG.MAX_ROUNDS);
});

test("WorkoutServiceModel ignores non-integer rounds", () => {
  const service = createService();
  const original = service.getExerciseRounds();

  service.setExerciseRounds("abc");
  assert.equal(service.getExerciseRounds(), original);

  service.setExerciseRounds(1.5);
  assert.equal(service.getExerciseRounds(), original);
});

test("WorkoutServiceModel increments and decrements exercise rounds within bounds", () => {
  const service = createService();

  service.setExerciseRounds(CONFIG.MIN_ROUNDS);
  assert.equal(service.decreaseExerciseRounds(), CONFIG.MIN_ROUNDS);
  assert.equal(service.increaseExerciseRounds(), CONFIG.MIN_ROUNDS + 1);
  assert.equal(service.decreaseExerciseRounds(), CONFIG.MIN_ROUNDS);

  service.setExerciseRounds(CONFIG.MAX_ROUNDS);
  assert.equal(service.increaseExerciseRounds(), CONFIG.MAX_ROUNDS);
});

test("WorkoutServiceModel clamps category-change interval to configured limits", () => {
  const service = createService();

  service.setCategoryChange(CONFIG.MIN_CATEGORY_CHANGE - 10);
  assert.equal(service.getCategoryChange(), CONFIG.MIN_CATEGORY_CHANGE);

  service.setCategoryChange(CONFIG.MAX_CATEGORY_CHANGE + 10);
  assert.equal(service.getCategoryChange(), CONFIG.MAX_CATEGORY_CHANGE);
});

test("WorkoutServiceModel ignores non-integer category-change values", () => {
  const service = createService();
  const original = service.getCategoryChange();

  service.setCategoryChange("abc");
  assert.equal(service.getCategoryChange(), original);

  service.setCategoryChange(2.5);
  assert.equal(service.getCategoryChange(), original);
});

test("WorkoutServiceModel increments and decrements category-change within bounds", () => {
  const service = createService();

  service.setCategoryChange(CONFIG.MIN_CATEGORY_CHANGE);
  assert.equal(service.decreaseCategoryChange(), CONFIG.MIN_CATEGORY_CHANGE);
  assert.equal(
    service.increaseCategoryChange(),
    CONFIG.MIN_CATEGORY_CHANGE + 1,
  );
  assert.equal(service.decreaseCategoryChange(), CONFIG.MIN_CATEGORY_CHANGE);

  service.setCategoryChange(CONFIG.MAX_CATEGORY_CHANGE);
  assert.equal(service.increaseCategoryChange(), CONFIG.MAX_CATEGORY_CHANGE);
});

test("WorkoutServiceModel toggles a selected category", async () => {
  const service = createService();

  const categoriesInitial = [...(await service.getExerciseCategories())];
  const lengthInitial = categoriesInitial.length;

  await service.updateExerciseCategories(categoriesInitial[0]);
  const lengthUpdated = (await service.getExerciseCategories()).length;

  assert.notEqual(lengthInitial, lengthUpdated);

  await service.updateExerciseCategories(categoriesInitial[0]);
  const lengthUpdatedAgain = (await service.getExerciseCategories()).length;

  assert.equal(lengthInitial, lengthUpdatedAgain);
});

test("WorkoutServiceModel throws an error during workout generation if no categories are selected", async () => {
  const service = createService();

  const categories = [...(await service.getExerciseCategories())];

  for (const category of categories) {
    await service.updateExerciseCategories(category);
  }

  await assert.rejects(
    () => service.generateWorkout(),
    /Select at least one exercise category\./,
  );
});

test("WorkoutServiceModel generates a workout", async () => {
  const service = createService();

  const workout = await service.generateWorkout();

  assert.equal(workout.length, CONFIG.DEFAULT_ROUNDS);
});
