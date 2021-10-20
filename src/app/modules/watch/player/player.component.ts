import {Component, Inject, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WatchComponent} from "../watch/watch.component";

const TIME_DEFAULT = '00:00'

@Injectable({providedIn: 'root'})
@Component({
	selector: 'div#player-container',
	templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit, OnDestroy {
	isAutoPlay: boolean = false
	src: string | undefined
	isShowMedia: boolean = false;
	poster: string | undefined;
	isShowControls: boolean = false;
	repeat: boolean = false;

	isPlayer: boolean = false;
	refresh: boolean = false;
	pip: boolean = true;

	timeBar: number = 0
	vCurrentTime: number = 0

	isMoveTimeBar: boolean = false

	timingShowControls: any;

	currentTime: string = TIME_DEFAULT
	totalTime: string = TIME_DEFAULT

	media: any

	videoTime: number = 1

	@ViewChild('video')
	video: HTMLVideoElement | undefined;

	@ViewChild('timeBarElement')
	timeBarElement: HTMLVideoElement | undefined;

	@ViewChild('timeBarContainer')
	timeBarContainer: HTMLVideoElement | undefined;

	fMouseMoveTimeBar: any
	fMouseUpTimeBar: any


	fTouchMoveTimeBar: any
	fTouchEndTimeBar: any


	boundingRect: any

	constructor(
		@Inject(WatchComponent) private parent: WatchComponent
	) {
		this.fMouseMoveTimeBar = this.onMouseMoveTimeBar.bind(this)
		this.fMouseUpTimeBar = this.onMouseUpTimeBar.bind(this)

		this.fTouchMoveTimeBar = this.onTouchMoveTimeBar.bind(this)
		this.fTouchEndTimeBar = this.onTouchUpTimeBar.bind(this)

	}

	ngOnInit(): void {
		window.addEventListener('mousemove', this.fMouseMoveTimeBar)
		window.addEventListener('mouseup', this.fMouseUpTimeBar)

		window.addEventListener('touchmove', this.fTouchMoveTimeBar)
		window.addEventListener('touchcancel', this.fTouchEndTimeBar)
		window.addEventListener('touchend', this.fTouchEndTimeBar)
	}

	reset(): void {
		this.isAutoPlay = false
		this.isPlayer = false
		this.src = void 0
		this.isShowMedia = false
		this.poster = void 0
		this.isShowControls = false
		this.media = void 0
		this.timeBar = 0
		this.vCurrentTime = 0
		this.refresh = false

		this.currentTime = TIME_DEFAULT
		this.totalTime = TIME_DEFAULT

		// @ts-ignore
		if (document.pictureInPictureElement) {
			// @ts-ignore
			document.exitPictureInPicture();
		}
	}

	showVideo() {
		this.isShowMedia = true
	}

	hideVideo() {
		this.isShowMedia = false
	}

	setSrc(src: string) {
		this.src = src;
	}

	public setMedia(media: any, poster: string) {
		this.poster = poster
		this.media = media
		this.media.forEach((item: any) => {
			if (item.itag === 18) {
				this.setSrc(item.url)
			}
		})
		if (this.src === void 0) {
			this.setSrc(this.media[0].url)
		}

		if (this.isAutoPlay) {
			this.showControls()
			this.clickPlay()
		}
	}

	showControls() {
		this.toggleControls(true)
	}

	hideControls() {
		this.toggleControls(false)
	}

	toggleControls(status?: boolean) {
		this.isShowControls = status === void 0 ? !this.isShowControls : status

		this.timingShowControls && clearTimeout(this.timingShowControls)

		if (this.isShowControls) {
			this.timingShowControls = setTimeout(() => {
				this.hideControls()
			}, 6000)
		}
	}

	onClickToPlayer() {
		this.toggleControls();
	}

	showMedia() {
		this.isShowMedia = true
	}

	hideMedia() {
		this.isShowMedia = false
	}

	clickPlay() {
		if (!this.isShowMedia) {
			this.showMedia()
			setTimeout(() => {
				this.isPlayer = true
				this.registerEventVideo();
				// @ts-ignore
				this.video?.nativeElement.currentTime = this.vCurrentTime
				// @ts-ignore
				this.video?.nativeElement.play()
			}, 50);
		} else {
			this.isPlayer = true
			// @ts-ignore
			this.video?.nativeElement.play()
		}
	}

	clickPause() {
		this.isPlayer = false
		// @ts-ignore
		this.isShowMedia && this.video && this.video?.nativeElement.pause();
	}

	clickRefresh() {
		window.location.reload();
	}

	clickNext() {
		this.parent.nextWatch()
	}

	clickRepeat() {
		this.repeat = !this.repeat;
	}

	clickPiP(): void {
		this.pip = !this.pip
		if (!this.video)
			return void 0;

		this.pip ? this.onPiP() : this.offPiP()
	}


	offPiP() {
		// @ts-ignore
		if (document.pictureInPictureElement) {
			// @ts-ignore
			document.exitPictureInPicture();
		}
	}

	onPiP() {
		// @ts-ignore
		if (document.pictureInPictureEnabled) {
			// @ts-ignore
			this.video?.nativeElement.requestPictureInPicture();
		}
	}

	clickFullscreen() {
		// @ts-ignore
		this.video && this.video?.nativeElement.requestFullscreen();
	}

	ngOnDestroy(): void {
		window.removeEventListener('mousemove', this.fMouseMoveTimeBar)
		window.removeEventListener('mouseup', this.fMouseUpTimeBar)

		// @ts-ignore
		if (document.pictureInPictureElement) {
			// @ts-ignore
			document.exitPictureInPicture();
		}
	}

	registerEventVideo() {
		// @ts-ignore
		this.video?.nativeElement.addEventListener('timeupdate', (event) => {
			this.updateCurrentTime()
		});

		// @ts-ignore
		this.video?.nativeElement.addEventListener('ended', (event) => {
			this.clickPause()
			if (this.repeat) {
				// @ts-ignore
				this.video?.nativeElement.currentTime = 0
				this.clickPlay()
			} else {
				this.clickNext()
			}
		});

		// @ts-ignore
		this.video?.nativeElement.addEventListener('error', (err) => {
			this.refresh = true
			console.log(err)
		});

		// @ts-ignore
		// this.video?.nativeElement.addEventListener('loadeddata', (e) => {
		// });
	}

	updateCurrentTime(): void {
		if (!this.video)
			return void 0;

		// @ts-ignore
		const currentTime = this.video?.nativeElement.currentTime
		this.currentTime = this.convertTimeToPadTime(currentTime)

		this.updateTimeBar(currentTime)
	}

	updateTimeBar(time: number) {
		if (!this.isMoveTimeBar)
			this.timeBar = (time / this.videoTime) * 100
	}

	setTotalTime(time: number) {
		this.videoTime = time
		this.totalTime = this.convertTimeToPadTime(time)
	}

	convertTimeToPadTime(time: number) {
		const hour = Math.floor(time / 3600);
		const minute = Math.floor((time % 3600) / 60);
		const second = Math.floor((time % 3600) % 60);

		if (hour !== 0) {
			return hour.toString().padStart(2, "0") + ':' + minute.toString().padStart(2, "0") + ':' + second.toString().padStart(2, "0")
		} else {
			return minute.toString().padStart(2, "0") + ':' + second.toString().padStart(2, "0");
		}
	}

	// Event move timebar
	onMouseDownTimeBar(event: MouseEvent) {
		this.isMoveTimeBar = true
	}

	onMouseMoveTimeBar(event: MouseEvent): void {
		if (!this.isMoveTimeBar)
			return void 0;

		if (!this.boundingRect) {
			// @ts-ignore
			this.boundingRect = this.timeBarContainer?.nativeElement.getBoundingClientRect()
		}
		// @ts-ignore
		const offsetWidth = this.timeBarContainer?.nativeElement.offsetWidth

		// @ts-ignore
		let offsetX = event.screenX - this.boundingRect.left

		if (offsetX > offsetWidth)
			offsetX = offsetWidth
		if (offsetX < 0)
			offsetX = 0

		this.timeBar = (offsetX / offsetWidth) * 100
	}

	onMouseUpTimeBar(event: MouseEvent): void {
		if (!this.isMoveTimeBar)
			return void 0;

		this.isMoveTimeBar = false
		if (!this.boundingRect) {
			// @ts-ignore
			this.boundingRect = this.timeBarContainer?.nativeElement.getBoundingClientRect()
		}
		// @ts-ignore
		const offsetWidth = this.timeBarContainer?.nativeElement.offsetWidth

		// @ts-ignore
		let offsetX = event.pageX - this.boundingRect.left

		if (offsetX > offsetWidth)
			offsetX = offsetWidth
		if (offsetX < 0)
			offsetX = 0

		const point = offsetX / offsetWidth
		this.timeBar = point * 100

		const toS = point * this.videoTime

		this.vCurrentTime = toS;
		// @ts-ignore
		this.video && (this.video?.nativeElement.currentTime = toS)
	}


	onTouchDownTimeBar(event: TouchEvent) {
		this.isMoveTimeBar = true
	}

	onTouchMoveTimeBar(event: TouchEvent): void {
		if (!this.isMoveTimeBar)
			return void 0;

		if (!this.boundingRect) {
			// @ts-ignore
			this.boundingRect = this.timeBarContainer?.nativeElement.getBoundingClientRect()
		}
		// @ts-ignore
		const offsetWidth = this.timeBarContainer?.nativeElement.offsetWidth

		// @ts-ignore
		let offsetX = event.touches[0].pageX - this.boundingRect.left

		if (offsetX > offsetWidth)
			offsetX = offsetWidth
		if (offsetX < 0)
			offsetX = 0

		this.timeBar = (offsetX / offsetWidth) * 100
	}

	onTouchUpTimeBar(event: TouchEvent): void {
		// @ts-ignore
		if (!this.isMoveTimeBar || !event || !event.touches && !event.changedTouches || !event.touches[0] && !event.changedTouches[0])
			return void 0

		this.isMoveTimeBar = false
		if (!this.boundingRect) {
			// @ts-ignore
			this.boundingRect = this.timeBarContainer?.nativeElement.getBoundingClientRect()
		}
		// @ts-ignore
		const offsetWidth = this.timeBarContainer?.nativeElement.offsetWidth

		// @ts-ignore
		let offsetX = event.touches[0] ? event.touches[0].pageX - this.boundingRect.left : event.changedTouches[0].pageX - this.boundingRect.left

		if (offsetX > offsetWidth)
			offsetX = offsetWidth
		if (offsetX < 0)
			offsetX = 0

		const point = offsetX / offsetWidth
		this.timeBar = point * 100

		const toS = point * this.videoTime

		this.vCurrentTime = toS;
		// @ts-ignore
		this.video && (this.video?.nativeElement.currentTime = toS)
	}
}
