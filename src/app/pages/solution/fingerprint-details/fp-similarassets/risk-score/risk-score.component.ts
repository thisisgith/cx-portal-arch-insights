import { Component } from '@angular/core';
import { SimilarDevice } from '@sdp-api';

@Component({
	selector: 'app-risk-score',
	template: `<p
				class="text-left"
				[innerText]="data?.similarityScore / 100 | percent: '2.2-4'"
				></p>`,
})
export class RiskScoreComponent {
	public data: SimilarDevice;
}
