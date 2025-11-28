import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaProducto } from './tienda-producto';

describe('TiendaProducto', () => {
  let component: TiendaProducto;
  let fixture: ComponentFixture<TiendaProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendaProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
