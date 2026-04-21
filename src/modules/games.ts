import { Container } from "../models/container.ts";
import { type Game } from "../models/game.ts";
import type Module from "../models/module.ts";

const GamesModule: Module = {
  name: "games",
  requires: ["core"],
  register(container: Container) {
    container.addSingleton("games-catalog", () => {
      const games: Game[] = [];

      return {
        add(game: Game): void {
          if (games.find((g) => g.id === game.id)) return;
          games.push(game);
        },
        search(querry: string): Game[] {
          const resultGames: Game[] = [];
          for (const g of games) {
            if (g.name.includes(querry)) {
              resultGames.push(g);
            }
          }
          return resultGames;
        },
      };
    });
  },
};

export default GamesModule;
