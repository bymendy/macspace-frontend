import { TestBed } from '@angular/core/testing';

import { InterventionClientService } from './intervention-client.service';

describe('InterventionClientService', () => {
  let service: InterventionClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterventionClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
