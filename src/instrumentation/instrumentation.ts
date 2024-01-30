import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { AlwaysOffSampler } from '@opentelemetry/sdk-trace-base';


class Tracer {
  private sdk: NodeSDK | null = null;

  private exporter = new ConsoleSpanExporter();
  private provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'shopify-multi-js',
    }),
  });

  public init() {
    try {
      this.provider.addSpanProcessor(new SimpleSpanProcessor(this.exporter));
      this.provider.register();

      this.sdk = new NodeSDK({
        traceExporter: this.exporter,
        sampler: new AlwaysOffSampler(),
        instrumentations: [
          getNodeAutoInstrumentations({
            // You can disable or enable instrumentation as needed
            '@opentelemetry/instrumentation-express': { enabled: false },
            '@opentelemetry/instrumentation-net': { enabled: false },
            '@opentelemetry/instrumentation-fs': { enabled: false },
          }),
        ],
      });

      this.sdk.start();

      console.info('The tracer has been initialized');
    } catch (e) {
      console.error('Failed to initialize the tracer', e);
    }
  }
}

export default new Tracer();
