import type { ESLint, Linter } from "eslint";

/**
 * Builds the `recommended-vue` flat config for the given plugin instance
 * @param pluginCrisp The `eslint-plugin-crisp` plugin object
 * @return The flat config array
 */
export default function configRecommendedVue(pluginCrisp: ESLint.Plugin): Linter.Config[];
