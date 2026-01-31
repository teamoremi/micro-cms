import { CmsContext, CmsModule } from '@micro-cms/types';

class EventBus {
  private listeners: Record<string, Function[]> = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, payload: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(payload));
    }
  }
}

export class App {
  private modules: CmsModule[] = [];
  private eventBus = new EventBus();
  private state: Record<string, any> = {};

  use(module: CmsModule) {
    this.modules.push(module);
    return this;
  }

  async start() {
    const context: CmsContext = {
      registerHook: (hook, cb) => this.eventBus.on(hook, cb),
      emit: (event, payload) => this.eventBus.emit(event, payload),
      state: this.state,
    };

    for (const mod of this.modules) {
      console.log(`Loading module: ${mod.name}`);
      await mod.setup(context);
    }
    console.log('App started');
  }
}

export function createApp() {
  return new App();
}
