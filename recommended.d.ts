import type { ESLint, Linter } from "eslint";

/**
 * Builds the `recommended` flat config for the given plugin instance
 * @param pluginCrisp The `eslint-plugin-crisp` plugin object
 * @return The flat config array
 */
export default function configRecommended(pluginCrisp: ESLint.Plugin): Linter.Config[];
