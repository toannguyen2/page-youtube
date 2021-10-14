import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {YoutubeService} from "../../../services/YoutubeService";
import CardYoutube from "../../../models/CardYoutube";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
import {CookieService} from "../../../services/CookieService";
import {HomeService} from "../../../services/HomeService";
import {filter} from "rxjs/operators";

@Injectable({providedIn: 'root'})
@Component({
	selector: 'div#youtube-home',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.css']
})
export class IndexHomeComponent implements OnInit, OnDestroy {
	suggests: string[] = []
	items: CardYoutube[]

	query: string | undefined | null = ''

	afterCursor: string | number

	showSuggest: boolean = false
	loading: boolean = false

	elementSearchResults: any
	scroll: any

	public searchFormControl: FormControl;

	formSearch: FormGroup

	constructor(
		private youtubeService: YoutubeService,
		private cookieService: CookieService,
		private homeService: HomeService,
		private formBuilder: FormBuilder,
		private router: Router,
		private title: Title,
		private activatedRoute: ActivatedRoute
	) {
		this.searchFormControl = new FormControl('');
		this.formSearch = this.formBuilder.group({
			search: this.searchFormControl
		});
		title.setTitle("Youtube - RedGateway")
		this.items = this.homeService.items
		this.afterCursor = this.homeService.afterCursor
		this.scroll = this.onScroll.bind(this);

		setTimeout(() => {
			this.query = this.activatedRoute.snapshot.queryParamMap.get('q')
			// @ts-ignore
			if (this.validValue(this.query)) {
				this.searchFormControl.setValue(this.query)
				// @ts-ignore
				this.searchVideo(this.query)
			}
		}, 100)
	}

	onSubmit(): void {
		let value = this.searchFormControl.value
		if (this.validValue(value)) {
			const id = this.isUrlAndGetId(value)
			if (id) {
				this.router.navigate(["/watch/", id])
				return void 0;
			}
			this.toUrlSearch(value)
		}
	}

	toUrlSearch(query: string) {
		this.showSuggest = false
		this.router.navigateByUrl('/?q=' + query)
	}

	onClose() {
		this.showSuggest = false
	}

	onFocus() {
		this.showSuggest = true
	}

	onInput() {
		const value = this.searchFormControl.value
		if (this.validValue(value))
			this.youtubeService.getSuggest(value.trim()).subscribe((res: HttpResponse<any>) => {
				const body = res.body;
				if (body && body.status === 0 && body.data) {
					this.suggests = body.data
				}
			})
	}

	validValue(value: string): boolean {
		return typeof value === 'string' &&
			value !== 'null' &&
			value !== 'undefined' &&
			value.trim().length > 2
	}

	searchVideo(value: string): void {
		const id = this.isUrlAndGetId(value)
		if (id) {
			setTimeout(() => {
				this.toWatchId(id)
			})
			return void 0;
		}

		this.homeService.items = this.items = []
		this.loading = true

		this.youtubeService.search({q: value.trim()}).subscribe((res: HttpResponse<any>) => {
			this.loading = false

			const body = res.body
			if (body && body.status === 0 && body.data) {
				this.homeService.afterCursor = this.afterCursor = body.data.n
				this.homeService.items = this.items = body.data.items
			}
		})
	}

	loadMore(): void {
		if (this.loading)
			return void 0;

		this.loading = true
		this.youtubeService.search({afterCursor: this.afterCursor}).subscribe((res: HttpResponse<any>) => {
			this.loading = false
			const key_red = res.headers.get('key_red')
			if (key_red) {
				this.cookieService.setCookie('key_red', key_red, 12, '/tools/youtube')
			}

			const body = res.body
			if (body && body.status === 0 && body.data) {
				this.afterCursor = body.data.n
				this.items.push(...body.data.items)
				this.homeService.items = this.items
			}
		})
	}

	isUrlAndGetId(value: string): string | void {
		const regex5 = new RegExp('watch:(.+)', 'gm')
		const result5 = regex5.exec(value);
		if (result5 && result5[1])
			return result5[1];

		const regex1 = new RegExp('v=(.+?)&', 'gm')
		const result1 = regex1.exec(value);
		if (result1 && result1[1])
			return result1[1];

		const regex2 = new RegExp('v=(.+?)%', 'gm')
		const result2 = regex2.exec(value);
		if (result2 && result2[1])
			return result2[1];

		const regex3 = new RegExp('v%3D(.+)%', 'gm')
		const result3 = regex3.exec(value);
		if (result3 && result3[1])
			return result3[1];

		//
		const regex4 = new RegExp('=(.+)', 'gm')
		const result4 = regex4.exec(value);
		if (result4 && result4[1])
			return result4[1];

		return void 0
	}

	toWatch(watch: CardYoutube) {
		this.toWatchId(watch.id)
	}

	toWatchId(id: string) {
		this.router.navigate(["/watch/", id])
	}

	ngOnInit(): void {
		this.elementSearchResults = document.getElementById("search-results")
		document.addEventListener('scroll', this.scroll);

		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((event: any) => {
				const routeParams = this.activatedRoute.snapshot.queryParamMap;
				this.query = String(routeParams.get('q'))
				if (this.validValue(this.query)) {
					this.searchFormControl.setValue(this.query)
					this.searchVideo(this.query)
				}
			});
	}

	onScroll(): void {
		if (this.loading || !this.afterCursor || this.afterCursor === -1)
			return void 0;

		let offset = (this.elementSearchResults.offsetHeight + this.elementSearchResults.offsetTop) - window.innerHeight - window.scrollY
		if (offset < 400) {
			this.loadMore()
		}
	}

	ngOnDestroy(): void {
		this.elementSearchResults = void 0
		document.removeEventListener('scroll', this.scroll);
	}
}
