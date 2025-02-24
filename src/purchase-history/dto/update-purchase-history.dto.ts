import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseHistoryDto } from './create-purchase-history.dto';

export class UpdatePurchaseHistoryDto extends PartialType(CreatePurchaseHistoryDto) {}
