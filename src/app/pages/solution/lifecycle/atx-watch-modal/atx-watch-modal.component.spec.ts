import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtxWatchModalComponent } from './atx-watch-modal.component';

describe('AtxWatchModalComponent', () => {
	let component: AtxWatchModalComponent;
	let fixture: ComponentFixture<AtxWatchModalComponent>;

	const setData = (src: string, title?: string) => {
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
		setData('example1.com', 'example1');
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.src)
			.toBeDefined();
	});

});
