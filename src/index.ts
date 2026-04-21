import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildOrder, loadModulesFromConfig } from "./moduleLoader.ts";
import { Container } from "./models/container.ts";

// Путь к директории
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// путь к модулям
const configPath = path.resolve(_dirname, "modules.json");
const modulesDir = path.resolve(_dirname, "modules");

// получение модулей
const all = await loadModulesFromConfig(configPath, modulesDir);

const enabledNames = [];
for (const [_, m] of all) {
  enabledNames.push(m.name);
}

const ordered = buildOrder(all, enabledNames);

const container = new Container();

// Регистрация модулей
for (const m of ordered) {
  if (typeof m.register === "function") {
    m.register(container);
  }
}

// Инициализация модулей
for (const m of ordered) {
  if (typeof m.init === "function") {
    await m.init(container);
  }
}

// const actions = container.getMany("action.");
// console.log("Запуск действий модулей");
// for (const act of actions) {
//   console.log(`Действие ${act.title}`)
//   await act.excecute();
// }

// const exportPath = path.resolve(process.cwd(), "export.txt");
// try {
//   await access(exportPath);
// }
