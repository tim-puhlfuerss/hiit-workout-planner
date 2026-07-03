import test from "node:test";
import assert from "node:assert/strict";
import { ExerciseEntityModel } from "../workout/ExerciseEntityModel.js";
import { ExerciseCategoryValueModel } from "../workout/ExerciseCategoryValueModel.js";

test("ExerciseEntityModel stores and returns name, description, and category", () => {
  const category = new ExerciseCategoryValueModel("Arms", "💪");
  const exercise = new ExerciseEntityModel(
    "Push-up",
    "Description for push-up",
    category,
  );

  assert.equal(exercise.getName(), "Push-up");
  assert.equal(exercise.getDescription(), "Description for push-up");
  assert.equal(exercise.getCategory(), category);
});
