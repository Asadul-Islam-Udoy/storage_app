"use client";
import * as bodyPix from "@tensorflow-models/body-pix";
import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type FilterKeys = "brightness" | "contrast" | "grayscale" | "saturation" | "blur";

const filterSettings: Record<FilterKeys, { min: number; max: number }> = {
  brightness: { min: 0, max: 200 },
  contrast: { min: 0, max: 200 },
  grayscale: { min: 0, max: 100 },
  saturation: { min: 0, max: 200 },
  blur: { min: 0, max: 10 },
};

export default function PictureEdit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const [overlayImage, setOverlayImage] = useState<HTMLImageElement | null>(null);

  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    saturation: 100,
    blur: 0,
  });

  const [bgColor, setBgColor] = useState("#ffffff");

  // Crop rect and drag state
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const dragState = useRef<{
    dragging: boolean;
    resizing: boolean;
    resizeDir: string;
    startX: number;
    startY: number;
    origRect: Rect | null;
  }>({ dragging: false, resizing: false, resizeDir: "", startX: 0, startY: 0, origRect: null });

  // Overlay drag state
  const [overlayPos, setOverlayPos] = useState({ x: 20, y: 20 });
  const overlayDrag = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  // Cursor style for UX
  const [cursorStyle, setCursorStyle] = useState<string>("crosshair");

  // Load base image from file input
  const onBaseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      setBaseImage(img);
      setCropRect({ x: img.width * 0.1, y: img.height * 0.1, width: img.width * 0.8, height: img.height * 0.8 });
      setOverlayPos({ x: 20, y: 20 });
      URL.revokeObjectURL(url);
    };
  };

  // Load overlay image from file input
  const onOverlayImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      setOverlayImage(img);
      setOverlayPos({ x: 20, y: 20 });
      URL.revokeObjectURL(url);
    };
  };

  // Draw canvas content
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to image size
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;

    // Fill background color first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply filters as CSS filter string
    const filterString = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      grayscale(${filters.grayscale}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
    `.trim();

    ctx.filter = filterString;

    // Draw base image clipped to crop area if any
    if (cropRect) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
      ctx.clip();
      ctx.drawImage(baseImage, 0, 0);
      ctx.restore();

      // Draw semi-transparent overlay outside crop
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, canvas.width, cropRect.y); // top
      ctx.fillRect(0, cropRect.y, cropRect.x, cropRect.height); // left
      ctx.fillRect(cropRect.x + cropRect.width, cropRect.y, canvas.width - cropRect.x - cropRect.width, cropRect.height); // right
      ctx.fillRect(0, cropRect.y + cropRect.height, canvas.width, canvas.height - cropRect.y - cropRect.height); // bottom
    } else {
      ctx.drawImage(baseImage, 0, 0);
    }

    // Draw overlay image with no filter
    ctx.filter = "none";
    if (overlayImage) {
      ctx.drawImage(overlayImage, overlayPos.x, overlayPos.y, overlayImage.width, overlayImage.height);
    }

    // Draw crop rectangle outline & resize handles
    if (cropRect) {
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 3;
      ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);

      // Handles size
      const size = 10;
      const half = size / 2;

      // Draw handles (corners)
      const points = [
        [cropRect.x, cropRect.y],
        [cropRect.x + cropRect.width, cropRect.y],
        [cropRect.x, cropRect.y + cropRect.height],
        [cropRect.x + cropRect.width, cropRect.y + cropRect.height],
      ];

      ctx.fillStyle = "#0ea5e9";
      points.forEach(([x, y]) => {
        ctx.fillRect(x - half, y - half, size, size);
      });
    }
  };

  // Redraw canvas on state change
  useEffect(() => {
    draw();
  }, [baseImage, cropRect, filters, bgColor, overlayImage, overlayPos]);

  // Check if mouse is on a resize handle
  function getResizeHandle(pos: { x: number; y: number }, rect: Rect): string | null {
    const size = 10;
    const half = size / 2;

    const handles = {
      nw: { x: rect.x, y: rect.y },
      ne: { x: rect.x + rect.width, y: rect.y },
      sw: { x: rect.x, y: rect.y + rect.height },
      se: { x: rect.x + rect.width, y: rect.y + rect.height },
    };

    for (const [dir, point] of Object.entries(handles)) {
      if (
        pos.x >= point.x - half &&
        pos.x <= point.x + half &&
        pos.y >= point.y - half &&
        pos.y <= point.y + half
      ) {
        return dir;
      }
    }

    return null;
  }

  // Mouse down handler for crop dragging or resizing
  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (!cropRect || !baseImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check resize handles first
    const resizeDir = getResizeHandle({ x: mouseX, y: mouseY }, cropRect);
    if (resizeDir) {
      dragState.current = {
        dragging: false,
        resizing: true,
        resizeDir,
        startX: mouseX,
        startY: mouseY,
        origRect: { ...cropRect },
      };
      return;
    }

    // Check overlay drag
    if (
      overlayImage &&
      mouseX >= overlayPos.x &&
      mouseX <= overlayPos.x + overlayImage.width &&
      mouseY >= overlayPos.y &&
      mouseY <= overlayPos.y + overlayImage.height
    ) {
      overlayDrag.current = {
        dragging: true,
        offsetX: mouseX - overlayPos.x,
        offsetY: mouseY - overlayPos.y,
      };
      return;
    }

    // Check if inside crop rect for dragging
    if (
      mouseX >= cropRect.x &&
      mouseX <= cropRect.x + cropRect.width &&
      mouseY >= cropRect.y &&
      mouseY <= cropRect.y + cropRect.height
    ) {
      dragState.current = {
        dragging: true,
        resizing: false,
        resizeDir: "",
        startX: mouseX,
        startY: mouseY,
        origRect: { ...cropRect },
      };
    }
  };

  // Mouse move handler for crop dragging, resizing, or overlay drag
  const onCanvasMouseMove = (e: React.MouseEvent) => {
    if (!cropRect || !baseImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (dragState.current.resizing) {
      // Handle resizing crop rect
      const { resizeDir, origRect, startX, startY } = dragState.current;
      if (!origRect) return;

      let newRect = { ...origRect };

      const dx = mouseX - startX;
      const dy = mouseY - startY;

      // Clamp helpers
      const clampWidth = (w: number) => Math.min(baseImage.width - newRect.x, Math.max(w, 20));
      const clampHeight = (h: number) => Math.min(baseImage.height - newRect.y, Math.max(h, 20));

      if (resizeDir === "se") {
        newRect.width = clampWidth(origRect.width + dx);
        newRect.height = clampHeight(origRect.height + dy);
      } else if (resizeDir === "sw") {
        newRect.x = Math.min(baseImage.width - 20, Math.max(0, origRect.x + dx));
        newRect.width = clampWidth(origRect.width - dx);
        newRect.height = clampHeight(origRect.height + dy);
      } else if (resizeDir === "ne") {
        newRect.y = Math.min(baseImage.height - 20, Math.max(0, origRect.y + dy));
        newRect.height = clampHeight(origRect.height - dy);
        newRect.width = clampWidth(origRect.width + dx);
      } else if (resizeDir === "nw") {
        newRect.x = Math.min(baseImage.width - 20, Math.max(0, origRect.x + dx));
        newRect.y = Math.min(baseImage.height - 20, Math.max(0, origRect.y + dy));
        newRect.width = clampWidth(origRect.width - dx);
        newRect.height = clampHeight(origRect.height - dy);
      }

      setCropRect(newRect);
    } else if (dragState.current.dragging) {
      // Drag crop rect
      const { origRect, startX, startY } = dragState.current;
      if (!origRect) return;

      let newX = origRect.x + (mouseX - startX);
      let newY = origRect.y + (mouseY - startY);

      newX = Math.min(Math.max(0, newX), baseImage.width - origRect.width);
      newY = Math.min(Math.max(0, newY), baseImage.height - origRect.height);

      setCropRect({ ...origRect, x: newX, y: newY });
    } else if (overlayDrag.current.dragging && overlayImage) {
      // Drag overlay image
      let newX = mouseX - overlayDrag.current.offsetX;
      let newY = mouseY - overlayDrag.current.offsetY;

      newX = Math.min(Math.max(0, newX), baseImage.width - overlayImage.width);
      newY = Math.min(Math.max(0, newY), baseImage.height - overlayImage.height);

      setOverlayPos({ x: newX, y: newY });
    }
  };

  // Mouse up cancels drag/resize states
  const onCanvasMouseUp = () => {
    dragState.current.dragging = false;
    dragState.current.resizing = false;
    overlayDrag.current.dragging = false;
  };

  // Cursor style change for UX
  const onCanvasMouseMoveWithCursor = (e: React.MouseEvent) => {
    if (!cropRect || !baseImage) {
      setCursorStyle("crosshair");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      setCursorStyle("crosshair");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check resize handles
    const resizeDir = getResizeHandle({ x: mouseX, y: mouseY }, cropRect);
    if (resizeDir) {
      if (resizeDir === "nw" || resizeDir === "se") setCursorStyle("nwse-resize");
      else if (resizeDir === "ne" || resizeDir === "sw") setCursorStyle("nesw-resize");
      return;
    }

    // Check overlay image
    if (
      overlayImage &&
      mouseX >= overlayPos.x &&
      mouseX <= overlayPos.x + overlayImage.width &&
      mouseY >= overlayPos.y &&
      mouseY <= overlayPos.y + overlayImage.height
    ) {
      setCursorStyle("move");
      return;
    }

    // Check crop rect drag
    if (
      mouseX >= cropRect.x &&
      mouseX <= cropRect.x + cropRect.width &&
      mouseY >= cropRect.y &&
      mouseY <= cropRect.y + cropRect.height
    ) {
      setCursorStyle("grab");
      return;
    }

    setCursorStyle("crosshair");
  };

  // Reset all settings
  const onReset = () => {
    if (!baseImage) return;
    setCropRect({ x: baseImage.width * 0.1, y: baseImage.height * 0.1, width: baseImage.width * 0.8, height: baseImage.height * 0.8 });
    setFilters({
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      saturation: 100,
      blur: 0,
    });
    setOverlayImage(null);
    setOverlayPos({ x: 20, y: 20 });
    setBgColor("#ffffff");
  };

  // Download cropped and edited image as PNG
  const onDownload = () => {
    if (!canvasRef.current || !baseImage) return;

    // Create offscreen canvas for crop + filters + overlay + bg
    const offCanvas = document.createElement("canvas");
    const ctx = offCanvas.getContext("2d");
    if (!ctx) return;

    // Crop size or full image size fallback
    const crop = cropRect || { x: 0, y: 0, width: baseImage.width, height: baseImage.height };
    offCanvas.width = crop.width;
    offCanvas.height = crop.height;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, offCanvas.width, offCanvas.height);

    // Apply filters
    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      grayscale(${filters.grayscale}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
    `.trim();

    // Draw cropped base image portion
    ctx.drawImage(baseImage, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    // Draw overlay adjusted to crop area
    if (overlayImage) {
      ctx.filter = "none"; // No filter on overlay
      const overlayX = overlayPos.x - crop.x;
      const overlayY = overlayPos.y - crop.y;
      ctx.drawImage(overlayImage, overlayX, overlayY, overlayImage.width, overlayImage.height);
    }

    // Create download link
    offCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited-image.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };


    // Remove background function using BodyPix
  const removeBackground = async () => {
    if (!baseImage) return;

    const net = await bodyPix.load();

    // Segment person from background
    const segmentation = await net.segmentPerson(baseImage);

    const offCanvas = document.createElement("canvas");
    offCanvas.width = baseImage.width;
    offCanvas.height = baseImage.height;

    const ctx = offCanvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(baseImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const pixels = imageData.data;

    // Set background pixels alpha to 0 (transparent)
    for (let i = 0; i < pixels.length; i += 4) {
      const pixelIndex = i / 4;
      if (segmentation.data[pixelIndex] === 0) {
        pixels[i + 3] = 0; // fully transparent alpha channel
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Create a new image from canvas
    const newImg = new Image();
    newImg.crossOrigin = "anonymous";
    newImg.src = offCanvas.toDataURL("image/png");

    newImg.onload = () => {
      setBaseImage(newImg);
      // Optionally reset cropRect etc.
    };
  };

  return (
    <div className="h-screen-[600px] mt-10 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-6 flex flex-col items-center text-white">
  <h1 className="text-4xl font-bold mb-6 select-none drop-shadow-lg">Picture Editor 🎨</h1>

  {/* Upload controls */}
  <div className="flex flex-wrap gap-4 mb-6 justify-center">
    <label className="cursor-pointer bg-white/20 rounded px-4 py-2 hover:bg-white/40 transition select-none">
      Upload Base Image
      <input type="file" accept="image/*" onChange={onBaseImageChange} className="hidden" />
    </label>

    <label className="cursor-pointer bg-white/20 rounded px-4 py-2 hover:bg-white/40 transition select-none">
      Upload Overlay Image
      <input type="file" accept="image/*" onChange={onOverlayImageChange} className="hidden" />
    </label>

    <button
      onClick={onReset}
      disabled={!baseImage}
      className="disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition select-none"
    >
      Reset All
    </button>

           {/* Remove Background button */}
        <button
          onClick={removeBackground}
          disabled={!baseImage}
          className="disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition select-none"
        >
          Remove Background
        </button>
  </div>

  {/* Canvas container */}
  <div
    className="relative border-4 border-white rounded-lg shadow-lg max-w-full max-h-[70vh] overflow-auto"
    onMouseDown={onCanvasMouseDown}
    onMouseMove={(e) => {
      onCanvasMouseMove(e);
      onCanvasMouseMoveWithCursor && onCanvasMouseMoveWithCursor(e);
    }}
    onMouseUp={onCanvasMouseUp}
    onMouseLeave={onCanvasMouseUp}
    style={{ cursor: cursorStyle }}
  >
    <canvas
      ref={canvasRef}
      className="rounded-lg max-w-full max-h-[70vh] bg-white"
      style={{ touchAction: "none" }}
    />
  </div>

  {/* Crop info */}
  {cropRect && (
    <div className="mt-4 text-center font-mono tracking-wide select-none">
      Crop: x: {Math.round(cropRect.x)} y: {Math.round(cropRect.y)} w: {Math.round(cropRect.width)} h:{" "}
      {Math.round(cropRect.height)}
    </div>
  )}

  {/* Filters controls */}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-lg w-full mt-6 text-black bg-white bg-opacity-20 rounded p-4">
    {(Object.keys(filters) as FilterKeys[]).map((key) => (
      <div key={key} className="flex flex-col">
        <label htmlFor={key} className="mb-1 font-semibold capitalize select-none">
          {key}
        </label>
        <input
          type="range"
          id={key}
          min={filterSettings[key].min}
          max={filterSettings[key].max}
          value={filters[key]}
          onChange={(e) => setFilters({ ...filters, [key]: Number(e.target.value) })}
          className="w-full"
        />
      </div>
    ))}
  </div>

  {/* Background color picker */}
  <div className="mt-6 flex items-center gap-3 select-none text-white">
    <label htmlFor="bgColor" className="font-semibold">
      Background Color:
    </label>
    <input
      id="bgColor"
      type="color"
      value={bgColor}
      onChange={(e) => setBgColor(e.target.value)}
      className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
    />
  </div>

  {/* Download button */}
  <button
    onClick={onDownload}
    disabled={!baseImage}
    className="mt-8 bg-green-600 px-6 py-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed select-none"
  >
    Download Edited Image
  </button>
</div>

  );
}
