import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TestRoutingModule } from './test-routing.module';
import { TestBasicListTestComponent } from './basic-list-test/basic-list-test.component';

const COMPONENTS = [
  TestBasicListTestComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    TestRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TestModule { }
