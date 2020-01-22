import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { UserResolve } from '@utilities';
import { mergeMap, take, map } from 'rxjs/operators';
import { environment } from '@environment';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType, UserInfoKey } from '@constants';
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
		new RegExp('/(customerportal|cxportal)/entitlement/v2/user$'),
		new RegExp('/(customerportal|cxportal)/cxpp-partner-info/partnerInfo/v1/[^/]+/partners$'),
		new RegExp('/(customerportal|cxportal)/pitstop/v1/info$'),
		new RegExp('/(customerportal|cxportal)/cxpp-entitlement-wrapper/v1/entitlement/user/accounts$'),
		new RegExp('/(customerportal|cxportal)/search/v2/ciscoSearch$'),
		new RegExp('/(customerportal|cxportal)/search/v1/globalSearch$'),
	];

	private pathsToExcludeCxLevelAndSaId = [
		new RegExp('/(customerportal|cxportal)/inventory/'),
		new RegExp('/(customerportal|cxportal)/contracts/'),
		new RegExp('/(customerportal|cxportal)/product-alerts/'),
		new RegExp('/(customerportal|cxportal)/diagnostics/'),
		new RegExp('/(customerportal|cxportal)/ndgw/'),
		new RegExp('/(customerportal|cxportal)/racetrack/v1/elearning'),
	];

	private pathsToIncludeVaId = [
		new RegExp('/(customerportal|cxportal)/racetrack/v1/acc'),
		new RegExp('/(customerportal|cxportal)/racetrack/v1/atx'),
		new RegExp('/(customerportal|cxportal)/racetrack/v1/successPaths'),
		new RegExp('/(customerportal|cxportal)/controlpoint/v1/users/add$'),
		new RegExp('/(customerportal|cxportal)/controlpoint/v1/users/delete$'),
		new RegExp('/(customerportal|cxportal)/controlpoint/v1/users/roles/[^/]+$'),
		new RegExp('/(customerportal|cxportal)/controlpoint/v1/users/sa/[^/]+$'),
		new RegExp('/(customerportal|cxportal)/controlpoint/v1/users/va/[^/]+$'),
		new RegExp('/(customerportal|cxportal)/controlpoint/v1/users/samapping/[^/]+$'),
		new RegExp('/(customerportal|cxportal)/controlpoint/v1/users/update/role$'),
	];

	constructor (
		private userResolve: UserResolve,
		private apixIdentityService: ApixIdentityService,
		private racetrackInfoService: RacetrackInfoService,
		private logger: LogService,
	) {
		this.racetrackInfoService.getPitStopApiFailure()
		.pipe(
			map(() => {
				this.pathsToIgnore.push(new RegExp('/(customerportal|cxportal)/email/v1/send$'));
			}),
		)
		.subscribe();
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
		const vaid$ = this.userResolve.getVaId()
			.pipe(take(1));
		const customerId$ = this.userResolve.getCustomerId()
			.pipe(take(1));
		const cxLevel$ = this.userResolve.getCXLevel()
			.pipe(
				take(1),
				map(val => val.toString()),
			);
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
			[UserInfoKey.SAID]: said$,
			[UserInfoKey.VAID]: vaid$,
			[UserInfoKey.CUSTOMERID]: customerId$,
			[UserInfoKey.USECASE]: useCase$,
			[UserInfoKey.SOLUTION]: solution$,
			[UserInfoKey.CXLEVEL]: cxLevel$,
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
			map(result => this.removeCxLevelAndSaId(result, req)),
			map(result => this.removeVaId(result, req)),
			map(result => this.filterExistentParams(result, req)),
			map(result => this.filterExistentHeaders(result, req)),
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

	private removeCxLevelAndSaId (userInfo: UserInformation, req: HttpRequest<any>) {
		const accountInfo = userInfo.accountInfo;
		const url = new URL(req.url, environment.origin);

		if (this.pathsToExcludeCxLevelAndSaId.some(regex => regex.test(url.pathname))) {
			delete accountInfo[UserInfoKey.SAID];
			delete accountInfo[UserInfoKey.CXLEVEL];
		}

		return userInfo;
	}

	private removeVaId (userInfo: UserInformation, req: HttpRequest<any>) {
		const url = new URL(req.url, environment.origin);

		if (!this.pathsToIncludeVaId.some(regex => regex.test(url.pathname))) {
			delete userInfo.accountInfo[UserInfoKey.VAID];
		}

		return userInfo;
	}
}
