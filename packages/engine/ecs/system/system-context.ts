import type { Component, ComponentId } from "../component/component";
import type { Entity } from "../entity/entity";
import type { World } from "../world";

/**
 * A Context for system update.
 * System should not call some functions directly like addEntity/addComponent,
 * instead of passing world object, we pass this context.
 */
export class SystemContext {
  constructor(private world: World) {}

  /**
   * Iterates every entity that has all component of componentIds.
   * Memory inefficient version.
   * @param componentIds
   * @param callback
   */
  each = (
    componentIds: ComponentId[],
    callback: (entity: Entity, components: Component[]) => void,
  ) => {
    if (componentIds.length === 0) {
      return;
    }

    const componentBags = componentIds
      .map(this.world.components.get)
      .filter((v) => v != null);
    if (componentIds.length !== componentBags.length) {
      return;
    }

    const shortestBag = componentBags.sort((a, b) => a.length - b.length)[0];
    for (const entity of shortestBag.denseEntities) {
      let hasEveryComponent = true;
      for (const bag of componentBags) {
        hasEveryComponent &&= bag.has(entity);
      }
      if (hasEveryComponent) {
        callback(
          entity,
          componentBags.map((bag) => bag.get(entity)),
        );
      }
    }
  };
}
