import { getConfig } from "./config";
import { getState, setState } from "./state";
import { StageDefinition } from "./overlay";

function mountInteractionAreaMask() {
  const interactionAreaMask = createInteractionAreaMask();
  document.body.appendChild(interactionAreaMask);

  setState("__interactionAreaMask", interactionAreaMask);
}

export function renderInteractionAreaMask(stagePosition: StageDefinition) {
  const interactionAreaMask = getState("__interactionAreaMask");

  if (!interactionAreaMask) {
    mountInteractionAreaMask();
  }

  updateInteractionAreaMask(stagePosition);
}

function createInteractionAreaMask(): HTMLElement {
  const mask = document.createElement("div");

  mask.classList.add("mp-guide-interaction-mask");

  mask.style.position = "fixed";
  mask.style.pointerEvents = "auto";
  mask.style.zIndex = "10000";

  return mask;
}

function updateInteractionAreaMask(stage: StageDefinition) {
  const interactionAreaMask = getState("__interactionAreaMask");

  const stagePadding = getConfig("stagePadding") || 0;
  const stageRadius = getConfig("stageRadius") || 0;

  const stageWidth = stage.width + stagePadding * 2;
  const stageHeight = stage.height + stagePadding * 2;

  // 防止高亮区域过小时因圆角半径导致的渲染异常
  const limitedRadius = Math.min(stageRadius, stageWidth / 2, stageHeight / 2);

  // 确保半径值不小于0并向下取整
  const radius = Math.floor(Math.max(limitedRadius, 0));

  const x = stage.x - stagePadding;
  const y = stage.y - stagePadding;

  interactionAreaMask!.style.left = x + "px";
  interactionAreaMask!.style.top = y + "px";
  interactionAreaMask!.style.width = stageWidth + "px";
  interactionAreaMask!.style.height = stageHeight + "px";
  interactionAreaMask!.style.borderRadius = radius + "px";
  interactionAreaMask!.style.pointerEvents = getConfig("disableActiveInteraction") ? "auto" : "none";
}

export function destroyInteractionAreaMask() {
  const interactionAreaMask = getState("__interactionAreaMask");
  if (interactionAreaMask) {
    interactionAreaMask.remove();
  }
}
