import test from "node:test";
import { buildOrder } from "../moduleLoader.ts";
import assert from "node:assert";
import { ModuleLoadError } from "../errors.ts";

test("Порядок запуска учитывает зависимости", () => {
  const all = new Map();
  all.set("a", { name: "A", requires: [] });
  all.set("b", { name: "B", requires: ["A"] });
  all.set("c", { name: "C", requires: ["B"] });

  const order = buildOrder(all, ["B", "A", "C"]);
  assert.deepEqual(
    order.map((x) => x.name),
    ["A", "B", "C"],
  );
});

test("Отсутствующий модуль дает понятную ошибку", () => {
  const all = new Map();
  all.set("a", { name: "A", requires: [] });

  assert.throws(
    () => buildOrder(all, ["A", "B"]),
    (e) => e instanceof ModuleLoadError && e.message.includes("не найден"),
  );
});

test("Цикл зависимостей обнаруживается", () => {
  const all = new Map();
  all.set("a", { name: "A", requires: ["B"] });
  all.set("b", { name: "B", requires: ["A"] });

  assert.throws(
    () => buildOrder(all, ["A", "B"]),
    (e) => e instanceof ModuleLoadError && e.message.includes("циклическая"),
  );
});
