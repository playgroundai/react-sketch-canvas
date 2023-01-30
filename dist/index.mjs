var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __pow = Math.pow;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/Canvas/index.tsx
import * as React2 from "react";
import { useCallback } from "react";

// src/Paths/index.tsx
import * as React from "react";
var line = (pointA, pointB) => {
  const lengthX = pointB.x - pointA.x;
  const lengthY = pointB.y - pointA.y;
  return {
    length: Math.sqrt(__pow(lengthX, 2) + __pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
};
var controlPoint = (controlPoints) => {
  const { current, next, previous, reverse } = controlPoints;
  const p = previous || current;
  const n = next || current;
  const smoothing = 0.2;
  const o = line(p, n);
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;
  const x = current.x + Math.cos(angle) * length;
  const y = current.y + Math.sin(angle) * length;
  return [x, y];
};
var bezierCommand = (point, i, a) => {
  let cpsX;
  let cpsY;
  switch (i) {
    case 0:
      [cpsX, cpsY] = controlPoint({
        current: point
      });
      break;
    case 1:
      [cpsX, cpsY] = controlPoint({
        current: a[i - 1],
        next: point
      });
      break;
    default:
      [cpsX, cpsY] = controlPoint({
        current: a[i - 1],
        previous: a[i - 2],
        next: point
      });
      break;
  }
  const [cpeX, cpeY] = controlPoint({
    current: point,
    previous: a[i - 1],
    next: a[i + 1],
    reverse: true
  });
  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x}, ${point.y}`;
};
function SvgPath({
  paths,
  id,
  strokeWidth,
  strokeColor,
  command = bezierCommand
}) {
  if (paths.length === 1) {
    const { x, y } = paths[0];
    const radius = strokeWidth / 2;
    return /* @__PURE__ */ React.createElement(
      "circle",
      {
        key: id,
        id,
        cx: x,
        cy: y,
        r: radius,
        stroke: strokeColor,
        fill: strokeColor
      }
    );
  }
  const d = paths.reduce(
    (acc, point, i, a) => i === 0 ? `M ${point.x},${point.y}` : `${acc} ${command(point, i, a)}`,
    ""
  );
  return /* @__PURE__ */ React.createElement(
    "path",
    {
      key: id,
      id,
      d,
      fill: "none",
      strokeLinecap: "round",
      stroke: strokeColor,
      strokeWidth
    }
  );
}
function Paths({ id, paths }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, paths.map((path, index) => /* @__PURE__ */ React.createElement(
    SvgPath,
    {
      key: `${id}__${index}`,
      paths: path.paths,
      id: `${id}__${index}`,
      strokeWidth: path.strokeWidth,
      strokeColor: path.strokeColor,
      command: bezierCommand
    }
  )));
}
var Paths_default = Paths;

// src/Canvas/index.tsx
var loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.addEventListener("load", () => {
    if (img.width > 0) {
      resolve(img);
    }
    reject(new Error("Image not found"));
  });
  img.addEventListener("error", (err) => reject(err));
  img.src = url;
  img.setAttribute("crossorigin", "anonymous");
});
function getCanvasWithViewBox(canvas) {
  var _a;
  const svgCanvas = (_a = canvas.firstChild) == null ? void 0 : _a.cloneNode(true);
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  svgCanvas.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svgCanvas.setAttribute("width", width.toString());
  svgCanvas.setAttribute("height", height.toString());
  return { svgCanvas, width, height };
}
var Canvas = React2.forwardRef((props, ref) => {
  const {
    paths,
    isDrawing,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    id = "react-sketch-canvas",
    width = "100%",
    height = "100%",
    className = "react-sketch-canvas",
    canvasColor = "red",
    backgroundImage = "",
    exportWithBackgroundImage = false,
    preserveBackgroundImageAspectRatio = "none",
    allowOnlyPointerType = "all",
    style = {
      border: "0.0625rem solid #9c9c9c",
      borderRadius: "0.25rem"
    },
    svgStyle = {}
  } = props;
  const canvasRef = React2.useRef(null);
  const getCoordinates = useCallback(
    (pointerEvent) => {
      var _a, _b, _c;
      const boundingArea = (_a = canvasRef.current) == null ? void 0 : _a.getBoundingClientRect();
      const scrollLeft = (_b = window.scrollX) != null ? _b : 0;
      const scrollTop = (_c = window.scrollY) != null ? _c : 0;
      if (!boundingArea) {
        return { x: 0, y: 0 };
      }
      return {
        x: pointerEvent.pageX - boundingArea.left - scrollLeft,
        y: pointerEvent.pageY - boundingArea.top - scrollTop
      };
    },
    []
  );
  const handlePointerDown = useCallback(
    (event) => {
      if (allowOnlyPointerType !== "all" && event.pointerType !== allowOnlyPointerType) {
        return;
      }
      if (event.pointerType === "mouse" && event.button !== 0)
        return;
      const isEraser = event.pointerType === "pen" && (event.buttons & 32) === 32;
      const point = getCoordinates(event);
      onPointerDown(point, isEraser);
    },
    [allowOnlyPointerType, getCoordinates, onPointerDown]
  );
  const handlePointerMove = useCallback(
    (event) => {
      if (!isDrawing)
        return;
      if (allowOnlyPointerType !== "all" && event.pointerType !== allowOnlyPointerType) {
        return;
      }
      const point = getCoordinates(event);
      onPointerMove(point);
    },
    [allowOnlyPointerType, getCoordinates, isDrawing, onPointerMove]
  );
  const handlePointerUp = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0)
        return;
      if (allowOnlyPointerType !== "all" && event.pointerType !== allowOnlyPointerType) {
        return;
      }
      onPointerUp();
    },
    [allowOnlyPointerType, onPointerUp]
  );
  React2.useImperativeHandle(ref, () => ({
    exportImage: (imageType) => {
      return new Promise((resolve, reject) => {
        try {
          const canvas = canvasRef.current;
          if (!canvas) {
            throw Error("Canvas not rendered yet");
          }
          const {
            svgCanvas,
            width: svgWidth,
            height: svgHeight
          } = getCanvasWithViewBox(canvas);
          const canvasSketch = `data:image/svg+xml;base64,${btoa(
            svgCanvas.outerHTML
          )}`;
          const loadImagePromises = [loadImage(canvasSketch)];
          if (exportWithBackgroundImage && backgroundImage) {
            try {
              const img = loadImage(backgroundImage);
              loadImagePromises.push(img);
            } catch (error) {
              console.warn(
                "exportWithBackgroundImage props is set without a valid background image URL. This option is ignored"
              );
            }
          }
          Promise.all(loadImagePromises).then((images) => {
            const renderCanvas = document.createElement("canvas");
            renderCanvas.setAttribute("width", svgWidth.toString());
            renderCanvas.setAttribute("height", svgHeight.toString());
            const context = renderCanvas.getContext("2d");
            if (!context) {
              throw Error("Canvas not rendered yet");
            }
            if (imageType === "jpeg" && !exportWithBackgroundImage) {
              context.fillStyle = canvasColor;
              context.fillRect(0, 0, svgWidth, svgHeight);
            }
            images.reverse().forEach((image) => {
              context.drawImage(image, 0, 0);
            });
            resolve(renderCanvas.toDataURL(`image/${imageType}`));
          }).catch((e) => {
            reject(e);
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    exportSvg: () => {
      return new Promise((resolve, reject) => {
        var _a, _b, _c;
        try {
          const canvas = (_a = canvasRef.current) != null ? _a : null;
          if (canvas !== null) {
            const { svgCanvas } = getCanvasWithViewBox(canvas);
            if (exportWithBackgroundImage) {
              resolve(svgCanvas.outerHTML);
              return;
            }
            (_b = svgCanvas.querySelector(`#${id}__background`)) == null ? void 0 : _b.remove();
            (_c = svgCanvas.querySelector(`#${id}__canvas-background`)) == null ? void 0 : _c.setAttribute("fill", canvasColor);
            resolve(svgCanvas.outerHTML);
          }
          reject(new Error("Canvas not loaded"));
        } catch (e) {
          reject(e);
        }
      });
    }
  }));
  React2.useEffect(() => {
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);
  const eraserPaths = React2.useMemo(
    () => paths.filter((path) => !path.drawMode),
    [paths]
  );
  const pathGroups = React2.useMemo(() => {
    let currentGroup = 0;
    return paths.reduce(
      (arrayGroup, path) => {
        if (!path.drawMode) {
          currentGroup += 1;
          return arrayGroup;
        }
        if (arrayGroup[currentGroup] === void 0) {
          arrayGroup[currentGroup] = [];
        }
        arrayGroup[currentGroup].push(path);
        return arrayGroup;
      },
      [[]]
    );
  }, [paths]);
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      role: "presentation",
      ref: canvasRef,
      className,
      style: __spreadValues({
        touchAction: "none",
        width,
        height
      }, style),
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp
    },
    /* @__PURE__ */ React2.createElement(
      "svg",
      {
        version: "1.1",
        baseProfile: "full",
        xmlns: "http://www.w3.org/2000/svg",
        xmlnsXlink: "http://www.w3.org/1999/xlink",
        style: __spreadValues({
          width: "100%",
          height: "100%"
        }, svgStyle),
        id
      },
      /* @__PURE__ */ React2.createElement("g", { id: `${id}__eraser-stroke-group`, display: "none" }, /* @__PURE__ */ React2.createElement(
        "rect",
        {
          id: `${id}__mask-background`,
          x: "0",
          y: "0",
          width: "100%",
          height: "100%",
          fill: "white"
        }
      ), eraserPaths.map((eraserPath, i) => /* @__PURE__ */ React2.createElement(
        SvgPath,
        {
          key: `${id}__eraser-${i}`,
          id: `${id}__eraser-${i}`,
          paths: eraserPath.paths,
          strokeColor: "#000000",
          strokeWidth: eraserPath.strokeWidth
        }
      ))),
      /* @__PURE__ */ React2.createElement("defs", null, backgroundImage && /* @__PURE__ */ React2.createElement(
        "pattern",
        {
          id: `${id}__background`,
          x: "0",
          y: "0",
          width: "100%",
          height: "100%",
          patternUnits: "userSpaceOnUse"
        },
        /* @__PURE__ */ React2.createElement(
          "image",
          {
            x: "0",
            y: "0",
            width: "100%",
            height: "100%",
            xlinkHref: backgroundImage,
            preserveAspectRatio: preserveBackgroundImageAspectRatio
          }
        )
      ), eraserPaths.map((_, i) => /* @__PURE__ */ React2.createElement(
        "mask",
        {
          id: `${id}__eraser-mask-${i}`,
          key: `${id}__eraser-mask-${i}`,
          maskUnits: "userSpaceOnUse"
        },
        /* @__PURE__ */ React2.createElement("use", { href: `#${id}__mask-background` }),
        Array.from(
          { length: eraserPaths.length - i },
          (_i, j) => j + i
        ).map((k) => /* @__PURE__ */ React2.createElement(
          "use",
          {
            key: k.toString(),
            href: `#${id}__eraser-${k.toString()}`
          }
        ))
      ))),
      /* @__PURE__ */ React2.createElement("g", { id: `${id}__canvas-background-group` }, /* @__PURE__ */ React2.createElement(
        "rect",
        {
          id: `${id}__canvas-background`,
          x: "0",
          y: "0",
          width: "100%",
          height: "100%",
          fill: backgroundImage ? `url(#${id}__background)` : canvasColor
        }
      )),
      pathGroups.map((pathGroup, i) => /* @__PURE__ */ React2.createElement(
        "g",
        {
          id: `${id}__stroke-group-${i}`,
          key: `${id}__stroke-group-${i}`,
          mask: `${eraserPaths[i] && `url(#${id}__eraser-mask-${i})`}`
        },
        /* @__PURE__ */ React2.createElement(Paths_default, { id: `${id}__stroke-group-${i}__paths`, paths: pathGroup })
      ))
    )
  );
});

