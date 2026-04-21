import { Container } from "../models/container.ts";
import { type Game } from "../models/game.ts";
import type Module from "../models/module.ts";

const CoreModule: Module = {
  name: "core",
  requires: [],
  register(container: Container) {
    container.addSingleton("clock", () => ({
      now: () => new Date().toISOString(),
    }));
    container.addSingleton("storage", () => {
      const games: Game[] = [];
      return {
        add(game: Game) {
          games.push(game);
        },
        all() {
          return games.slice();
        },
        findById(id: string): Game {
          const game = games.find((g) => g.id === id);
          if (!game) throw new Error(`Не существует игры с Id=${id}`);
          return game;
        },
      };
    });
  },
  async init(container) {},
};

export default CoreModule;