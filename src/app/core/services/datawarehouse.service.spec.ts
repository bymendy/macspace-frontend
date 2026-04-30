import { TestBed } from '@angular/core/testing';

import { DatawarehouseService } from './datawarehouse.service';

describe('DatawarehouseService', () => {
  let service: DatawarehouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatawarehouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
