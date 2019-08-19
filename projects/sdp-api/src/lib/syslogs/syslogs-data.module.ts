import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SyslogsConfiguration } from "./syslogs-configuration";
import { SyslogsService } from "./services/syslogs.service";

/**
 * Ng module
 */
@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [SyslogsConfiguration, SyslogsService]
})
export class SyslogsDataModule {
	// tslint:disable-next-line: completed-docs
	public static forRoot (customParams: SyslogsConfiguration): ModuleWithProviders {
		return {
			ngModule: SyslogsDataModule,
			providers: [
				{
					provide: SyslogsConfiguration,
					useValue: { rootUrl: customParams.rootUrl }
				}
			]
		};
	}
}
