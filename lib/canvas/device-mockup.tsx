import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { AndroidMockup, AndroidTabMockup, IPadMockup, IPhoneMockup } from "react-device-mockup";
import type { FrameKind } from "@/lib/canvas/frames";

/** Snapshot pixels per CSS pixel, so the device stays sharp on the slide. */
export const MOCKUP_SCALE = 2;

const FRAME = "#1c1c1e";
const SCREEN = "#e4e4e7";

const SPECS: Record<FrameKind, { width: number; height: number }> = {
  iphone: { width: 280, height: Math.floor((280 / 9) * 19.5) },
  android: { width: 280, height: Math.floor((280 / 9) * 19.5) },
  ipad: { width: 520, height: Math.floor((520 / 4) * 3) },
  tablet: { width: 520, height: Math.floor((520 / 16) * 10) },
  laptop: { width: 520, height: 325 },
  monitor: { width: 560, height: 315 },
};

function Screen({ src }: { src?: string }) {
  if (!src) {
    return <div style={{ width: "100%", height: "100%", background: SCREEN }} />;
  }
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

function Glass({
  width,
  height,
  radius,
  screen,
}: {
  width: number;
  height: number;
  radius: number;
  screen?: string;
}) {
  return (
    <div style={{ width, height, borderRadius: radius, overflow: "hidden", background: SCREEN }}>
      <Screen src={screen} />
    </div>
  );
}

function LaptopMockup({ screen }: { screen?: string }) {
  const { width, height } = SPECS.laptop;
  const bezelX = 16;
  const lidW = width + bezelX * 2;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: lidW,
          boxSizing: "border-box",
          background: FRAME,
          borderRadius: 18,
          padding: "22px 16px 16px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            width: 7,
            height: 7,
            marginLeft: -3.5,
            borderRadius: 99,
            background: "#3f3f46",
          }}
        />
        <Glass width={width} height={height} radius={4} screen={screen} />
      </div>
      <div style={{ width: lidW + 10, height: 8, background: "#27272a" }} />
      <div
        style={{
          width: lidW + 76,
          height: 22,
          background: "#3f3f46",
          borderRadius: "0 0 14px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 72, height: 6, borderRadius: 99, background: "#52525b" }} />
      </div>
    </div>
  );
}


function MonitorMockup({ screen }: { screen?: string }) {
  const { width, height } = SPECS.monitor;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          boxSizing: "border-box",
          background: "#18181b",
          borderRadius: 12,
          padding: "12px 12px 28px",
        }}
      >
        <Glass width={width} height={height} radius={4} screen={screen} />
      </div>
      <div style={{ width: 48, height: 36, background: "#27272a" }} />
      <div style={{ width: 148, height: 10, background: "#3f3f46", borderRadius: 99 }} />
    </div>
  );
}

function Device({ kind, screen }: { kind: FrameKind; screen?: string }) {
  const { width } = SPECS[kind];
  const frame = {
    screenWidth: width,
    frameColor: FRAME,
    frameOnly: true,
    hideStatusBar: true,
    hideNavBar: true,
    statusbarColor: FRAME,
  };
  const child = <Screen src={screen} />;

  if (kind === "laptop") return <LaptopMockup screen={screen} />;
  if (kind === "monitor") return <MonitorMockup screen={screen} />;
  if (kind === "android") return <AndroidMockup {...frame}>{child}</AndroidMockup>;
  if (kind === "ipad") {
    return (
      <IPadMockup {...frame} screenType="modern" isLandscape>
        {child}
      </IPadMockup>
    );
  }
  if (kind === "tablet") {
    return (
      <AndroidTabMockup {...frame} isLandscape>
        {child}
      </AndroidTabMockup>
    );
  }
  return (
    <IPhoneMockup {...frame} screenType="island">
      {child}
    </IPhoneMockup>
  );
}

/** Cover-crops a picture to the device screen so the photo fills the glass. */
async function coverScreen(kind: FrameKind, source: string) {
  const { width, height } = SPECS[kind];
  const pixelW = width * MOCKUP_SCALE;
  const pixelH = height * MOCKUP_SCALE;
  const image = new Image();
  image.src = source;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = pixelW;
  canvas.height = pixelH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;

  const scale = Math.max(pixelW / image.naturalWidth, pixelH / image.naturalHeight);
  const drawW = image.naturalWidth * scale;
  const drawH = image.naturalHeight * scale;
  ctx.drawImage(image, (pixelW - drawW) / 2, (pixelH - drawH) / 2, drawW, drawH);
  return canvas.toDataURL("image/png");
}

/**
 * Paints a react-device-mockup frame to a PNG.
 * An iframe keeps the snapshot away from the app's color styles.
 */
export async function renderDeviceMockup(kind: FrameKind, screen?: string) {
  const screenSrc = screen ? await coverScreen(kind, screen) : undefined;
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;left:-10000px;top:0;width:1400px;height:1800px;border:0;opacity:0;pointer-events:none";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  const view = iframe.contentWindow;
  if (!doc || !view) {
    iframe.remove();
    throw new Error("Couldn't open a mockup frame");
  }

  doc.body.style.margin = "0";
  doc.body.style.background = "transparent";
  const host = doc.createElement("div");
  host.style.display = "inline-block";
  host.style.background = "transparent";
  doc.body.appendChild(host);

  const root = createRoot(host);
  try {
    flushSync(() => {
      root.render(<Device kind={kind} screen={screenSrc} />);
    });
    await Promise.all(
      [...host.querySelectorAll("img")].map((img) => img.decode().catch(() => undefined)),
    );
    const node = host.firstElementChild as HTMLElement | null;
    if (!node || node.offsetWidth < 2) {
      throw new Error("Mockup did not render");
    }

    const { default: html2canvas } = await import("html2canvas");
    const shot = await html2canvas(node, {
      backgroundColor: null,
      scale: MOCKUP_SCALE,
      logging: false,
      useCORS: true,
      windowWidth: view.innerWidth,
      windowHeight: view.innerHeight,
    });
    return shot.toDataURL("image/png");
  } finally {
    root.unmount();
    iframe.remove();
  }
}
