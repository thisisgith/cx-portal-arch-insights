import {
	Component,
	OnDestroy,
	OnInit,
	Input,
	ElementRef,
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
 * Interface for popup style properties
 */
interface PopupStyle {
	left?: string;
	right?: string;
	height: string;
	width: string;
}

/** Popup height */
const POPUP_HEIGHT = 270;
/** Popup width */
const POPUP_WIDTH = 530;
/** Popup tail width */
const POPUP_TAIL_WIDTH = 10;

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
	public popupStyle: PopupStyle;
	public popupTailClass: string;

	constructor (
		private logger: LogService,
		private contentService: RacetrackContentService,
		private userResolve: UserResolve,
		private elRef: ElementRef,
	) {
		this.popupStyle = {
			height: `${POPUP_HEIGHT}px`,
			width: `${POPUP_WIDTH}px`,
		};
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
	 * Determines position and displays popup
	 */
	public openPopup () {
		const rootEl = this.elRef.nativeElement;
		const rootElRect = rootEl.getBoundingClientRect();
		if (rootElRect.left < POPUP_WIDTH + POPUP_TAIL_WIDTH) {
			this.popupStyle.left = `calc(100% + ${POPUP_TAIL_WIDTH}px)`;
			this.popupTailClass = 'popup-tail--left';
			this.popupStyle.right = '';
		} else {
			this.popupStyle.right = `calc(100% + ${POPUP_TAIL_WIDTH}px)`;
			this.popupStyle.left = '';
			this.popupTailClass = '';
		}
		this.showPopup = true;
	}

	/**
	 * Sends POST to save initial feedback
	 * Sends PUT if already posted
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

		// If feedbackId exists, we need to send PUT to update
		if (_.get(this.item, 'feedbackInfo.feedbackId')) {
			this.contentService.updateFeedback({
				updatedFeedback: params,
				feedbackId: _.get(this.item, 'feedbackInfo.feedbackId'),
			})
			.subscribe(res => {
				_.set(this.item, 'feedbackInfo.thumbs', res.thumbs);
			}, err => {
				this.logger.error(`feedback.component : submitFeedbackThumbsRating() :: Error : (${
					err.status}) ${err.message}`);
			});
			return;
		}

		this.contentService.saveFeedback({
			feedback: params,
		})
		.subscribe(feedbackInfo => {
			this.openPopup();
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
				thumbs: _.get(this.item, 'feedbackInfo.thumbs'),
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
