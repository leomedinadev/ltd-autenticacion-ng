import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { Recovery } from './recovery';

describe('Recovery', () => {
  let component: Recovery;
  let fixture: ComponentFixture<Recovery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recovery],
      // Sin token en la URL, Recovery redirige a /login: la ruta comodín evita el error de navegación
      providers: [provideRouter([{ path: '**', children: [] }]), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recovery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
