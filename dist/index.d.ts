import * as React from 'react';

type ExportImageType = "jpeg" | "png";
interface Point {
    readonly x: number;
    readonly y: number;
}
interface CanvasPath {
    readonly paths: Point[];
    readonly strokeWidth: number;
    readonly strokeColor: string;
    readonly drawMode: boolean;
    readonly startTimestamp?: number;
    readonly endTimestamp?: number;
}

interface CanvasProps {
    paths: CanvasPath[];
    isDrawing: boolean;
    onPointerDown: (point: Point, isEraser?: boolean) => void;
    onPointerMove: (point: Point) => void;
    onPointerUp: () => void;
    className?: string;
    id?: string;
    width: string;
    height: string;
    canvasColor: string;
    strokeRed: number;
    strokeBlue: number;
    strokeGreen: number;
    backgroundImage: string;
    exportWithBackgroundImage: boolean;
    preserveBackgroundImageAspectRatio: string;
    allowOnlyPointerType: string;
    style: React.CSSProperties;
    svgStyle: React.CSSProperties;
    invert?: boolean;
}
interface CanvasRef {
    exportImage: (imageType: ExportImageType) => Promise<string>;
    exportSvg: () => Promise<string>;
}
declare const Canvas: React.ForwardRefExoticComponent<CanvasProps & React.RefAttributes<CanvasRef>>;

interface ReactSketchCanvasProps {
    allowOnlyPointerType?: string;
    backgroundImage?: string;
    canvasColor?: string;
    className?: string;
    eraserWidth?: number;
    exportWithBackgroundImage?: boolean;
    height?: string;
    id?: string;
    onChange?: (updatedPaths: CanvasPath[]) => void;
    onStroke?: (path: CanvasPath, isEraser: boolean) => void;
    preserveBackgroundImageAspectRatio?: string;
    strokeRed?: number;
    strokeBlue?: number;
    strokeGreen?: number;
    strokeWidth?: number;
    style?: React.CSSProperties;
    svgStyle?: React.CSSProperties;
    width?: string;
    withTimestamp?: boolean;
    invert?: boolean;
}
interface ReactSketchCanvasRef {
    eraseMode: (_erase: boolean) => void;
    clearCanvas: () => void;
    undo: () => void;
    redo: () => void;
    exportImage: (imageType: ExportImageType) => Promise<string>;
    exportSvg: () => Promise<string>;
    exportPaths: () => Promise<CanvasPath[]>;
    loadPaths: (paths: CanvasPath[]) => void;
    getSketchingTime: () => Promise<number>;
    resetCanvas: () => void;
}
declare const ReactSketchCanvas: React.ForwardRefExoticComponent<ReactSketchCanvasProps & React.RefAttributes<ReactSketchCanvasRef>>;

export { Canvas, CanvasPath, CanvasProps, CanvasRef, ExportImageType, Point, ReactSketchCanvas, ReactSketchCanvasProps, ReactSketchCanvasRef };
