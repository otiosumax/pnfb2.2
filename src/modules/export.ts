import { Container } from "../models/container.ts";
import type Module from "../models/module.ts";

const ExportModule: Module = {
  name: "export",
  requires: ["games", "users"],
  register(container: Container) {
    container.addTransient("json-backup", () => ({
      createBackup(): void {
        /*TODO: implement*/
      },
    }));
  },
};

export default ExportModule;
