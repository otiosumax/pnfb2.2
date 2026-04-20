import test from "node:test";
import { buildOrder } from "../moduleLoader.ts";
import assert, { deepEqual } from "node:assert";

test("Порядок запуска учитывает зависимости", () => {
  const all = new Map();
  all.set("a", { name: "A", requires: [] });
  all.set("b", { name: "B", requires: ["A"] });
  all.set("c", { name: "C", requires: ["B"] });

  const order = buildOrder(all, ["A", "B", "C"]);
  assert(
    deepEqual(
      order.map((x) => x!.name),
      ["A", "B", "C"],
    ),
  );
});
