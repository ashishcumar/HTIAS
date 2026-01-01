import axios from "axios";
import { generateEvent } from "./event-generator";
import { LoadTestConfig, Metrics, Event } from "./types";


export async function runLoadTest(config: LoadTestConfig): Promise<Metrics> {
  const metrics: Metrics = {
    latencies: [],
    successes: 0,
    failures: 0,
    startTime: Date.now(),
  };

  const { duration, eventDistribution, eventsPerSecond, targetUrl } = config;

  console.log(`Starting load test...`);
  console.log(`Target: ${eventsPerSecond} events/sec for ${duration} seconds`);
  console.log(`URL: ${targetUrl}\n`);

  function sendEvent(event: Event): Promise<void> {
    const requestStartTime = Date.now();

    return axios
      .post(targetUrl, event)
      .then(() => {
        const latency = Date.now() - requestStartTime;
        metrics.latencies.push(latency);
        metrics.successes++;
      })
      .catch(() => {
        metrics.failures++;
      });
  }

  const promises: Promise<void>[] = [];
  const totalBatches = duration; 

  for (let i = 0; i < totalBatches; i++) {
    for (let j = 0; j < eventsPerSecond; j++) {
      const event = generateEvent(eventDistribution);
      promises.push(sendEvent(event));
    }


    if (i < totalBatches - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  await Promise.all(promises);
  metrics.endTime = Date.now();
  return metrics;
}
