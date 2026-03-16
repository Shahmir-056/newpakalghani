import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingPolicy } from './booking-policy';

describe('BookingPolicy', () => {
  let component: BookingPolicy;
  let fixture: ComponentFixture<BookingPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPolicy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingPolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
