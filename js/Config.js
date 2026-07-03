/**
 * Configuration constants (default values, numeric limits, asset paths)
 *
 * @namespace CONFIG
 */
export const CONFIG = {
  /** @type {number} Default workout rounds */
  DEFAULT_ROUNDS: 10,

  /** @type {number} Minimum workout rounds */
  MIN_ROUNDS: 1,

  /** @type {number} Maximum workout rounds */
  MAX_ROUNDS: 100,

  /** @type {number} Default rounds before changing the exercise category */
  DEFAULT_CATEGORY_CHANGE: 1,

  /** @type {number} Minimum rounds before changing the exercise category */
  MIN_CATEGORY_CHANGE: 1,

  /** @type {number} Maximum rounds before changing the exercise category */
  MAX_CATEGORY_CHANGE: 100,

  /** @type {string} Path to the exercise categories JSON file */
  CATEGORIES_FILE: new URL(
    "../assets/json/ExerciseCategories.json",
    import.meta.url, // URL of the current module (to create an absolute path necessary for testing via Node)
  ),

  /** @type {string} Path to the exercises JSON file */
  EXERCISES_FILE: new URL("../assets/json/Exercises.json", import.meta.url),
};
