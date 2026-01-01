import { LoadTestConfig } from './types';
import { runLoadTest } from './load-generator';
import { generateReport } from './metrics';

function parseArgs(): Partial<LoadTestConfig> {
  const args = process.argv.slice(2);
  const config: Partial<LoadTestConfig> = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    
    switch (key) {
      case '--url':
        config.targetUrl = value;
        break;
      case '--rate':
        config.eventsPerSecond = parseInt(value, 10);
        break;
      case '--duration':
        config.duration = parseInt(value, 10);
        break;
      case '--burst':
        config.burstMode = true;
        break;
    }
  }
  
  return config;
}


const defaultConfig: LoadTestConfig = {
  targetUrl: 'http://localhost:3000/events',
  eventsPerSecond: 5000,
  duration: 60, 
  eventDistribution: {
    page_view: 0.7,        
    button_click: 0.2,     
    checkout_started: 0.05, 
    signup_started: 0.03,  
    job_failed: 0.01,      
    email_sent: 0.01,      
  },
};

async function main() {
  const cliArgs = parseArgs();
  const config: LoadTestConfig = { ...defaultConfig, ...cliArgs };
  
  try {
    const metrics = await runLoadTest(config);
    generateReport(metrics);
  } catch (error) {
    console.error('Error running load test:', error);
    process.exit(1);
  }
}

main();