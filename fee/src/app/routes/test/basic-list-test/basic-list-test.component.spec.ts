import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestBasicListTestComponent } from './basic-list-test.component';

describe('TestBasicListTestComponent', () => {
  let component: TestBasicListTestComponent;
  let fixture: ComponentFixture<TestBasicListTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestBasicListTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBasicListTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
