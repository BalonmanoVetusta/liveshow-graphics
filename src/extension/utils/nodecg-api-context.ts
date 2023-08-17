import type NodeCG from '@nodecg/types';

let context: NodeCG.ServerAPI;
// With this module we set a context api so every module can access nodecg's api easily
export function get(): NodeCG.ServerAPI {
  return context;
}

export function set(ctx: NodeCG.ServerAPI): void {
  context = ctx;
}
