import type { Engine } from "@scatter/engine";
import type { Entity } from "@scatter/engine/ecs/entity/entity";
import {
  Background,
  BackgroundVariant,
  Controls,
  Panel as FlowPanel,
  type Node,
  type OnConnect,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { atom, useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { ScriptPanel } from "~/script/script-panel";
import { GameNode } from "~/game/game-node";
import { InspectorPanel } from "~/inspector/inspector-panel";
import { ScenePanel } from "~/scene/scene-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AssetsPanel } from "~/assets/assets-panel";

export const selectedEngineAtom = atom<Engine | null>(null);
export const selectedEntityAtom = atom<Entity | null>(null);
export const selectedEntityDataAtom = atom({});
export const entitiesAtom = atom<Entity[]>([]);

const initialNodes: Node[] = [
  {
    id: "game-1",
    type: "gameNode",
    position: { x: -15, y: 0 },
    data: {},
  },
];

const panOnDrag = [1, 2];

export function GameEditorPage() {
  const engine = useAtomValue(selectedEngineAtom);
  const [selectedEntity, setSelectedEntity] = useAtom(selectedEntityAtom);
  const selectedEntityData = useAtomValue(selectedEntityDataAtom);
  const entities = useAtomValue(entitiesAtom);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback<OnConnect>(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  const nodeTypes = useMemo(() => {
    return {
      gameNode: GameNode,
    };
  }, []);

  return (
    <div className="font-sans w-full h-full min-w-0 relative">
      <ReactFlow
        colorMode="dark"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 1,
        }}
        // panOnScroll
        // selectionOnDrag
        // panOnDrag={panOnDrag}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls
          position="top-left"
          className="rounded-md overflow-clip"
          style={{ left: "315px" }}
        />
        <Background
          id="2"
          variant={BackgroundVariant.Lines}
          gap={1000}
          bgColor="transparent"
          color="var(--slate-7)"
          lineWidth={3}
          offset={500}
        />
        <Background
          id="1"
          variant={BackgroundVariant.Lines}
          gap={100}
          bgColor="transparent"
          color="var(--slate-6)"
          lineWidth={1}
          offset={50}
        />
        <FlowPanel
          position="top-left"
          className="flex flex-col gap-3 h-[calc(100%-30px)]"
        >
          <Tabs defaultValue="scene" className="w-full h-full">
            <TabsList>
              <TabsTrigger value="scene">Scene</TabsTrigger>
              <TabsTrigger value="asset">Asset</TabsTrigger>
            </TabsList>
            <TabsContent value="scene" className="w-full h-full">
              <ScenePanel
                engine={engine}
                entities={entities}
                onSelectionChange={(entities) => setSelectedEntity(entities[0])}
              />
            </TabsContent>
            <TabsContent value="asset" className="w-full h-full">
              {engine?.assets && <AssetsPanel assets={engine.assets} />}
            </TabsContent>
          </Tabs>
        </FlowPanel>
        <FlowPanel
          position="bottom-center"
          className="w-[calc(100%-600px-30px)]"
        >
          <ScriptPanel engine={engine} className="w-[calc(100%-30px)]" />
        </FlowPanel>
        <FlowPanel
          position="top-right"
          className="flex flex-col gap-3 h-[calc(100%-30px)]"
        >
          <InspectorPanel
            entity={selectedEntity}
            components={selectedEntityData}
            engine={engine}
          />
        </FlowPanel>
      </ReactFlow>
    </div>
  );
}
