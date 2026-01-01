import { Event } from "./types";

function selectWeightedRandom(distribution: { [key: string]: number }): string {
  const random = Math.random();
  let cumulative = 0;

  for (const [eventType, weight] of Object.entries(distribution)) {
    cumulative += weight;
    if (random <= cumulative) {
      return eventType;
    }
  }

  return Object.keys(distribution)[0];
}

function generateContext(eventType: string): object {
  if (eventType === "page_view") {
    return {
      page: `/page-${Math.floor(Math.random() * 10)}`,
      referrer: "/home",
    };
  }
  if (eventType === "button_click") {
    return {
      button: `btn-${Math.floor(Math.random() * 5)}`,
      page: "/current",
    };
  }
  return {};
}

export function generateEvent(distribution: { [key: string]: number }): Event {
  const eventType = selectWeightedRandom(distribution);
  const sources = ["web", "mobile", "backend"];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const timestamp = Date.now();
  const entityId = `user_${Math.floor(Math.random() * 1000000)}`;
  const context = generateContext(eventType);

  return {
    eventType,
    timestamp,
    source,
    entityId,
    context,
  };
}
