import {
	Component,
	OnDestroy,
	OnInit,
	Input,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import {
	RacetrackContentService,
	AtxSchema,
	UserFeedbackRequestSchema,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export enum AssetType {
	ATX = 'ATX',
	ACC = 'ACC',
}

enum FeedbackThumbs {
	UP = 'UP',
	DOWN = 'DOWN',
}

/**
 * Feedback component for ATX/ACC sessions
 */
@Component({
	selector: 'session-feedback',
	styleUrls: ['./session-feedback.component.scss'],
	templateUrl: './session-feedback.component.html',
})
export class SessionFeedbackComponent implements OnDestroy, OnInit {
	private thumbs: FeedbackThumbs;
	private comments: string;
	private customerId: string;

	@Input() public item: AtxSchema;
	@Input() public type: AssetType = AssetType.ATX;
	public AssetType = AssetType;
	public FeedbackThumbs = FeedbackThumbs;
	public commentMaxLength = 300;
	public destroy$ = new Subject();
	public showPopup: boolean;
	public feedbackComplete: boolean;

	constructor (
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

	/**
	 * Init lifecycle method
	 */
	public ngOnInit () {
		if (!this.item) {
			throw new Error('Attribute \'item\' is required');
		}
		this.feedbackComplete = _.get(this.item, 'feedbackInfo.available');
	}

	/**
	 * Closes the popup
	 */
	public closePopup () {
		this.showPopup = false;
		this.feedbackComplete = true;
	}

	/**
	 * Sends POST to save initial feedback
	 * @param thumbs Up or Down rating
	 */
	public async submitFeedbackThumbsRating (thumbs: FeedbackThumbs) {
		const entityIdKey = this.type === AssetType.ATX ? 'atxId' :
			this.type === AssetType.ACC ? 'accId' :
			'id';
		const params: UserFeedbackRequestSchema = {
			thumbs,
			comment: '',
			context: {
				entityId: _.get(this.item, entityIdKey),
				partnerId: _.get(this.item, 'providerInfo.id'),
				customerId: this.customerId,
				assetType: this.type,
			},
		};
		this.contentService.saveFeedback({
			feedback: params,
		})
		.subscribe(feedbackInfo => {
			this.showPopup = true;
			_.set(this.item, 'feedbackInfo.available', true);
			_.set(this.item, 'feedbackInfo.feedbackId', feedbackInfo.feedbackId);
			_.set(this.item, 'feedbackInfo.thumbs', feedbackInfo.thumbs);
		},
		err => {
			this.logger.error(`ERROR: ${err}`);
			// maybe a toast describing error here?
		});
	}

	/**
	 * Sends PUT to update feedback previously saved
	 */
	public async submitFeedbackComment () {
		const entityIdKey = this.type === AssetType.ATX ? 'atxId' :
			this.type === AssetType.ACC ? 'accId' :
			'id';
		const params: any = {
			updatedFeedback: {
				comment: this.comments,
				context: {
					entityId: _.get(this.item, entityIdKey),
					partnerId: _.get(this.item, 'providerInfo.id'),
					customerId: this.customerId,
					assetType: this.type,
				},
				thumbs: this.thumbs,
			},
			feedbackId: _.get(this.item, 'feedbackInfo.feedbackId'),
		};
		this.contentService.updateFeedback(params)
		.subscribe(() => {
			this.feedbackComplete = true;
		},
		err  => {
			this.logger.error(`ERROR: ${err}`);
			// maybe a toast describing error here?
		});

	}

	/** On destroy lifecycle method */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
