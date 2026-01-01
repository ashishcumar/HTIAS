const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface HealthStatus {
  status: string;
  database: string;
  redis: string;
  timestamp: string;
}

export interface Event {
  id: number;
  eventType: string;
  timestamp: string;
  source: string;
  entityId: string | null;
  context: object | null;
  createdAt: string;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  limit: number;
  totalPages: number;
}

export async function getHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("Failed to fetch health status");
  }
  return response.json();
}

export async function getEvents(
  page: number = 1,
  limit: number = 100
): Promise<EventsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/events?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
}
