import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {WatchComponent} from "./watch/watch/watch.component";
import {PlayerComponent} from "./watch/player/player.component";
import {RelatedComponent} from "./watch/related/related.component";
import {LazyLoadImageModule} from "ng-lazyload-image";

const routes: Routes = [
	{
		path: '',
		component: WatchComponent,
	}
];

@NgModule({
	declarations: [
		WatchComponent,
		PlayerComponent,
		RelatedComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		FormsModule,
		LazyLoadImageModule
	],
	providers: [],
	exports: [RouterModule]
})
export class WatchModule {
}
