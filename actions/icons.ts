"use server";

/**
 * Fetch an Iconify SVG and normalize it so Fabric can parse every collection
 * (currentColor monochromes, multi-path solar icons, emoji sets, etc.).
 */
export async function fetchIconifySvg(
  iconName: string,
  color = "#000000",
): Promise<string | null> {
  try {
    const [prefix, name] = iconName.split(":");
    if (!prefix || !name) return null;

    const url = `https://api.iconify.design/${prefix}/${name}.svg?height=128`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "image/svg+xml, text/plain, */*",
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      console.error(`Iconify HTTP ${response.status} for ${iconName}`);
      return null;
    }

    let svgText = await response.text();

    if (!svgText.includes("<svg")) {
      console.error("Iconify response is not SVG:", iconName);
      return null;
    }

    // Ensure root has xmlns (some parsers need it).
    if (!svgText.includes("xmlns=")) {
      svgText = svgText.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }

    // Replace currentColor so monochrome icons are visible on the canvas.
    svgText = svgText
      .replace(/currentColor/gi, color)
      .replace(/fill="none"/gi, 'fill="none"') // keep intentional none
      ;

    // Paths without fill inherit currentColor in browsers but Fabric often
    // leaves them empty — give a default fill when missing.
    if (!/fill=/i.test(svgText) && !/<style/i.test(svgText)) {
      svgText = svgText.replace("<svg", `<svg fill="${color}"`);
    }

    return svgText;
  } catch (error) {
    console.error("Ошибка загрузки SVG из Iconify:", error);
    return null;
  }
}
