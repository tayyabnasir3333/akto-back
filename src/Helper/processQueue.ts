import { Worker, Queue, Job } from 'bullmq';
import DefaultProcessor from './processor.default';

export enum JobType {
  PROCESS_PAYMENT = 'process-payment',
}

export enum Queues {
  DEFAULT = 'default',
}

export default class QueueService {
  private static QUEUE_OPTIONS = {
    connection: {
      host: "localhost",
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
    },
  };

  private defaultQueueWorker: Worker | undefined;

  constructor() {
    this.instantiateWorkers();
  }

  async instantiateWorkers() {
    const defaultQueue = new Queue(Queues.DEFAULT, { connection: QueueService.QUEUE_OPTIONS.connection });
  
    console.log('Initializing workers...', defaultQueue);
  
    this.defaultQueueWorker = new Worker(
      Queues.DEFAULT,
      async (job: Job) => {
        try {
          switch (job.name) {
            case JobType.PROCESS_PAYMENT:
              await DefaultProcessor.processPayment(job);
              break;
            default:
              console.error(`Unhandled job type: ${job.name}`);
              break;
          }
          console.log('[DEFAULT QUEUE] Worker for default queue');
        } catch (error) {
          console.error('[DEFAULT QUEUE] Worker error:', error);
        }
      }
    );
  
    this.defaultQueueWorker.on('completed', (job: Job, value) => {
      console.log(
        `[DEFAULT QUEUE] Completed job with data\n
          Data: ${job.asJSON().data}\n
          ID: ${job.id}\n
          Value: ${value}
        `,
      );
    });
  
    this.defaultQueueWorker.on('failed', (job: Job<any, any, string> | undefined, value) => {
      console.log(
        `[DEFAULT QUEUE] Failed job with data\n
          Data: ${job?.asJSON().data}\n
          ID: ${job?.id}\n
          Value: ${value}
        `,
      );
    });
  
    console.log('Worker initialized.');
  }
  
}
