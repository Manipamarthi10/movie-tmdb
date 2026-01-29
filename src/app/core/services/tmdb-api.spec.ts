import { TestBed } from '@angular/core/testing';

import { TmdbApi } from './tmdb-api';

describe('TmdbApi', () => {
  let service: TmdbApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmdbApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
