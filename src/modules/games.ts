import { Container } from "../models/container.ts";
import { type Game } from "../models/game.ts";
import type Module from "../models/module.ts";

export const GamesModule: Module = {
  name: "games",
  requires: ["core"],
  register(container: Container) {
    container.addSingleton("games-catalog", () => ({
      add(game: Game): void {
        /*TODO: implement*/
      },
      search(querry: string): Game[] {
        /*TODO: implement*/
        return [];
      },
    }));
  },
};
