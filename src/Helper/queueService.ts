import { Queue, Worker, Job } from 'bullmq';
import { config } from '../config/configBasic';
import DefaultProcessor from './processor.default';
import { JobType } from './processQueue';

enum Queues {
  DEFAULT = 'default',
}

export default class QueueService {
  private queues!: Record<string, Queue>;
  private defaultQueue!: Queue;
  private defaultQueueWorker: Worker | undefined;

  private static instance: QueueService;

  private static QUEUE_OPTIONS = {
    defaultJobOptions: {
      removeOnComplete: false,
      removeOnFail: false,
    },
    connection: {
      host: config.Redis.HOST,
      port: parseInt(config.Redis.PORT || "6379"),
    },
  };

  constructor() {
    if (QueueService.instance instanceof QueueService) {
      return QueueService.instance;
    }

    this.queues = {};
    QueueService.instance = this;

    this.instantiateQueues();
    this.instantiateWorkers();
  }

  async instantiateQueues() {
    try {
      this.defaultQueue = new Queue(Queues.DEFAULT, QueueService.QUEUE_OPTIONS);
      this.queues[Queues.DEFAULT] = this.defaultQueue;
    } catch (error) {
      console.log("instantiateQueues", error);
    }
  }

  async instantiateWorkers() {
    try {
      const defaultQueue = new Queue(Queues.DEFAULT, { connection: QueueService.QUEUE_OPTIONS.connection });

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
    } catch (error) {
      console.log("instantiateWorkers", error);
    }
  }

  getQueue(name: Queues) {
    return this.queues[name];
  }
}

