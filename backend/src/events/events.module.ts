import { Module, Global } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';

@Global()
@Module({
  providers: [EventsService, EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule { }
