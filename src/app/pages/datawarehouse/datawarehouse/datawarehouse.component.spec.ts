import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatawarehouseComponent } from './datawarehouse.component';

describe('DatawarehouseComponent', () => {
  let component: DatawarehouseComponent;
  let fixture: ComponentFixture<DatawarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatawarehouseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatawarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
