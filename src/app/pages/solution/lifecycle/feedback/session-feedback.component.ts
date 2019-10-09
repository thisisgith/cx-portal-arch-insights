import {
	Component,
	OnDestroy,
	OnInit,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import {
	RacetrackContentService,
	AtxSchema,
	UserFeedbackEntitySchema,
	UserFeedbackRequestSchema
} from '@sdp-api';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';



export enum AssetType {
	ATX="ATX",
	ACC="ACC"
}

enum FeedbackThumbs {
	UP="UP",
	DOWN="DOWN"
}

@Component({
	selector: 'session-feedback',
	styleUrls: ['./session-feedback.component.scss'],
	templateUrl: './session-feedback.component.html',
})
export class SessionFeedbackComponent implements OnDestroy, OnInit {
	private thumbs: FeedbackThumbs;
	private comments: string;
	// private feedbackId: string;
	private showPopup: boolean;
	private feedbackComplete: boolean;
	private customerId: string;

	@Input() public item: AtxSchema;
	@Input() public type: AssetType = AssetType.ATX;
	public AssetType = AssetType;
	public FeedbackThumbs = FeedbackThumbs;
	public commentMaxLength = 300;
	@Output() public submit: EventEmitter<any> = new EventEmitter();
	public destroy$ = new Subject();

	constructor(
		private logger: LogService,
		private contentService: RacetrackContentService,
		private userResolve: UserResolve,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

	public ngOnInit () {
		this.feedbackComplete = _.get(this.item, 'feedbackInfo.available');
	}

	public closePopup () {
		this.showPopup = false;
		this.feedbackComplete = true;
	}

	public async submitFeedbackThumbsRating (thumbs: FeedbackThumbs) {
		const entityIdKey = this.type === AssetType.ATX ? 'atxId' : 
			this.type === AssetType.ACC ? 'accId' :
			'id';
		const params: UserFeedbackRequestSchema = {
			comment: '',
			context: {
				entityId: _.get(this.item, entityIdKey),
				partnerId: _.get(this.item, 'providerInfo.id'),
				customerId: this.customerId,
				assetType: this.type,
			},
			thumbs,
		};
		this.contentService.saveFeedback({
			feedback: params
		})
		.subscribe(feedbackInfo => {
			this.showPopup = true;
			_.set(this.item, 'feedbackInfo.available', true)
			_.set(this.item, 'feedbackInfo.feedbackId', feedbackInfo.feedbackId)
			_.set(this.item, 'feedbackInfo.thumbs', feedbackInfo.thumbs)
		},
		err => {
			this.logger.error(`ERROR: ${err}`);
			// maybe a toast describing error here?
		})
	}

	public async submitFeedbackComment () {
		const params: any = {
			updatedFeedback: {

			},
			feedbackId: _.get(this.item, 'feedbackInfo.feedbackId'),
		}
		this.contentService.updateFeedback(params)
		.subscribe(()=> {
			this.feedbackComplete = true;
		},
		err  => {
			this.logger.error(`ERROR: ${err}`);
			// maybe a toast describing error here?
		});

	}

	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
