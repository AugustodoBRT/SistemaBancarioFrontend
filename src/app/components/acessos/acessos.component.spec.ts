import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessosComponent } from './acessos.component';

describe('AcessosComponent', () => {
  let component: AcessosComponent;
  let fixture: ComponentFixture<AcessosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcessosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcessosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
