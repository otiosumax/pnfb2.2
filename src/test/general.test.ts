import { Container } from "../models/container.ts";
import { CoreModule } from "../modules/core.ts";
import { UsersModule } from "../modules/users.ts";

const container = new Container();

CoreModule.register!(container);
UsersModule.register!(container);

console.log(container.get("clock").now());
