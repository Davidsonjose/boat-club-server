import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/services/database/database.service';
import { UserService } from '../user/user.service';
import { SystemSpecService } from 'src/services/system-spec/Systemspec.service';

@Injectable()
export class BillService {
  constructor(
    private databaseService: DatabaseService,
    private userService: UserService,
    private systemSpecService: SystemSpecService,
  ) {}
}
