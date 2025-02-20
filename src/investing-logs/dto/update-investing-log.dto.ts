import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestingLogDto } from './create-investing-log.dto';

export class UpdateInvestingLogDto extends PartialType(CreateInvestingLogDto) {}
