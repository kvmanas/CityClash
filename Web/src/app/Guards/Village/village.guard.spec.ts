import { TestBed, async, inject } from '@angular/core/testing';

import { VillageGuard } from './village.guard';

describe('VillageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VillageGuard]
    });
  });

  it('should ...', inject([VillageGuard], (guard: VillageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
