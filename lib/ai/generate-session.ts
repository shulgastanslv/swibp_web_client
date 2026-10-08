let currentAbort: AbortController | null = null;

export function beginGenerateSession(): AbortController {
  currentAbort?.abort();
  const next = new AbortController();
  currentAbort = next;
  return next;
}

export function endGenerateSession(controller: AbortController) {
  if (currentAbort === controller) currentAbort = null;
}

export function cancelGenerateSession() {
  currentAbort?.abort();
  currentAbort = null;
}
