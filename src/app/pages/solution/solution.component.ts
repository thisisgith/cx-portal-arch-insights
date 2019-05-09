import {
	Component,
	OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

/**
 * Solution Page
 */
@Component({
	styleUrls: ['./solution.component.scss'],
	templateUrl: './solution.component.html',
})
export class SolutionComponent implements OnInit {

	constructor (
		private router: Router,
	) { }

	/**
	 * Handles initial routing
	 */
	public ngOnInit () {
		this.router.navigate(['/solution/lifecycle']);
	}
}
