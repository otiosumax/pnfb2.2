import { type Container } from "./container.ts";

export default interface Module {
  name: string;
  readonly requires?: string[];
  register: (container: Container) => void;
  init?: (container: Container) => Promise<void>;
}
