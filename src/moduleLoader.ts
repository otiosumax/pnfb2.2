import fs from "node:fs/promises";
import path from "node:path";
import { ModuleLoadError } from "../src/errors.ts";
import type Module from "./models/module.ts";

export async function loadModulesFromConfig(
  configPath: string,
  modulesDir: string,
): Promise<Map<string, any>> {
  const raw = await fs.readFile(configPath, "utf-8");
  const cfg = JSON.parse(raw);

  const files = cfg.modules ?? [];
  const loadedModules = new Map<string, any>();

  for (const file of files) {
    const full = path.resolve(modulesDir, file);
    const mod = await import(full);
    const moduleObj = mod.default;

    if (!moduleObj || typeof moduleObj.name !== "string") {
      throw new ModuleLoadError(`Некорректный модуль, файл ${file}`);
    }

    loadedModules.set(moduleObj.name.toLowerCase(), moduleObj);
  }

  return loadedModules;
}

export function buildOrder(
  allModules: Map<string, Module>,
  enabledNames: string[],
) {
  const enabledModules = new Map<string, Module>();

  for (const name of enabledNames) {
    const key = name.toLowerCase();
    const moduleObj = allModules.get(key);
    if (!moduleObj) {
      throw new ModuleLoadError(`Модуль ${name} не найден`);
    }
    enabledModules.set(key, moduleObj);
  }

  for (const moduleObj of enabledModules.values()) {
    const requires = moduleObj.requires ?? [];
    for (const r of requires) {
      if (!enabledModules.has(r.toLocaleLowerCase())) {
        throw new ModuleLoadError(
          `Не хватает модуля для зависимости. Модуль ${moduleObj.name} требует ${r}`,
        );
      }
    }
  }

  const indeg = new Map<string, number>();
  const edges = new Map<string, string[]>();

  for (const [k, m] of enabledModules) {
    indeg.set(k, 0);
    edges.set(k, []);
  }

  for (const [k, m] of enabledModules) {
    const requires = m.requires ?? [];
    for (const r0 of requires) {
      const r = r0.toLowerCase();
      edges.get(r)?.push(k);
      indeg.set(k, indeg.get(k)! + 1);
    }
  }

  const q: string[] = [];
  for (const [k, v] of indeg) {
    if (v === 0) q.push(k);
  }

  const result = [];
  while (q.length > 0) {
    const k = q.shift()!;
    result.push(enabledModules.get(k));
    for (const to of edges.get(k)!) {
      indeg.set(to, indeg.get(to)! - 1);
      if (indeg.get(to) === 0) q.push(to);
    }
  }

  if (result.length !== enabledModules.size) {
    const stuck = [];
    for (const [k, v] of indeg) {
      if (v > 0) stuck.push(enabledModules.get(k)!.name);
    }
    throw new ModuleLoadError(
      `Обнаружена циклическая зависимость модулей. Проблемные модули ${stuck.join(", ")}`,
    );
  }
  return result;
}
