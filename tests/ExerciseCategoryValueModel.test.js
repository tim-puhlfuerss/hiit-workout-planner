import test from "node:test";
import assert from "node:assert/strict";
import { ExerciseCategoryValueModel } from "../workout/ExerciseCategoryValueModel.js";

test("ExerciseCategoryValueModel stores and returns name and emoji", () => {
  const cat = new ExerciseCategoryValueModel("Arms", "💪");

  assert.equal(cat.getName(), "Arms");
  assert.equal(cat.getEmoji(), "💪");
});

test("ExerciseCategoryValueModel equals compares categories with each other", () => {
  const catOriginal = new ExerciseCategoryValueModel("Arms", "💪");
  const catSame = new ExerciseCategoryValueModel("Arms", "💪");
  const catDifferentName = new ExerciseCategoryValueModel("Legs", "💪");
  const catDifferentEmoji = new ExerciseCategoryValueModel("Arms", "🏋️");

  assert.equal(catOriginal.equals(catSame), true);
  assert.equal(catOriginal.equals(catDifferentName), false);
  assert.equal(catOriginal.equals(catDifferentEmoji), false);
});
