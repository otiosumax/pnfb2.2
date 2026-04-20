import { Container } from "../models/container.ts";
import { type Game } from "../models/game.ts";
import type Module from "../models/module.ts";
import { type User } from "../models/user.ts";

export const UsersModule: Module = {
  name: "users",
  requires: ["core"],
  register(container: Container) {
    container.addSingleton("user-service", () => {
      const users: User[] = [];

      return {
        create(user: User) {
          users.push(user);
        },
        getUsers(): User[] {
          return users;
        },
        findUserById(id: string): User | undefined {
          return users.find((u) => u.id === id);
        },
        addToLibrary(userId: string, gameId: string): void {
          const user = this.findUserById(userId);
          if (!user) throw new Error(`Нет пользователя с Id ${userId}`);
          if (user.games.find((g) => g === gameId)) return;
          user.games.push(gameId);
          console.log(this.findUserById(userId)?.games ?? "no games");
        },
        getLibrary(user: User): Game[] {
          /*TODO: implement*/
          return [];
        },
      };
    });
    container.addTransient("auth", () => ({
      login(user: User) {
        /*TODO: implement*/
      },
    }));
  },
};
