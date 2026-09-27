"use server"

export async function fetchIconifySvg(iconName: string, color?: string): Promise<string | null> {
  try {
    const [prefix, name] = iconName.split(":");
    if (!prefix || !name) return null;

    let url = `https://api.iconify.design/${prefix}/${name}.svg`;
    if (color) {
      url += `?color=${encodeURIComponent(color)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      mode: "cors", // Явно указываем CORS-режим
      headers: {
        Accept: "image/svg+xml, text/plain, */*",
      },
    });

    if (!response.ok) {
      console.error(`Ошибка Iconify HTTP: ${response.status}`);
      return null;
    }

    const svgText = await response.text();

    // Проверка, что пришел именно SVG, а не HTML-страница ошибки
    if (!svgText.includes("<svg")) {
      console.error("Ответ не является корректным SVG");
      return null;
    }

    return svgText;
  } catch (error) {
    console.error("Ошибка загрузки SVG из Iconify:", error);
    return null;
  }
}
