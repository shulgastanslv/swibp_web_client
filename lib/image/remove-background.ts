"use client";

export type RemoveBackgroundProgress = {
  key: string;
  current: number;
  total: number;
};

/**
 * Remove image background in the browser via @imgly/background-removal.
 * Returns a PNG data URL (with alpha) so Fabric can persist it in project JSON.
 */
export async function removeImageBackground(
  source: string,
  options?: {
    onProgress?: (progress: RemoveBackgroundProgress) => void;
  },
): Promise<string> {
  const { removeBackground } = await import("@imgly/background-removal");

  const blob = await removeBackground(source, {
    // Quantized model: smaller download, faster inference.
    model: "isnet_quint8",
    output: {
      format: "image/png",
      quality: 1,
    },
    progress: (key, current, total) => {
      options?.onProgress?.({ key, current, total });
    },
  });

  return blobToDataUrl(blob);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Couldn't encode the result"));
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Couldn't read the result"));
    reader.readAsDataURL(blob);
  });
}
