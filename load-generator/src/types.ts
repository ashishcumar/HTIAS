export interface LoadTestConfig {
    targetUrl: string;              // "http://localhost:3000/events"
    eventsPerSecond: number;        // 5000-10000
    duration: number;               // Test duration in seconds
    eventDistribution: {           // Skewed distribution
      [eventType: string]: number;  // e.g., { page_view: 0.7, button_click: 0.2 }
    };
    burstMode?: boolean;            // Enable burst traffic
  }
  
  export interface Event {
    eventType: string;
    timestamp: number;
    source: string;
    entityId?: string;
    context?: object;
  }
  
  export interface Metrics {
    latencies: number[];           // Array of request latencies in ms
    successes: number;              // Count of successful requests
    failures: number;               // Count of failed requests
    startTime: number;              // Test start timestamp
    endTime?: number;               // Test end timestamp
  }