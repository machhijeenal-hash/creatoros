import { c as createLucideIcon, f as frame, a as cancelFrame, i as interpolate, s as supportsViewTimeline, b as supportsScrollTimeline, p as progress, v as velocityPerSecond, d as isHTMLElement, e as defaultOffset$1, g as clamp, n as noop, r as resize, h as frameData, u as useConstant, j as reactExports, k as useIsomorphicLayoutEffect, l as invariant, m as motionValue, M as MotionConfigContext, o as collectMotionValues, q as jsxRuntimeExports, t as motion, L as Link, S as Sparkles, A as AnimatePresence, T as Timer, C as ChevronDown, Z as Zap } from "./index-Bt5dTGTg.js";
import { B as Badge } from "./badge-DMLtg8Eo.js";
import { B as Button } from "./button-iLZnvIfQ.js";
import { A as ArrowRight, B as Brain, C as Calendar, F as Flame } from "./flame-CG07Ij06.js";
import { X } from "./x-hpogwdby.js";
import { P as Play } from "./play-D-ElFPiQ.js";
import { S as Star } from "./star-uvVnGxEB.js";
import { C as CircleCheck } from "./circle-check-DUKEi9zg.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu = createLucideIcon("menu", __iconNode);
function observeTimeline(update, timeline) {
  let prevProgress;
  const onFrame = () => {
    const { currentTime } = timeline;
    const percentage = currentTime === null ? 0 : currentTime.value;
    const progress2 = percentage / 100;
    if (prevProgress !== progress2) {
      update(progress2);
    }
    prevProgress = progress2;
  };
  frame.preUpdate(onFrame, true);
  return () => cancelFrame(onFrame);
}
function transform(...args) {
  const useImmediate = !Array.isArray(args[0]);
  const argOffset = useImmediate ? 0 : -1;
  const inputValue = args[0 + argOffset];
  const inputRange = args[1 + argOffset];
  const outputRange = args[2 + argOffset];
  const options = args[3 + argOffset];
  const interpolator = interpolate(inputRange, outputRange, options);
  return useImmediate ? interpolator(inputValue) : interpolator;
}
function canUseNativeTimeline(target) {
  if (typeof window === "undefined")
    return false;
  return target ? supportsViewTimeline() : supportsScrollTimeline();
}
const maxElapsed = 50;
const createAxisInfo = () => ({
  current: 0,
  offset: [],
  progress: 0,
  scrollLength: 0,
  targetOffset: 0,
  targetLength: 0,
  containerLength: 0,
  velocity: 0
});
const createScrollInfo = () => ({
  time: 0,
  x: createAxisInfo(),
  y: createAxisInfo()
});
const keys = {
  x: {
    length: "Width",
    position: "Left"
  },
  y: {
    length: "Height",
    position: "Top"
  }
};
function updateAxisInfo(element, axisName, info, time) {
  const axis = info[axisName];
  const { length, position } = keys[axisName];
  const prev = axis.current;
  const prevTime = info.time;
  axis.current = Math.abs(element[`scroll${position}`]);
  axis.scrollLength = element[`scroll${length}`] - element[`client${length}`];
  axis.offset.length = 0;
  axis.offset[0] = 0;
  axis.offset[1] = axis.scrollLength;
  axis.progress = progress(0, axis.scrollLength, axis.current);
  const elapsed = time - prevTime;
  axis.velocity = elapsed > maxElapsed ? 0 : velocityPerSecond(axis.current - prev, elapsed);
}
function updateScrollInfo(element, info, time) {
  updateAxisInfo(element, "x", info, time);
  updateAxisInfo(element, "y", info, time);
  info.time = time;
}
function calcInset(element, container) {
  const inset = { x: 0, y: 0 };
  let current = element;
  while (current && current !== container) {
    if (isHTMLElement(current)) {
      inset.x += current.offsetLeft;
      inset.y += current.offsetTop;
      current = current.offsetParent;
    } else if (current.tagName === "svg") {
      const svgBoundingBox = current.getBoundingClientRect();
      current = current.parentElement;
      const parentBoundingBox = current.getBoundingClientRect();
      inset.x += svgBoundingBox.left - parentBoundingBox.left;
      inset.y += svgBoundingBox.top - parentBoundingBox.top;
    } else if (current instanceof SVGGraphicsElement) {
      const { x, y } = current.getBBox();
      inset.x += x;
      inset.y += y;
      let svg = null;
      let parent = current.parentNode;
      while (!svg) {
        if (parent.tagName === "svg") {
          svg = parent;
        }
        parent = current.parentNode;
      }
      current = svg;
    } else {
      break;
    }
  }
  return inset;
}
const namedEdges = {
  start: 0,
  center: 0.5,
  end: 1
};
function resolveEdge(edge, length, inset = 0) {
  let delta = 0;
  if (edge in namedEdges) {
    edge = namedEdges[edge];
  }
  if (typeof edge === "string") {
    const asNumber = parseFloat(edge);
    if (edge.endsWith("px")) {
      delta = asNumber;
    } else if (edge.endsWith("%")) {
      edge = asNumber / 100;
    } else if (edge.endsWith("vw")) {
      delta = asNumber / 100 * document.documentElement.clientWidth;
    } else if (edge.endsWith("vh")) {
      delta = asNumber / 100 * document.documentElement.clientHeight;
    } else {
      edge = asNumber;
    }
  }
  if (typeof edge === "number") {
    delta = length * edge;
  }
  return inset + delta;
}
const defaultOffset = [0, 0];
function resolveOffset(offset, containerLength, targetLength, targetInset) {
  let offsetDefinition = Array.isArray(offset) ? offset : defaultOffset;
  let targetPoint = 0;
  let containerPoint = 0;
  if (typeof offset === "number") {
    offsetDefinition = [offset, offset];
  } else if (typeof offset === "string") {
    offset = offset.trim();
    if (offset.includes(" ")) {
      offsetDefinition = offset.split(" ");
    } else {
      offsetDefinition = [offset, namedEdges[offset] ? offset : `0`];
    }
  }
  targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
  containerPoint = resolveEdge(offsetDefinition[1], containerLength);
  return targetPoint - containerPoint;
}
const ScrollOffset = {
  Enter: [
    [0, 1],
    [1, 1]
  ],
  Exit: [
    [0, 0],
    [1, 0]
  ],
  Any: [
    [1, 0],
    [0, 1]
  ],
  All: [
    [0, 0],
    [1, 1]
  ]
};
const point = { x: 0, y: 0 };
function getTargetSize(target) {
  return "getBBox" in target && target.tagName !== "svg" ? target.getBBox() : { width: target.clientWidth, height: target.clientHeight };
}
function resolveOffsets(container, info, options) {
  const { offset: offsetDefinition = ScrollOffset.All } = options;
  const { target = container, axis = "y" } = options;
  const lengthLabel = axis === "y" ? "height" : "width";
  const inset = target !== container ? calcInset(target, container) : point;
  const targetSize = target === container ? { width: container.scrollWidth, height: container.scrollHeight } : getTargetSize(target);
  const containerSize = {
    width: container.clientWidth,
    height: container.clientHeight
  };
  info[axis].offset.length = 0;
  let hasChanged = !info[axis].interpolate;
  const numOffsets = offsetDefinition.length;
  for (let i = 0; i < numOffsets; i++) {
    const offset = resolveOffset(offsetDefinition[i], containerSize[lengthLabel], targetSize[lengthLabel], inset[axis]);
    if (!hasChanged && offset !== info[axis].interpolatorOffsets[i]) {
      hasChanged = true;
    }
    info[axis].offset[i] = offset;
  }
  if (hasChanged) {
    info[axis].interpolate = interpolate(info[axis].offset, defaultOffset$1(offsetDefinition), { clamp: false });
    info[axis].interpolatorOffsets = [...info[axis].offset];
  }
  info[axis].progress = clamp(0, 1, info[axis].interpolate(info[axis].current));
}
function measure(container, target = container, info) {
  info.x.targetOffset = 0;
  info.y.targetOffset = 0;
  if (target !== container) {
    let node = target;
    while (node && node !== container) {
      info.x.targetOffset += node.offsetLeft;
      info.y.targetOffset += node.offsetTop;
      node = node.offsetParent;
    }
  }
  info.x.targetLength = target === container ? target.scrollWidth : target.clientWidth;
  info.y.targetLength = target === container ? target.scrollHeight : target.clientHeight;
  info.x.containerLength = container.clientWidth;
  info.y.containerLength = container.clientHeight;
}
function createOnScrollHandler(element, onScroll, info, options = {}) {
  return {
    measure: (time) => {
      measure(element, options.target, info);
      updateScrollInfo(element, info, time);
      if (options.offset || options.target) {
        resolveOffsets(element, info, options);
      }
    },
    notify: () => onScroll(info)
  };
}
const scrollListeners = /* @__PURE__ */ new WeakMap();
const resizeListeners = /* @__PURE__ */ new WeakMap();
const onScrollHandlers = /* @__PURE__ */ new WeakMap();
const scrollSize = /* @__PURE__ */ new WeakMap();
const dimensionCheckProcesses = /* @__PURE__ */ new WeakMap();
const getEventTarget = (element) => element === document.scrollingElement ? window : element;
function scrollInfo(onScroll, { container = document.scrollingElement, trackContentSize = false, ...options } = {}) {
  if (!container)
    return noop;
  let containerHandlers = onScrollHandlers.get(container);
  if (!containerHandlers) {
    containerHandlers = /* @__PURE__ */ new Set();
    onScrollHandlers.set(container, containerHandlers);
  }
  const info = createScrollInfo();
  const containerHandler = createOnScrollHandler(container, onScroll, info, options);
  containerHandlers.add(containerHandler);
  if (!scrollListeners.has(container)) {
    const measureAll = () => {
      for (const handler of containerHandlers) {
        handler.measure(frameData.timestamp);
      }
      frame.preUpdate(notifyAll);
    };
    const notifyAll = () => {
      for (const handler of containerHandlers) {
        handler.notify();
      }
    };
    const listener2 = () => frame.read(measureAll);
    scrollListeners.set(container, listener2);
    const target = getEventTarget(container);
    window.addEventListener("resize", listener2);
    if (container !== document.documentElement) {
      resizeListeners.set(container, resize(container, listener2));
    }
    target.addEventListener("scroll", listener2);
    listener2();
  }
  if (trackContentSize && !dimensionCheckProcesses.has(container)) {
    const listener2 = scrollListeners.get(container);
    const size = {
      width: container.scrollWidth,
      height: container.scrollHeight
    };
    scrollSize.set(container, size);
    const checkScrollDimensions = () => {
      const newWidth = container.scrollWidth;
      const newHeight = container.scrollHeight;
      if (size.width !== newWidth || size.height !== newHeight) {
        listener2();
        size.width = newWidth;
        size.height = newHeight;
      }
    };
    const dimensionCheckProcess = frame.read(checkScrollDimensions, true);
    dimensionCheckProcesses.set(container, dimensionCheckProcess);
  }
  const listener = scrollListeners.get(container);
  frame.read(listener, false, true);
  return () => {
    var _a;
    cancelFrame(listener);
    const currentHandlers = onScrollHandlers.get(container);
    if (!currentHandlers)
      return;
    currentHandlers.delete(containerHandler);
    if (currentHandlers.size)
      return;
    const scrollListener = scrollListeners.get(container);
    scrollListeners.delete(container);
    if (scrollListener) {
      getEventTarget(container).removeEventListener("scroll", scrollListener);
      (_a = resizeListeners.get(container)) == null ? void 0 : _a();
      window.removeEventListener("resize", scrollListener);
    }
    const dimensionCheckProcess = dimensionCheckProcesses.get(container);
    if (dimensionCheckProcess) {
      cancelFrame(dimensionCheckProcess);
      dimensionCheckProcesses.delete(container);
    }
    scrollSize.delete(container);
  };
}
const presets = [
  [ScrollOffset.Enter, "entry"],
  [ScrollOffset.Exit, "exit"],
  [ScrollOffset.Any, "cover"],
  [ScrollOffset.All, "contain"]
];
const stringToProgress = {
  start: 0,
  end: 1
};
function parseStringOffset(s) {
  const parts = s.trim().split(/\s+/);
  if (parts.length !== 2)
    return void 0;
  const a = stringToProgress[parts[0]];
  const b = stringToProgress[parts[1]];
  if (a === void 0 || b === void 0)
    return void 0;
  return [a, b];
}
function normaliseOffset(offset) {
  if (offset.length !== 2)
    return void 0;
  const result = [];
  for (const item of offset) {
    if (Array.isArray(item)) {
      result.push(item);
    } else if (typeof item === "string") {
      const parsed = parseStringOffset(item);
      if (!parsed)
        return void 0;
      result.push(parsed);
    } else {
      return void 0;
    }
  }
  return result;
}
function matchesPreset(offset, preset) {
  const normalised = normaliseOffset(offset);
  if (!normalised)
    return false;
  for (let i = 0; i < 2; i++) {
    const o = normalised[i];
    const p = preset[i];
    if (o[0] !== p[0] || o[1] !== p[1])
      return false;
  }
  return true;
}
function offsetToViewTimelineRange(offset) {
  if (!offset) {
    return { rangeStart: "contain 0%", rangeEnd: "contain 100%" };
  }
  for (const [preset, name] of presets) {
    if (matchesPreset(offset, preset)) {
      return { rangeStart: `${name} 0%`, rangeEnd: `${name} 100%` };
    }
  }
  return void 0;
}
const timelineCache = /* @__PURE__ */ new Map();
function scrollTimelineFallback(options) {
  const currentTime = { value: 0 };
  const cancel = scrollInfo((info) => {
    currentTime.value = info[options.axis].progress * 100;
  }, options);
  return { currentTime, cancel };
}
function getTimeline({ source, container, ...options }) {
  const { axis } = options;
  if (source)
    container = source;
  let containerCache = timelineCache.get(container);
  if (!containerCache) {
    containerCache = /* @__PURE__ */ new Map();
    timelineCache.set(container, containerCache);
  }
  const targetKey = options.target ?? "self";
  let targetCache = containerCache.get(targetKey);
  if (!targetCache) {
    targetCache = {};
    containerCache.set(targetKey, targetCache);
  }
  const axisKey = axis + (options.offset ?? []).join(",");
  if (!targetCache[axisKey]) {
    if (options.target && canUseNativeTimeline(options.target)) {
      const range = offsetToViewTimelineRange(options.offset);
      if (range) {
        targetCache[axisKey] = new ViewTimeline({
          subject: options.target,
          axis
        });
      } else {
        targetCache[axisKey] = scrollTimelineFallback({
          container,
          ...options
        });
      }
    } else if (canUseNativeTimeline()) {
      targetCache[axisKey] = new ScrollTimeline({
        source: container,
        axis
      });
    } else {
      targetCache[axisKey] = scrollTimelineFallback({
        container,
        ...options
      });
    }
  }
  return targetCache[axisKey];
}
function attachToAnimation(animation, options) {
  const timeline = getTimeline(options);
  const range = options.target ? offsetToViewTimelineRange(options.offset) : void 0;
  const useNative = options.target ? canUseNativeTimeline(options.target) && !!range : canUseNativeTimeline();
  return animation.attachTimeline({
    timeline: useNative ? timeline : void 0,
    ...range && useNative && {
      rangeStart: range.rangeStart,
      rangeEnd: range.rangeEnd
    },
    observe: (valueAnimation) => {
      valueAnimation.pause();
      return observeTimeline((progress2) => {
        valueAnimation.time = valueAnimation.iterationDuration * progress2;
      }, timeline);
    }
  });
}
function isOnScrollWithInfo(onScroll) {
  return onScroll.length === 2;
}
function attachToFunction(onScroll, options) {
  if (isOnScrollWithInfo(onScroll)) {
    return scrollInfo((info) => {
      onScroll(info[options.axis].progress, info);
    }, options);
  } else {
    return observeTimeline(onScroll, getTimeline(options));
  }
}
function scroll(onScroll, { axis = "y", container = document.scrollingElement, ...options } = {}) {
  if (!container)
    return noop;
  const optionsWithDefaults = { axis, container, ...options };
  return typeof onScroll === "function" ? attachToFunction(onScroll, optionsWithDefaults) : attachToAnimation(onScroll, optionsWithDefaults);
}
const createScrollMotionValues = () => ({
  scrollX: motionValue(0),
  scrollY: motionValue(0),
  scrollXProgress: motionValue(0),
  scrollYProgress: motionValue(0)
});
const isRefPending = (ref) => {
  if (!ref)
    return false;
  return !ref.current;
};
function makeAccelerateConfig(axis, options, container, target) {
  return {
    factory: (animation) => scroll(animation, {
      ...options,
      axis,
      container: (container == null ? void 0 : container.current) || void 0,
      target: (target == null ? void 0 : target.current) || void 0
    }),
    times: [0, 1],
    keyframes: [0, 1],
    ease: (v) => v,
    duration: 1
  };
}
function canAccelerateScroll(target, offset) {
  if (typeof window === "undefined")
    return false;
  return target ? supportsViewTimeline() && !!offsetToViewTimelineRange(offset) : supportsScrollTimeline();
}
function useScroll({ container, target, ...options } = {}) {
  const values = useConstant(createScrollMotionValues);
  if (canAccelerateScroll(target, options.offset)) {
    values.scrollXProgress.accelerate = makeAccelerateConfig("x", options, container, target);
    values.scrollYProgress.accelerate = makeAccelerateConfig("y", options, container, target);
  }
  const scrollAnimation = reactExports.useRef(null);
  const needsStart = reactExports.useRef(false);
  const start = reactExports.useCallback(() => {
    scrollAnimation.current = scroll((_progress, { x, y }) => {
      values.scrollX.set(x.current);
      values.scrollXProgress.set(x.progress);
      values.scrollY.set(y.current);
      values.scrollYProgress.set(y.progress);
    }, {
      ...options,
      container: (container == null ? void 0 : container.current) || void 0,
      target: (target == null ? void 0 : target.current) || void 0
    });
    return () => {
      var _a;
      (_a = scrollAnimation.current) == null ? void 0 : _a.call(scrollAnimation);
    };
  }, [container, target, JSON.stringify(options.offset)]);
  useIsomorphicLayoutEffect(() => {
    needsStart.current = false;
    if (isRefPending(container) || isRefPending(target)) {
      needsStart.current = true;
      return;
    } else {
      return start();
    }
  }, [start]);
  reactExports.useEffect(() => {
    if (needsStart.current) {
      invariant(!isRefPending(container));
      invariant(!isRefPending(target));
      return start();
    } else {
      return;
    }
  }, [start]);
  return values;
}
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = reactExports.useState(initial);
    reactExports.useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
