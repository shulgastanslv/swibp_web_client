
import { LayoutTemplate } from "./layouts";


export const GRID_TEMPLATES: LayoutTemplate[] = [
  {
    id: "split-2",
    name: "2 Columns",
    cells: [
      { x: 0, y: 0, width: 50, height: 100 },
      { x: 50, y: 0, width: 50, height: 100 },
    ],
  },
  {
    id: "split-3",
    name: "3 Columns",
    cells: [
      { x: 0, y: 0, width: 33.33, height: 100 },
      { x: 33.33, y: 0, width: 33.34, height: 100 },
      { x: 66.67, y: 0, width: 33.33, height: 100 },
    ],
  },
  {
    id: "rows-2",
    name: "2 Rows",
    cells: [
      { x: 0, y: 0, width: 100, height: 50 },
      { x: 0, y: 50, width: 100, height: 50 },
    ],
  },
  {
    id: "grid-2x2",
    name: "2x2 Grid",
    cells: [
      { x: 0, y: 0, width: 50, height: 50 },
      { x: 50, y: 0, width: 50, height: 50 },
      { x: 0, y: 50, width: 50, height: 50 },
      { x: 50, y: 50, width: 50, height: 50 },
    ],
  },
  {
    id: "hero-bottom",
    name: "Hero + 2 Bottom",
    cells: [
      { x: 0, y: 0, width: 100, height: 60 },
      { x: 0, y: 60, width: 50, height: 40 },
      { x: 50, y: 60, width: 50, height: 40 },
    ],
  },
  {
    id: "sidebar",
    name: "Sidebar + Content",
    cells: [
      { x: 0, y: 0, width: 30, height: 100 },
      { x: 30, y: 0, width: 70, height: 100 },
    ],
  },
  {
    id: "triple-row",
    name: "3 Rows",
    cells: [
      { x: 0, y: 0, width: 100, height: 33.33 },
      { x: 0, y: 33.33, width: 100, height: 33.34 },
      { x: 0, y: 66.67, width: 100, height: 33.33 },
    ],
  },
  {
    id: "quad-split",
    name: "4 Quadrants",
    cells: [
      { x: 0, y: 0, width: 50, height: 50 },
      { x: 50, y: 0, width: 50, height: 50 },
      { x: 0, y: 50, width: 50, height: 50 },
      { x: 50, y: 50, width: 50, height: 50 },
    ],
  },
];
