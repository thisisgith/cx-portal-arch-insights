import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtxWatchModalComponent, BrightcovePlayerData } from './atx-watch-modal.component';

const mockBrightcovePlayerData = {
	playerId: '999999',
	accountId: '123456',
	videoId: '000001',
};

describe('AtxWatchModalComponent', () => {
	let component: AtxWatchModalComponent;
	let fixture: ComponentFixture<AtxWatchModalComponent>;

	const setData = (src: BrightcovePlayerData, title?: string) => {
		component.data = {
			src,
			title,
		};
		fixture.detectChanges();
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				AtxWatchModalComponent,
			],
			imports: [
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AtxWatchModalComponent);
		component = fixture.componentInstance;
		component.data = {
			src: null,
			title: null,
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should have src after init', () => {
		setData(mockBrightcovePlayerData, 'example1');
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.data.src)
			.toBeDefined();
	});

});