function useComputed(compute) {
  collectMotionValues.current = [];
  compute();
  const value = useCombineMotionValues(collectMotionValues.current, compute);
  collectMotionValues.current = void 0;
  return value;
}
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
  if (typeof input === "function") {
    return useComputed(input);
  }
  const isOutputMap = outputRangeOrMap !== void 0 && !Array.isArray(outputRangeOrMap) && typeof inputRangeOrTransformer !== "function";
  if (isOutputMap) {
    return useMapTransform(input, inputRangeOrTransformer, outputRangeOrMap, options);
  }
  const outputRange = outputRangeOrMap;
  const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : transform(inputRangeOrTransformer, outputRange, options);
  const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
  const inputAccelerate = !Array.isArray(input) ? input.accelerate : void 0;
  if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && (options == null ? void 0 : options.clamp) !== false) {
    result.accelerate = {
      ...inputAccelerate,
      times: inputRangeOrTransformer,
      keyframes: outputRangeOrMap,
      isTransformed: true,
      ...{}
    };
  }
  return result;
}
function useListTransform(values, transformer) {
  const latest = useConstant(() => []);
  return useCombineMotionValues(values, () => {
    latest.length = 0;
    const numValues = values.length;
    for (let i = 0; i < numValues; i++) {
      latest[i] = values[i].get();
    }
    return transformer(latest);
  });
}
function useMapTransform(inputValue, inputRange, outputMap, options) {
  const keys2 = useConstant(() => Object.keys(outputMap));
  const output = useConstant(() => ({}));
  for (const key of keys2) {
    output[key] = useTransform(inputValue, inputRange, outputMap[key], options);
  }
  return output;
}
const EASE_OUT = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_OUT }
  })
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08 }
  })
};
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: `particle-${i}`,
  left: `${8 + i * 6.1 % 86}%`,
  top: `${10 + i * 7.3 % 75}%`,
  color: i % 2 === 0 ? "#0084ff" : "#7c3aed",
  duration: 3 + i % 4,
  delay: i * 0.22
}));
const AVATAR_COLORS = [
  { id: "avatar-blue", color: "#0084ff" },
  { id: "avatar-purple", color: "#7c3aed" },
  { id: "avatar-cyan", color: "#06b6d4" },
  { id: "avatar-green", color: "#10b981" }
];
const HERO_STARS = Array.from({ length: 5 }, (_, i) => ({
  id: `hero-star-${i}`
}));
const TERMINAL_LINES = [
  { id: "tl-0", text: "Analyzing your niche: Tech & Productivity..." },
  { id: "tl-1", text: "Identifying viral patterns in top 1% content..." },
  { id: "tl-2", text: "Generating hook variations with emotional triggers..." },
  { id: "tl-3", text: "" },
  {
    id: "tl-4",
    text: '✦ Hook 1: "I grew from 0 to 50k in 90 days using one system"'
  },
  {
    id: "tl-5",
    text: '✦ Hook 2: "Most creators fail because they skip this step"'
  },
  {
    id: "tl-6",
    text: '✦ Hook 3: "The algorithm rewards creators who do this daily"'
  }
];
const CHART_BARS = [
  { month: "Jan", height: 42, highlight: false, delay: 0 * 0.05 },
  { month: "Feb", height: 65, highlight: false, delay: 1 * 0.05 },
  { month: "Mar", height: 38, highlight: false, delay: 2 * 0.05 },
  { month: "Apr", height: 80, highlight: false, delay: 3 * 0.05 },
  { month: "May", height: 55, highlight: false, delay: 4 * 0.05 },
  { month: "Jun", height: 90, highlight: false, delay: 5 * 0.05 },
  { month: "Jul", height: 72, highlight: false, delay: 6 * 0.05 },
  { month: "Aug", height: 85, highlight: false, delay: 7 * 0.05 },
  { month: "Sep", height: 60, highlight: true, delay: 8 * 0.05 },
  { month: "Oct", height: 95, highlight: true, delay: 9 * 0.05 },
  { month: "Nov", height: 70, highlight: true, delay: 10 * 0.05 },
  { month: "Dec", height: 88, highlight: true, delay: 11 * 0.05 }
];
const REVIEW_STARS = Array.from({ length: 5 }, (_, i) => ({
  id: `review-star-${i}`
}));
function Navbar() {
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [scrolled, setScrolled] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ];
  const handleScroll = (e, href) => {
    var _a;
    if (href.startsWith("#")) {
      e.preventDefault();
      (_a = document.querySelector(href)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.header,
    {
      initial: { y: -80, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.6, ease: EASE_OUT },
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-white/10" : ""}`,
      style: {
        background: scrolled ? "oklch(0.145 0 0 / 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none"
      },
      "data-ocid": "nav.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-lg flex items-center justify-center",
                style: { background: "linear-gradient(135deg, #0084ff, #7c3aed)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-white" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-foreground", children: "CreatorOS" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "nav",
            {
              className: "hidden md:flex items-center gap-8",
              "aria-label": "Main navigation",
              children: navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: link.href,
                  onClick: (e) => handleScroll(e, link.href),
                  className: "text-sm text-muted-foreground hover:text-foreground transition-colors duration-200",
                  children: link.label
                },
                link.label
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", "data-ocid": "nav.login_button", children: "Log in" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "font-medium",
                style: {
                  background: "linear-gradient(135deg, #0084ff, #7c3aed)"
                },
                "data-ocid": "nav.signup_button",
                children: [
                  "Start Free",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-1" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors",
              onClick: () => setMobileOpen(!mobileOpen),
              "aria-label": "Toggle menu",
              "data-ocid": "nav.mobile_menu_toggle",
              type: "button",
              children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.3 },
            className: "md:hidden border-t border-white/10",
            style: {
              background: "oklch(0.145 0 0 / 0.95)",
              backdropFilter: "blur(20px)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 flex flex-col gap-4", children: [
              navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: link.href,
                  onClick: (e) => handleScroll(e, link.href),
                  className: "text-muted-foreground hover:text-foreground transition-colors py-1",
                  children: link.label
                },
                link.label
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 pt-2 border-t border-white/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", onClick: () => setMobileOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    className: "w-full justify-start",
                    "data-ocid": "nav.mobile_login_button",
                    children: "Log in"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", onClick: () => setMobileOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "w-full",
                    style: {
                      background: "linear-gradient(135deg, #0084ff, #7c3aed)"
                    },
                    "data-ocid": "nav.mobile_signup_button",
                    children: "Start Free"
                  }
                ) })
              ] })
            ] })
          }
        ) })
      ]
    }
  );
}
function Hero() {
  const ref = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      ref,
      className: "relative min-h-screen flex flex-col items-center justify-center overflow-hidden",
      style: { background: "#0a0a0a" },
      "data-ocid": "hero.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px] pointer-events-none",
            style: {
              background: "radial-gradient(ellipse, #0084ff22 0%, #7c3aed11 50%, transparent 70%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-[20%] left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none",
            style: { background: "#0084ff0d" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-[30%] right-[5%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none",
            style: { background: "#7c3aed0d" }
          }
        ),
        PARTICLES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute w-1 h-1 rounded-full",
            style: {
              left: p.left,
              top: p.top,
              background: p.color,
              opacity: 0.4
            },
            animate: {
              y: [0, -18, 0],
              opacity: [0.3, 0.7, 0.3]
            },
            transition: {
              duration: p.duration,
              delay: p.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            }
          },
          p.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-16 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              variants: fadeUp,
              initial: "hidden",
              animate: "visible",
              custom: 0,
              className: "inline-flex mb-8",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  className: "px-4 py-1.5 text-sm font-medium border",
                  style: {
                    background: "oklch(0.56 0.22 262 / 0.15)",
                    borderColor: "#0084ff44",
                    color: "#60a5fa"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 mr-1.5" }),
                    "AI-Powered Creator OS"
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.h1,
            {
              variants: fadeUp,
              initial: "hidden",
              animate: "visible",
              custom: 1,
              className: "font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-foreground mb-6",
              children: [
                "Run your creator ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden sm:block" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      background: "linear-gradient(135deg, #0084ff 0%, #7c3aed 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    },
                    children: "business with AI."
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              variants: fadeUp,
              initial: "hidden",
              animate: "visible",
              custom: 2,
              className: "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed",
              children: "Generate viral content, automate workflows, track your productivity, and scale your creator business — all from one intelligent platform."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              variants: fadeUp,
              initial: "hidden",
              animate: "visible",
              custom: 3,
              className: "flex flex-col sm:flex-row items-center justify-center gap-4 mb-16",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "lg",
                    className: "h-12 px-8 text-base font-semibold min-w-[160px]",
                    style: {
                      background: "linear-gradient(135deg, #0084ff, #7c3aed)"
                    },
                    "data-ocid": "hero.start_free_button",
                    children: [
                      "Start Free",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      var _a;
                      return (_a = document.querySelector("#workflow")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                    },
                    className: "inline-flex",
                    "data-ocid": "hero.watch_demo_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "lg",
                        variant: "outline",
                        className: "h-12 px-8 text-base font-medium min-w-[160px] border-white/20 hover:border-white/40",
                        tabIndex: -1,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 mr-2" }),
                          "Watch Demo"
                        ]
                      }
                    )
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              variants: fadeUp,
              initial: "hidden",
              animate: "visible",
              custom: 4,
              className: "flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex -space-x-2", children: AVATAR_COLORS.map((ac) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-7 h-7 rounded-full border-2",
                      style: { background: ac.color, borderColor: "#0a0a0a" }
                    },
                    ac.id
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Join early creators" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-muted-foreground/40 hidden md:block" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  HERO_STARS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Star,
                    {
                      className: "w-3.5 h-3.5 fill-current",
                      style: { color: "#f59e0b" }
                    },
                    s.id
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1", children: "Building fast" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-muted-foreground/40 hidden md:block" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No credit card required" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 60, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { duration: 0.9, delay: 0.5, ease: EASE_OUT },
            className: "relative z-10 w-full max-w-6xl mx-auto px-6",
            style: { y: imgY },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative rounded-2xl overflow-hidden border border-white/10",
                style: {
                  boxShadow: "0 40px 80px -20px #0084ff33, 0 40px 80px -20px #7c3aed22"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute top-0 left-0 right-0 h-px",
                      style: {
                        background: "linear-gradient(90deg, transparent, #0084ff88, #7c3aed88, transparent)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: "/assets/generated/hero-dashboard-preview.dim_1400x900.jpg",
                      alt: "CreatorOS dashboard preview",
                      className: "w-full object-cover",
                      style: { maxHeight: "580px" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute bottom-0 left-0 right-0 h-32",
                      style: {
                        background: "linear-gradient(to top, #0a0a0a, transparent)"
                      }
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
}
const features = [
  {
    icon: Brain,
    title: "AI Studio",
    description: "Generate viral hooks, scripts, captions, and content ideas in seconds. Powered by GPT-4o with real-time streaming output.",
    color: "#0084ff"
  },
  {
    icon: Calendar,
    title: "Content Planner",
    description: "Drag-and-drop content calendar with full pipeline tracking. Move ideas from concept to published with zero friction.",
    color: "#7c3aed"
  },
  {
    icon: Timer,
    title: "Productivity System",
    description: "Deep work timer, habit streaks, daily goals, and focus analytics. Build the consistency that separates top creators.",
    color: "#06b6d4"
  }
];
function Features() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "features",
      className: "py-28 px-6",
      style: { background: "#0a0a0a" },
      "data-ocid": "features.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            className: "text-center mb-16",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "mb-4 px-3 py-1 text-xs",
                  style: {
                    background: "#0084ff18",
                    borderColor: "#0084ff33",
                    color: "#60a5fa"
                  },
                  children: "Core Features"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-4", children: "Everything a creator needs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "One platform to generate, plan, and execute your content strategy — no context switching." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: features.map((feat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            custom: i,
            className: "glass glass-hover rounded-2xl p-8 group cursor-default relative overflow-hidden",
            "data-ocid": `features.card.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  style: { background: `${feat.color}15` }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
                  style: {
                    background: `${feat.color}20`,
                    border: `1px solid ${feat.color}33`
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(feat.icon, { className: "w-6 h-6", style: { color: feat.color } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-3", children: feat.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed", children: feat.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mt-6 flex items-center text-sm font-medium",
                  style: { color: feat.color },
                  children: [
                    "Learn more ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-1.5" })
                  ]
                }
              )
            ]
          },
          feat.title
        )) })
      ] })
    }
  );
}
function AIWorkflow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "workflow",
      className: "py-28 px-6 relative overflow-hidden",
      style: { background: "#0d0d0f" },
      "data-ocid": "workflow.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at 50% 0%, #0084ff08 0%, transparent 60%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              variants: fadeUp,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: "mb-4 px-3 py-1 text-xs",
                    style: {
                      background: "#0084ff18",
                      borderColor: "#0084ff33",
                      color: "#60a5fa"
                    },
                    children: "AI Studio"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-6", children: [
                  "AI that writes like",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      },
                      children: "you think."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-8 leading-relaxed", children: "Feed it your niche, platform, and tone. Get viral hooks, full scripts, carousel frameworks, and captions — streamed in real-time, just like ChatGPT." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: [
                  "Real-time streaming output (word-by-word)",
                  "Structured outputs for every content format",
                  "Generation history & favorites system",
                  "One-click copy, save, and regenerate"
                ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-center gap-3 text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleCheck,
                        {
                          className: "w-4 h-4 shrink-0",
                          style: { color: "#0084ff" }
                        }
                      ),
                      item
                    ]
                  },
                  item
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "inline-block mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    style: {
                      background: "linear-gradient(135deg, #0084ff, #7c3aed)"
                    },
                    "data-ocid": "workflow.cta_button",
                    children: [
                      "Try AI Studio Free",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                    ]
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              variants: fadeUp,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              custom: 1,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl border border-white/10 overflow-hidden",
                  style: {
                    background: "oklch(0.18 0 0)",
                    boxShadow: "0 0 80px -20px #0084ff44"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center justify-between px-5 py-3 border-b border-white/10",
                        style: { background: "oklch(0.16 0 0)" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "w-3 h-3 rounded-full",
                                style: { background: "#ff5f57" }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "w-3 h-3 rounded-full",
                                style: { background: "#ffbd2e" }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "w-3 h-3 rounded-full",
                                style: { background: "#28c840" }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3", style: { color: "#0084ff" } }),
                            "AI Studio — Generating"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              className: "text-xs px-2 py-0.5",
                              style: {
                                background: "#0084ff20",
                                color: "#60a5fa",
                                borderColor: "transparent"
                              },
                              children: "Streaming"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-white/10", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-2", children: "Prompt" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "rounded-lg px-4 py-3 text-sm text-muted-foreground font-mono",
                          style: {
                            background: "oklch(0.14 0 0)",
                            border: "1px solid oklch(0.28 0 0)"
                          },
                          children: "Generate 3 viral hook ideas for a productivity creator on YouTube with 10k subscribers"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 min-h-[200px]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-3", children: "Response" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 font-mono text-sm", children: [
                        TERMINAL_LINES.map((tl, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.div,
                          {
                            variants: fadeIn,
                            initial: "hidden",
                            whileInView: "visible",
                            viewport: { once: true },
                            custom: i,
                            className: tl.text === "" ? "h-2" : "",
                            style: {
                              color: tl.text.startsWith("✦") ? "#93c5fd" : void 0
                            },
                            children: tl.text
                          },
                          tl.id
                        )),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.span,
                          {
                            className: "inline-block w-2 h-4 align-middle",
                            style: { background: "#0084ff" },
                            animate: { opacity: [1, 0, 1] },
                            transition: {
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY
                            }
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "flex items-center gap-2 px-5 py-3 border-t border-white/10",
                        style: { background: "oklch(0.16 0 0)" },
                        children: ["Copy", "Save", "Regenerate"].map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "px-3 py-1 rounded-md text-xs text-muted-foreground border border-white/10 hover:border-white/20 cursor-pointer transition-colors",
                            children: action
                          },
                          action
                        ))
                      }
                    )
                  ]
                }
              )
            }
          )
        ] }) })
      ]
    }
  );
}
function ProductivityShowcase() {
  const habits = [
    { name: "Daily script writing", streak: 21, color: "#0084ff" },
    { name: "Morning deep work", streak: 14, color: "#7c3aed" },
    { name: "Content planning", streak: 8, color: "#06b6d4" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "py-28 px-6",
      style: { background: "#0a0a0a" },
      "data-ocid": "productivity.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            className: "space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl p-6 border border-white/10",
                  style: { background: "oklch(0.18 0 0)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-8 h-8 rounded-lg flex items-center justify-center",
                            style: { background: "#0084ff20" },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-4 h-4", style: { color: "#0084ff" } })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground", children: "Deep Work Session" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "25:00 focus block" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: "text-xs",
                          style: {
                            background: "#10b98120",
                            color: "#34d399",
                            borderColor: "transparent"
                          },
                          children: "Active"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-32 h-32", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "svg",
                        {
                          className: "w-32 h-32 -rotate-90",
                          viewBox: "0 0 120 120",
                          role: "img",
                          "aria-label": "Pomodoro timer progress",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "circle",
                              {
                                cx: "60",
                                cy: "60",
                                r: "54",
                                fill: "none",
                                stroke: "oklch(0.28 0 0)",
                                strokeWidth: "6"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              motion.circle,
                              {
                                cx: "60",
                                cy: "60",
                                r: "54",
                                fill: "none",
                                stroke: "#0084ff",
                                strokeWidth: "6",
                                strokeLinecap: "round",
                                strokeDasharray: "339.3",
                                strokeDashoffset: "84.8",
                                initial: { strokeDashoffset: 339.3 },
                                whileInView: { strokeDashoffset: 84.8 },
                                viewport: { once: true },
                                transition: {
                                  duration: 1.5,
                                  delay: 0.3,
                                  ease: "easeOut"
                                }
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-foreground", children: "18:42" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "remaining" })
                      ] })
                    ] }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl p-6 border border-white/10",
                  style: { background: "oklch(0.18 0 0)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4", style: { color: "#f59e0b" } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Active Streaks" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: habits.map((habit, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        variants: fadeIn,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: { once: true },
                        custom: i,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: habit.name }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "text-xs font-semibold",
                                style: { color: habit.color },
                                children: [
                                  habit.streak,
                                  " day streak \\uD83D\\uDD25"
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "w-full h-1.5 rounded-full",
                              style: { background: "oklch(0.22 0 0)" },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                motion.div,
                                {
                                  className: "h-full rounded-full",
                                  style: { background: habit.color },
                                  initial: { width: 0 },
                                  whileInView: { width: `${habit.streak / 30 * 100}%` },
                                  viewport: { once: true },
                                  transition: {
                                    duration: 1,
                                    delay: 0.2 + i * 0.15,
                                    ease: "easeOut"
                                  }
                                }
                              )
                            }
                          )
                        ]
                      },
                      habit.name
                    )) })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            custom: 1,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "mb-4 px-3 py-1 text-xs",
                  style: {
                    background: "#7c3aed18",
                    borderColor: "#7c3aed33",
                    color: "#a78bfa"
                  },
                  children: "Productivity System"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-6", children: [
                "Build habits that",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    },
                    children: "compound."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-8 leading-relaxed", children: "A real Pomodoro timer, streak systems, and daily goal tracking built for creators who want consistent output — not just motivation." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: [
                "Wall-clock Pomodoro with session history",
                "Habit streaks with visual progress tracking",
                "Daily productivity score from actual activity",
                "Weekly focus hour trends and analytics"
              ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex items-center gap-3 text-muted-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheck,
                      {
                        className: "w-4 h-4 shrink-0",
                        style: { color: "#7c3aed" }
                      }
                    ),
                    item
                  ]
                },
                item
              )) })
            ]
          }
        )
      ] }) })
    }
  );
}
function AnalyticsPreview() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "py-28 px-6 relative overflow-hidden",
      style: { background: "#0d0d0f" },
      "data-ocid": "analytics.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at 80% 50%, #7c3aed08 0%, transparent 60%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              variants: fadeUp,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              className: "text-center mb-16",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: "mb-4 px-3 py-1 text-xs",
                    style: {
                      background: "#7c3aed18",
                      borderColor: "#7c3aed33",
                      color: "#a78bfa"
                    },
                    children: "Analytics"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-4", children: "Track what actually matters" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "Real analytics from your actual creator activity — no vanity metrics, no fake numbers." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              variants: fadeUp,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              custom: 1,
              className: "rounded-2xl border border-white/10 overflow-hidden",
              style: { background: "oklch(0.18 0 0)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "px-6 py-4 border-b border-white/10 flex items-center justify-between",
                    style: { background: "oklch(0.16 0 0)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: "Content Velocity" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "Pieces produced per month" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: "text-xs px-3 py-1",
                          style: {
                            background: "#f59e0b18",
                            color: "#fbbf24",
                            borderColor: "#f59e0b33"
                          },
                          children: "\\u26a0 Example data — yours will appear after activity"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4 mb-8", children: [
                    {
                      label: "Avg. monthly output",
                      value: "—",
                      sub: "No data yet"
                    },
                    { label: "Top month", value: "—", sub: "No data yet" },
                    { label: "Consistency score", value: "—", sub: "No data yet" }
                  ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-display font-bold text-muted-foreground", children: stat.value }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: stat.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-0.5", style: { color: "#f59e0b" }, children: stat.sub })
                  ] }, stat.label)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-2 h-40", children: CHART_BARS.map((bar) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex-1 flex flex-col items-center gap-1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.div,
                          {
                            className: "w-full rounded-t-sm",
                            style: {
                              background: bar.highlight ? "linear-gradient(to top, #0084ff, #7c3aed)" : "oklch(0.28 0 0)",
                              opacity: bar.highlight ? 0.4 : 0.3
                            },
                            initial: { height: 0 },
                            whileInView: { height: `${bar.height}%` },
                            viewport: { once: true },
                            transition: {
                              duration: 0.8,
                              delay: bar.delay,
                              ease: "easeOut"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-xs text-muted-foreground",
                            style: { opacity: 0.4 },
                            children: bar.month
                          }
                        )
                      ]
                    },
                    bar.month
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "mt-4 text-center text-xs text-muted-foreground",
                      style: { opacity: 0.5 },
                      children: "Chart shows example structure — real data populates as you use CreatorOS"
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Get started and explore the platform.",
    color: "#888",
    features: [
      "20 AI generations/month",
      "Basic content calendar",
      "3 habit trackers",
      "Dashboard overview",
      "Community access"
    ],
    cta: "Start Free",
    highlighted: false
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For creators who are serious about growth.",
    color: "#0084ff",
    features: [
      "Unlimited AI generations",
      "Advanced content planner",
      "Full analytics dashboard",
      "Unlimited habit tracking",
      "Full template vault",
      "Priority support"
    ],
    cta: "Start Pro Trial",
    highlighted: true
  },
  {
    name: "Elite",
    price: "$49",
    period: "/mo",
    description: "For power users scaling a creator business.",
    color: "#7c3aed",
    features: [
      "Everything in Pro",
      "Workflow automation engine",
      "Advanced AI analytics",
      "Team workspaces (coming soon)",
      "White-label exports",
      "Dedicated success manager"
    ],
    cta: "Go Elite",
    highlighted: false
  }
];
function Pricing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "pricing",
      className: "py-28 px-6",
      style: { background: "#0a0a0a" },
      "data-ocid": "pricing.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            className: "text-center mb-16",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "mb-4 px-3 py-1 text-xs",
                  style: {
                    background: "#0084ff18",
                    borderColor: "#0084ff33",
                    color: "#60a5fa"
                  },
                  children: "Pricing"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-4", children: "Simple, honest pricing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto", children: "Start free forever. Upgrade when you're ready to scale." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: plans.map((plan, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            custom: i,
            className: "relative rounded-2xl p-8 border transition-all duration-300 hover:scale-[1.02]",
            style: {
              background: plan.highlighted ? "oklch(0.18 0 0)" : "oklch(0.16 0 0)",
              borderColor: plan.highlighted ? "#0084ff50" : "oklch(0.28 0 0)",
              boxShadow: plan.highlighted ? "0 0 60px -20px #0084ff55" : "none"
            },
            "data-ocid": `pricing.plan.${i + 1}`,
            children: [
              plan.highlighted && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute -top-px left-0 right-0 h-px rounded-t-2xl",
                  style: {
                    background: "linear-gradient(90deg, transparent, #0084ff, transparent)"
                  }
                }
              ),
              plan.highlighted && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs",
                  style: {
                    background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                    color: "white",
                    border: "none"
                  },
                  children: "Most Popular"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "inline-block text-xs font-semibold px-2 py-1 rounded-md mb-3",
                    style: { background: `${plan.color}20`, color: plan.color },
                    children: plan.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl font-bold text-foreground", children: plan.price }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: plan.period })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: plan.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 mb-8", children: plan.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex items-center gap-2.5 text-sm text-muted-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheck,
                      {
                        className: "w-4 h-4 shrink-0",
                        style: { color: plan.color }
                      }
                    ),
                    f
                  ]
                },
                f
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full",
                  variant: plan.highlighted ? "default" : "outline",
                  style: plan.highlighted ? {
                    background: "linear-gradient(135deg, #0084ff, #7c3aed)"
                  } : { borderColor: "oklch(0.3 0 0)" },
                  "data-ocid": `pricing.cta_button.${i + 1}`,
                  children: plan.cta
                }
              ) })
            ]
          },
          plan.name
        )) })
      ] })
    }
  );
}
const testimonials = [
  {
    name: "Maya Chen",
    role: "YouTube Creator · 180k subs",
    quote: "CreatorOS completely changed how I plan content. The AI hooks generator alone saved me 3 hours every week.",
    avatar: "M",
    color: "#0084ff"
  },
  {
    name: "Jordan Blake",
    role: "Newsletter Writer · 45k subscribers",
    quote: "The productivity system with streak tracking is genuinely addictive. I've been consistent for 31 days straight.",
    avatar: "J",
    color: "#7c3aed"
  },
  {
    name: "Priya Sharma",
    role: "TikTok & IG Creator · 500k",
    quote: "Finally a tool that understands creators. The content calendar with status tracking eliminated my posting anxiety.",
    avatar: "P",
    color: "#06b6d4"
  },
  {
    name: "Marcus Lee",
    role: "Podcast Host & Course Creator",
    quote: "The AI Studio is legitimately the best content brainstorming tool I've used. The streaming output feels like magic.",
    avatar: "M",
    color: "#10b981"
  }
];
function Testimonials() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "py-28 px-6",
      style: { background: "#0d0d0f" },
      "data-ocid": "testimonials.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            className: "text-center mb-16",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "mb-4 px-3 py-1 text-xs",
                  style: {
                    background: "#0084ff18",
                    borderColor: "#0084ff33",
                    color: "#60a5fa"
                  },
                  children: "Creators love it"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-4", children: "Built for real creators" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto", children: "Join thousands of creators who run their business on CreatorOS." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: testimonials.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            custom: i,
            className: "glass glass-hover rounded-2xl p-6",
            "data-ocid": `testimonials.card.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5 mb-4", children: REVIEW_STARS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Star,
                {
                  className: "w-3.5 h-3.5 fill-current",
                  style: { color: "#f59e0b" }
                },
                s.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: [
                '"',
                t.quote,
                '"'
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white",
                    style: { background: t.color },
                    children: t.avatar
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: t.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.role })
                ] })
              ] })
            ]
          },
          t.name
        )) })
      ] })
    }
  );
}
const faqs = [
  {
    q: "Is the AI actually powered by GPT-4o?",
    a: "Yes. CreatorOS uses OpenAI's GPT-4o model for all content generation, streamed in real-time so you see output as it's generated — just like ChatGPT."
  },
  {
    q: "What makes the analytics different from social media insights?",
    a: "We track your internal creator activity — content produced, focus sessions completed, habits maintained, and workflow progress. This is about your input consistency, not vanity metrics."
  },
  {
    q: "Is there a free plan forever?",
    a: "Yes. The Free plan gives you 20 AI generations/month and access to core features indefinitely. No credit card required to start."
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. You can cancel, downgrade, or modify your subscription at any time from the billing portal. No lock-in, no penalties."
  },
  {
    q: "What is the Content Planner?",
    a: "A full drag-and-drop content calendar where you can create content items, assign statuses (Idea → Scripting → Editing → Scheduled → Posted), attach notes, and track your pipeline."
  },
  {
    q: "When are Team Workspaces available?",
    a: "Team Workspaces are on the Elite roadmap and coming in the next major update. Elite subscribers will get early access."
  }
];
function FAQ() {
  const [openIndex, setOpenIndex] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "faq",
      className: "py-28 px-6",
      style: { background: "#0a0a0a" },
      "data-ocid": "faq.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            className: "text-center mb-16",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "mb-4 px-3 py-1 text-xs",
                  style: {
                    background: "#0084ff18",
                    borderColor: "#0084ff33",
                    color: "#60a5fa"
                  },
                  children: "FAQ"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-4", children: "Common questions" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: faqs.map((faq, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            custom: i * 0.5,
            className: "rounded-xl border border-white/10 overflow-hidden",
            style: { background: "oklch(0.16 0 0)" },
            "data-ocid": `faq.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors",
                  onClick: () => setOpenIndex(openIndex === i ? null : i),
                  "data-ocid": `faq.toggle.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground pr-4", children: faq.q }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronDown,
                      {
                        className: "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        style: {
                          transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: openIndex === i && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { height: 0, opacity: 0 },
                  animate: { height: "auto", opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                  transition: { duration: 0.25, ease: "easeInOut" },
                  className: "overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-white/10 pt-4", children: faq.a })
                }
              ) })
            ]
          },
          faq.q
        )) })
      ] })
    }
  );
}
function FinalCTA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "py-28 px-6 relative overflow-hidden",
      style: { background: "#0d0d0f" },
      "data-ocid": "cta.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at 50% 50%, #0084ff10 0%, #7c3aed08 40%, transparent 70%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto text-center relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: fadeUp,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8",
                  style: { background: "linear-gradient(135deg, #0084ff, #7c3aed)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-7 h-7 text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6", children: [
                "Start building your",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    },
                    children: "creator OS"
                  }
                ),
                " ",
                "today."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-10", children: "Free forever. No credit card required. Upgrade when you're ready." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "lg",
                    className: "h-12 px-10 text-base font-semibold",
                    style: {
                      background: "linear-gradient(135deg, #0084ff, #7c3aed)"
                    },
                    "data-ocid": "cta.start_free_button",
                    children: [
                      "Start Free Today",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "lg",
                    variant: "outline",
                    className: "h-12 px-10 text-base font-medium border-white/20 hover:border-white/40",
                    "data-ocid": "cta.signin_button",
                    children: "Sign in"
                  }
                ) })
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
function Footer() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const footerLinks = [
    {
      group: "Product",
      links: ["Features", "Pricing", "Changelog", "Roadmap"]
    },
    {
      group: "Resources",
      links: ["Documentation", "Blog", "Templates", "Community"]
    },
    { group: "Company", links: ["About", "Careers", "Privacy", "Terms"] }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "footer",
    {
      className: "border-t border-white/10 px-6 pt-16 pb-8",
      style: { background: "#0a0a0a" },
      "data-ocid": "footer.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-10 mb-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 md:col-span-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-8 h-8 rounded-lg flex items-center justify-center",
                  style: {
                    background: "linear-gradient(135deg, #0084ff, #7c3aed)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-foreground", children: "CreatorOS" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-xs", children: "The AI-powered operating system for modern content creators." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-2 h-2 rounded-full",
                  style: { background: "#10b981" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "All systems operational" })
            ] })
          ] }),
          footerLinks.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-foreground uppercase tracking-widest mb-4", children: col.group }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: col.links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0",
                children: link
              }
            ) }, link)) })
          ] }, col.group))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "\\u00a9 ",
            year,
            " CreatorOS. Built with love using",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
                target: "_blank",
                rel: "noreferrer",
                className: "hover:text-foreground transition-colors",
                style: { color: "#60a5fa" },
                children: "caffeine.ai"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: ["Twitter", "LinkedIn", "GitHub"].map((social) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0",
              children: social
            },
            social
          )) })
        ] })
      ] })
    }
  );
}
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", style: { background: "#0a0a0a" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Features, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AIWorkflow, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductivityShowcase, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsPreview, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Pricing, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Testimonials, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FAQ, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalCTA, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  Landing as default
};
