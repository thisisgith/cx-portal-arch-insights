import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { UserResolve } from '@utilities';
import { mergeMap, take, map } from 'rxjs/operators';
import { environment } from '@environment';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType } from '@constants';
import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
import { RacetrackInfoService } from '@services';

export interface UserInformation {
	accountInfo: any;
	headers: any;
	params: any;
}

export class ApixAccountInterceptor implements HttpInterceptor {
	// TODO: Remove this when APIs become consistent / ignore unused params
	private pathsToIgnore = [
		new RegExp('/api/cxportal/entitlement/v2/user$'),
		new RegExp('/api/cxportal/cxpp-partner-info/partnerInfo/v1/[^/]+/partners$'),
		new RegExp('/api/customerportal/pitstop/v1/info$'),
		new RegExp('api/cxportal/cxpp-entitlement-wrapper/v1/entitlement/user/accounts$'),
	];

	constructor (
		private userResolve: UserResolve,
		private apixIdentityService: ApixIdentityService,
		private racetrackInfoService: RacetrackInfoService,
		private logger: LogService,
	) {

	}

	/**
	 * This interceptor is responsible to add SAID, VAID and CustomerID of the account to all the
	 * SDP Origin requests that is made from the application.
	 * @param req Original request object
	 * @param next HTTP request handler
	 * @returns http event next
	 */
	public intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		try {
			const url = new URL(req.url, environment.origin);

			if (this.apixIdentityService.testOrigin(url) !== OriginType.SDP) {
				return next.handle(req);
			}

			// TODO: Remove this when APIs become consistent / ignore unused params
			if (this.pathsToIgnore.some(regEx => regEx.test(url.pathname))) {
				return next.handle(req);
			}

			return this.getUserInfo(req)
			.pipe(
				take(1),
				mergeMap(userInfo => {
					const request = req.clone({
						setHeaders: {
							...userInfo.headers,
						},
						setParams: {
							...userInfo.params,
						},
					});
					return next.handle(request);
				}),
			);
		} catch (err) {
			this.logger.log(err);
		}
	}

	private getUserInfo (req: HttpRequest<any>): Observable<UserInformation> {
		return this.getAccountInfo()
		.pipe(
			mergeMap(result => this.buildAccountInfo(result, req)),
		);
	}

	private getAccountInfo (): Observable<any> {
		const said$ = this.userResolve.getSaId()
			.pipe(take(1));
		const customerId$ = this.userResolve.getCustomerId()
			.pipe(take(1));
		const cxLevel$ = this.userResolve.getCXLevel()
			.pipe(take(1));
		const useCase$ = this.racetrackInfoService.getCurrentTechnology()
			.pipe(
				take(1),
				map(usecase => usecase.name),
			);
		const solution$ = this.racetrackInfoService.getCurrentSolution()
			.pipe(
				take(1),
				map(solution => solution.name),
			);

		return forkJoin({
			saId: said$,
			customerId: customerId$,
			useCase: useCase$,
			solution: solution$,
			cxLevel: cxLevel$,
		});
	}

	/**
	 * This function builds the user account information object so that it can be added
	 * to the request as headers and params.
	 * @param accountInfo User account Information
	 * @param req The original API request
	 * @returns organized user account info
	 */
	private buildAccountInfo (accountInfo: any, req: HttpRequest<any>): Observable<UserInformation> {
		const userInfo: UserInformation = {
			accountInfo,
			headers: { },
			params: { },
		};

		if (!accountInfo || Object.keys(accountInfo).length === 0) {
			return of(userInfo);
		}

		return of(userInfo)
		.pipe(
			map(result => this.removeNonValueFields(result)),
			map(refinedResult => this.filterExistentParams(refinedResult, req)),
			map(filteredResult => this.filterExistentHeaders(filteredResult, req)),
		);
	}

	private removeNonValueFields (userInfo: UserInformation) {
		const accountInfo = userInfo.accountInfo;

		for (const key in accountInfo) {
			if (
				accountInfo[key] === undefined ||
				accountInfo[key] === null
			) {
				delete accountInfo[key];
			}
		}

		return userInfo;
	}

	private filterExistentParams (userInfo: UserInformation, req: HttpRequest<any>) {
		const accountInfo = userInfo.accountInfo;
		let existingParams: string[] =  _.get(req, 'params')
			.keys();
		existingParams = existingParams.map(v => v.toLowerCase());
		const qParams = { };

		for (const key in accountInfo) {
			if (!existingParams.includes(key.toLowerCase())) {
				qParams[key] = accountInfo[key];
			}
		}
		userInfo.params = qParams;

		return userInfo;
	}

	private filterExistentHeaders (userInfo: UserInformation, req: HttpRequest<any>) {
		const accountInfo = userInfo.accountInfo;
		let existingHeaders: string[] = _.get(req, 'headers')
			.keys();
		existingHeaders = existingHeaders.map(v => v.toLowerCase());
		const hParams = { };

		for (const key in accountInfo) {
			if (!existingHeaders.includes(key.toLowerCase())) {
				hParams[key] = accountInfo[key];
			}
		}
		userInfo.headers = hParams;

		return userInfo;
	}
}
