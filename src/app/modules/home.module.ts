import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {IndexHomeComponent} from "./home/index/index.component";
import {LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule, ScrollHooks} from "ng-lazyload-image";

const routes: Routes = [
  {
    path: '',
    component: IndexHomeComponent,
  }
];

@NgModule({
  declarations: [
    IndexHomeComponent,
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        FormsModule,
        LazyLoadImageModule
    ],
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }],
  exports: [RouterModule]
})
export class HomeModule {
}
