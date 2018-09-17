import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestBasicListTestComponent } from './basic-list-test/basic-list-test.component';

const routes: Routes = [

  { path: 'basic-list-test', component: TestBasicListTestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
