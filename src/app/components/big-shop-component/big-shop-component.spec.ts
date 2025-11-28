import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigShopComponent } from './big-shop-component';

describe('BigShopComponent', () => {
  let component: BigShopComponent;
  let fixture: ComponentFixture<BigShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigShopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
