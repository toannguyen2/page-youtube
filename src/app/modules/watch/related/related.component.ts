import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {HttpResponse} from "@angular/common/http";
import {YoutubeService} from "../../../services/YoutubeService";
import {CookieService} from "../../../services/CookieService";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
@Component({
	selector: 'div#video-related',
	templateUrl: './related.component.html'
})
export class RelatedComponent implements OnInit, OnDestroy {
	id: string | undefined
	items: Array<any> = []
	afterCursor: string | number = ''
	loading: boolean = false

	elementRelated: any
	scroll: any

	constructor(
		private youtubeService: YoutubeService,
		private cookieService: CookieService,
		private title: Title,
		private router: Router
	) {
		this.scroll = this.onScroll.bind(this)
	}

	reset(): void {
		this.loading = false
		this.items = []
		this.afterCursor = ''
	}

	setRelated(id: string, data: any) {
		this.id = id;
		this.items = data.items
		this.afterCursor = data.n
	}

	onclick(item: any): void {
		this.title.setTitle(item.title)
	}

	ngOnInit(): void {
		this.elementRelated = document.getElementById("related-container")
		document.addEventListener('scroll', this.scroll);
	}

	onScroll(): void {
		if (this.loading || !this.afterCursor || this.afterCursor === -1)
			return void 0;

		let offset = (this.elementRelated.offsetHeight + this.elementRelated.offsetTop) - window.innerHeight - window.scrollY
		if (offset < 400) {
			this.loadMore()
		}
	}

	ngOnDestroy(): void {
		this.elementRelated = void 0
		document.removeEventListener('scroll', this.scroll);
	}

	loadMore(): void {
		if (this.loading)
			return void 0;

		this.loading = true
		this.youtubeService.getListRelated({afterCursor: this.afterCursor}).subscribe((res: HttpResponse<any>) => {
			this.loading = false
			const key_red = res.headers.get('key_red')
			if (key_red) {
				this.cookieService.setCookie('key_red', key_red, 12, '/tools/youtube')
			}

			const body = res.body
			if (body && body.status === 0 && body.data) {
				// if (body && body.status === 0 && body.data && this.id == body.data.id) {
				this.afterCursor = body.data.n
				this.items.push(...body.data.items)
			}
		})
	}

	nextWatch() {
		// let listVideoPlayable = relatedVideoService.items
		//
		// let newListVideoPlayable: Video[] = []
		//
		// for (const video of listVideoPlayable) {
		// 	if (this.ignoreVideos[video.id]) {
		// 		continue;
		// 	}
		// 	newListVideoPlayable.push(video)
		// }
		//
		// if (newListVideoPlayable.length === 0) {
		// 	this.playRandomInListVideo(listVideoPlayable)
		// } else {
		// 	this.playRandomInListVideo(newListVideoPlayable)
		// }
		this.playRandomInListVideo(this.items)
	}

	playRandomInListVideo(list: any) {
		let indexPlay = Math.floor(Math.random() * list.length);
		let video = list[indexPlay]
		this.router.navigate(['watch', video.id])
	}
}
