import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {YoutubeService} from "../../../services/YoutubeService";
import {HttpResponse} from "@angular/common/http";
import CardYoutube from "../../../models/CardYoutube";
import {CookieService} from "../../../services/CookieService";
import {environment} from "../../../../environments/environment";
import {PlayerComponent} from "../player/player.component";
import {RelatedComponent} from "../related/related.component";
import {filter} from "rxjs/operators";

@Injectable({providedIn: 'root'})
@Component({
	selector: 'div#youtube-watch',
	templateUrl: './watch.component.html'
})
export class WatchComponent implements OnInit {
	regex: any = new RegExp("video\\/(.+?);")
	environment = environment

	@ViewChild(PlayerComponent)
	player: PlayerComponent | undefined;

	@ViewChild(RelatedComponent)
	related: RelatedComponent | undefined;

	id: string
	loading: boolean = false

	items: CardYoutube[] = []
	loadingMore: boolean = false
	afterCursor: string | number = ''

	data: any
	videos: any[] = []
	audios: any[] = []

	constructor(
		private youtubeService: YoutubeService,
		private cookieService: CookieService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private title: Title
	) {
		const routeParams = this.activatedRoute.snapshot.paramMap;
		this.id = String(routeParams.get('id'));
		this.watch();
	}

	ngOnInit(): void {
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((event: any) => {
				// code goes here...
				const routeParams = this.activatedRoute.snapshot.paramMap;
				const id = String(routeParams.get('id'));
				if (id !== this.id) {
					this.id = id
					this.reset();
					// @ts-ignore
					this.player?.isAutoPlay = true
					this.watch();
				}
			});
	}

	reset(): void {
		this.related?.reset()
		this.player?.reset()
		this.items = []
		this.data = void 0
		this.videos = []
		this.audios = []
	}

	async watch() {
		this.loading = true
		this.youtubeService.watch(this.id).subscribe((res: HttpResponse<any>) => {
			this.loading = false
			const key_red = res.headers.get('key_red')
			if (key_red) {
				this.cookieService.setCookie('key_red', key_red, 12, '/tools/youtube')
			}

			const body = res.body
			if (body && body.status === 0 && body.data) {
				const data = this.data = body.data
				this.title.setTitle(data.watch.video.title)
				this.related?.setRelated(data.media.video.id, data.related)
				if (data.media) {
					this.videos = data.media.video
					this.audios = data.media.audio
					this.player?.setMedia(this.videos, data.watch.video.thumbnail)
					this.player?.setTotalTime(Number(data.watch.video.lengthSeconds) - 1)
				}
				if (body.data.n)
					this.afterCursor = body.data.n

				if (body.data.items)
					this.items.push(...body.data.items)
			}
		})
	}

	encodeURIComponent(data: string): string {
		return encodeURIComponent(data)
	}

	numberWithCommas(number: string | number) {
		return Number(number).toLocaleString()
	}

	playerPrintCurrentTime(time: number | string): string {
		if (typeof time !== 'number')
			time = Number(time)

		let hour = Math.floor(time / 3600);
		let minute = Math.floor((time % 3600) / 60);
		let second = Math.floor((time % 3600) % 60);

		if (hour !== 0) {
			return hour.toString().padStart(2, "0") + ':' + minute.toString().padStart(2, "0") + ':' + second.toString().padStart(2, "0");
		} else {
			return minute.toString().padStart(2, "0") + ':' + second.toString().padStart(2, "0")
		}
	}

	nextWatch() {
		this.related?.nextWatch()
	}
}