// src/ReactSketchCanvas/index.tsx
import * as React3 from "react";
var ReactSketchCanvas = React3.forwardRef((props, ref) => {
  const {
    id = "react-sketch-canvas",
    width = "100%",
    height = "100%",
    className = "",
    canvasColor = "white",
    strokeColor = "red",
    backgroundImage = "",
    exportWithBackgroundImage = false,
    preserveBackgroundImageAspectRatio = "none",
    strokeWidth = 4,
    eraserWidth = 8,
    allowOnlyPointerType = "all",
    style = {
      border: "0.0625rem solid lightgray",
      borderRadius: "0.25rem"
    },
    svgStyle = {},
    onChange = (_paths) => void 0,
    onStroke = (_path, _isEraser) => void 0,
    withTimestamp = false
  } = props;
  const svgCanvas = React3.createRef();
  const [drawMode, setDrawMode] = React3.useState(true);
  const [isDrawing, setIsDrawing] = React3.useState(false);
  const [resetStack, setResetStack] = React3.useState([]);
  const [undoStack, setUndoStack] = React3.useState([]);
  const [currentPaths, setCurrentPaths] = React3.useState([]);
  const liftStrokeUp = React3.useCallback(() => {
    var _a, _b;
    const lastStroke = (_b = (_a = currentPaths.slice(-1)) == null ? void 0 : _a[0]) != null ? _b : null;
    if (lastStroke === null) {
      return;
    }
    onStroke(lastStroke, !lastStroke.drawMode);
  }, [isDrawing]);
  React3.useEffect(() => {
    liftStrokeUp();
  }, [isDrawing]);
  React3.useEffect(() => {
    onChange(currentPaths);
  }, [currentPaths]);
  React3.useImperativeHandle(ref, () => ({
    eraseMode: (erase) => {
      setDrawMode(!erase);
    },
    clearCanvas: () => {
      setResetStack([...currentPaths]);
      setCurrentPaths([]);
    },
    undo: () => {
      if (resetStack.length !== 0) {
        setCurrentPaths([...resetStack]);
        setResetStack([]);
        return;
      }
      setUndoStack((paths) => [...paths, ...currentPaths.slice(-1)]);
      setCurrentPaths((paths) => paths.slice(0, -1));
    },
    redo: () => {
      if (undoStack.length === 0)
        return;
      setCurrentPaths((paths) => [...paths, ...undoStack.slice(-1)]);
      setUndoStack((paths) => paths.slice(0, -1));
    },
    exportImage: (imageType) => {
      var _a;
      const exportImage = (_a = svgCanvas.current) == null ? void 0 : _a.exportImage;
      if (!exportImage) {
        throw Error("Export function called before canvas loaded");
      } else {
        return exportImage(imageType);
      }
    },
    exportSvg: () => {
      return new Promise((resolve, reject) => {
        var _a;
        const exportSvg = (_a = svgCanvas.current) == null ? void 0 : _a.exportSvg;
        if (!exportSvg) {
          reject(Error("Export function called before canvas loaded"));
        } else {
          exportSvg().then((data) => {
            resolve(data);
          }).catch((e) => {
            reject(e);
          });
        }
      });
    },
    exportPaths: () => {
      return new Promise((resolve, reject) => {
        try {
          resolve(currentPaths);
        } catch (e) {
          reject(e);
        }
      });
    },
    loadPaths: (paths) => {
      setCurrentPaths((path) => [...path, ...paths]);
    },
    getSketchingTime: () => {
      return new Promise((resolve, reject) => {
        if (!withTimestamp) {
          reject(new Error("Set 'withTimestamp' prop to get sketching time"));
        }
        try {
          const sketchingTime = currentPaths.reduce(
            (totalSketchingTime, path) => {
              var _a, _b;
              const startTimestamp = (_a = path.startTimestamp) != null ? _a : 0;
              const endTimestamp = (_b = path.endTimestamp) != null ? _b : 0;
              return totalSketchingTime + (endTimestamp - startTimestamp);
            },
            0
          );
          resolve(sketchingTime);
        } catch (e) {
          reject(e);
        }
      });
    },
    resetCanvas: () => {
      setResetStack([]);
      setUndoStack([]);
      setCurrentPaths([]);
    }
  }));
  const handlePointerDown = (point, isEraser = false) => {
    setIsDrawing(true);
    setUndoStack([]);
    const isDraw = !isEraser && drawMode;
    let stroke = {
      drawMode: isDraw,
      strokeColor: isDraw ? strokeColor : "#000000",
      strokeWidth: isDraw ? strokeWidth : eraserWidth,
      paths: [point]
    };
    if (withTimestamp) {
      stroke = __spreadProps(__spreadValues({}, stroke), {
        startTimestamp: Date.now(),
        endTimestamp: 0
      });
    }
    setCurrentPaths((paths) => [...paths, stroke]);
  };
  const handlePointerMove = (point) => {
    if (!isDrawing)
      return;
    const currentStroke = currentPaths.slice(-1)[0];
    const updatedStroke = __spreadProps(__spreadValues({}, currentStroke), {
      paths: [...currentStroke.paths, point]
    });
    setCurrentPaths((paths) => [...paths.slice(0, -1), updatedStroke]);
  };
  const handlePointerUp = () => {
    var _a, _b;
    if (!isDrawing) {
      return;
    }
    setIsDrawing(false);
    if (!withTimestamp) {
      return;
    }
    const currentStroke = (_b = (_a = currentPaths.slice(-1)) == null ? void 0 : _a[0]) != null ? _b : null;
    if (currentStroke === null) {
      return;
    }
    const updatedStroke = __spreadProps(__spreadValues({}, currentStroke), {
      endTimestamp: Date.now()
    });
    setCurrentPaths((paths) => [...paths.slice(0, -1), updatedStroke]);
  };
  return /* @__PURE__ */ React3.createElement(
    Canvas,
    {
      ref: svgCanvas,
      id,
      width,
      height,
      className,
      canvasColor,
      backgroundImage,
      exportWithBackgroundImage,
      preserveBackgroundImageAspectRatio,
      allowOnlyPointerType,
      style,
      svgStyle,
      paths: currentPaths,
      isDrawing,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp
    }
  );
});
export {
  Canvas,
  ReactSketchCanvas
};
//# sourceMappingURL=index.mjs.map