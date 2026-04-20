export interface Container {
  addSingleton(key: string, factory: any): void;
  addTransient(key: string, factory: any): void;
  get(key: string): any;
  getMany(prefix: string): any[];
}

export class Container implements Container {
  private _factories: Map<string, any>;
  private _singletons: Map<string, any>;

  constructor() {
    this._factories = new Map();
    this._singletons = new Map();
  }

  addSingleton(key: string, factory: any): void {
    this._factories.set(key, { type: "singleton", factory });
  }
  addTransient(key: string, factory: any): void {
    this._factories.set(key, { type: "transient", factory });
  }

  get(key: string): any {
    const entry = this._factories.get(key);
    if (!entry) {
      throw new Error(`Служба ${key} не зарегистрирована`);
    }
    if (entry.type === "singleton") {
      if (!this._singletons.has(key)) {
        this._singletons.set(key, entry.factory(this));
      }
      return this._singletons.get(key);
    }

    return entry.factory(this);
  }

  getMany(prefix: string): any[] {
    const results = [];
    for (const [key] of this._factories) {
      if (key.startsWith(prefix)) {
        results.push(this.get(key));
      }
    }
    return results;
  }
}
