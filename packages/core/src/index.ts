import { CmsContext, CmsModule, EventStage, SubscriptionOptions } from '@micro-cms/types';

interface Handler {
  callback: Function;
  priority: number;
  parallel: boolean;
}

class EventBus {
  private listeners: Record<string, Record<EventStage, Handler[]>> = {};

  subscribe(event: string, callback: Function, options: SubscriptionOptions = {}) {
    const stage = options.stage || 'default';
    const priority = options.priority || 0;
    const parallel = options.parallel || false;

    if (!this.listeners[event]) {
      this.listeners[event] = {
        validation: [],
        processing: [],
        notification: [],
        default: []
      };
    }

    this.listeners[event][stage].push({ callback, priority, parallel });
    this.listeners[event][stage].sort((a, b) => b.priority - a.priority);
  }

  async emit(event: string, payload: any) {
    if (!this.listeners[event]) return;

    const stages: EventStage[] = ['validation', 'processing', 'notification', 'default'];

    for (const stage of stages) {
      const handlers = this.listeners[event][stage];
      
      const parallelHandlers = handlers.filter(h => h.parallel);
      const sequentialHandlers = handlers.filter(h => !h.parallel);

      // Run sequential first (or in order of priority)
      for (const handler of sequentialHandlers) {
        await handler.callback(payload);
      }

      // Run parallel
      if (parallelHandlers.length > 0) {
        await Promise.all(parallelHandlers.map(h => h.callback(payload)));
      }
    }
  }
}

class StateManager {
  private state: Record<string, any> = {};
  private subscribers: Record<string, Function[]> = {};

  publish(key: string, value: any) {
    this.state[key] = value;
    if (this.subscribers[key]) {
      this.subscribers[key].forEach(cb => cb(value));
    }
  }

  get(key: string) {
    return this.state[key];
  }

  subscribe(key: string, callback: Function) {
    if (!this.subscribers[key]) this.subscribers[key] = [];
    this.subscribers[key].push(callback);
  }
}

export class RouteRegistry {
  private routes: Record<string, any[]> = {};

  register(moduleName: string, routes: any[]) {
    this.routes[moduleName] = routes;
  }

  getAllRoutes() {
    return Object.values(this.routes).flat();
  }
}

export class App {
  private modules: CmsModule[] = [];
  private eventBus = new EventBus();
  private stateManager = new StateManager();
  private routeRegistry = new RouteRegistry();
  private capabilities: Record<string, any> = {};
  private configs: Record<string, any> = {};

  use(module: CmsModule, config: Record<string, any> = {}) {
    this.modules.push(module);
    this.configs[module.manifest.name] = config;
    return this;
  }

  get context() {
    return {
      get: (k: string) => this.stateManager.get(k),
      subscribe: (k: string, c: Function) => this.stateManager.subscribe(k, c)
    };
  }

  get runtime() {
    return {
      getCapability: <T = any>(cap: string): T | undefined => this.capabilities[cap],
      getRoutes: () => this.routeRegistry.getAllRoutes()
    };
  }

  async start() {
    for (const mod of this.modules) {
      console.log(`Loading module: ${mod.manifest.name} (v${mod.manifest.version})`);
      
      const context: CmsContext = {
        runtime: {
          register: (cap, impl) => { 
            this.capabilities[cap] = impl; 
            // Special handling for route-provider
            if (cap === 'route-provider' && typeof impl.getRoutes === 'function') {
              this.routeRegistry.register(mod.manifest.name, impl.getRoutes());
            }
          },
          getCapability: (cap) => this.capabilities[cap]
        },
        events: {
          emit: (e, p) => this.eventBus.emit(e, p),
          subscribe: (e, c, o) => this.eventBus.subscribe(e, c, o)
        },
        context: {
          publish: (k, v) => this.stateManager.publish(k, v),
          get: (k) => this.stateManager.get(k),
          subscribe: (k, c) => this.stateManager.subscribe(k, c)
        },
        config: this.configs[mod.manifest.name] || {}
      };

      await mod.load(context);
    }
    console.log('App started with all modules loaded.');
  }
}

export function createApp() {
  return new App();
}