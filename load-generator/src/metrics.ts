import { Metrics } from "./types";

export function calculatePercentile(latencies: number[], percentile: number): number {
  if (latencies.length === 0) return 0;

  const sorted = [...latencies].sort((a, b) => a - b);

  const position = (percentile / 100) * sorted.length;
  
  if (position % 1 === 0) {
    return sorted[position - 1];
  }
  
  const lower = Math.floor(position) - 1;
  const upper = Math.ceil(position) - 1;
  return (sorted[lower] + sorted[upper]) / 2;
}

export function generateReport(metrics: Metrics): void {
  const { latencies, successes, failures, startTime, endTime } = metrics;
  
  const total = successes + failures;
  const duration = endTime ? (endTime - startTime) / 1000 : 0; 
  const eventsPerSecond = duration > 0 ? total / duration : 0;
  const successRate = total > 0 ? (successes / total) * 100 : 0;
  
  const p50 = calculatePercentile(latencies, 50);
  const p95 = calculatePercentile(latencies, 95);
  const p99 = calculatePercentile(latencies, 99);
  

  const avg = latencies.length > 0 
    ? latencies.reduce((a, b) => a + b, 0) / latencies.length 
    : 0;
  const min = latencies.length > 0 ? Math.min(...latencies) : 0;
  const max = latencies.length > 0 ? Math.max(...latencies) : 0;

  console.log('\n═══════════════════════════════════════');
  console.log('        LOAD TEST RESULTS');
  console.log('═══════════════════════════════════════\n');
  
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Total Requests: ${total.toLocaleString()}`);
  console.log(`Events/Second: ${eventsPerSecond.toFixed(0)}`);
  console.log(`Success Rate: ${successRate.toFixed(2)}%`);
  console.log(`Errors: ${failures}\n`);
  
  console.log('Latency Percentiles:');
  console.log(`  P50: ${p50.toFixed(2)}ms`);
  console.log(`  P95: ${p95.toFixed(2)}ms`);
  console.log(`  P99: ${p99.toFixed(2)}ms`);
  console.log(`  Avg: ${avg.toFixed(2)}ms`);
  console.log(`  Min: ${min.toFixed(2)}ms`);
  console.log(`  Max: ${max.toFixed(2)}ms`);
  console.log('\n═══════════════════════════════════════\n');
}