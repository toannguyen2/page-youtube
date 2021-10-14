import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: 'watch/:id',
    loadChildren: () => import('./modules/watch.module').then(m => m.WatchModule)
  },
  {
    path: '',
    loadChildren: () => import('./modules/home.module').then(m => m.HomeModule)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
