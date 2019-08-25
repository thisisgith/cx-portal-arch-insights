/* tslint:disable */
import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RccConfiguration } from "./rcc-configuration";
import { RccService } from "./services/rcc.service";
@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [RccConfiguration, RccService, ],
	
})
export class RccDataModule {
	public static forRoot (customParams: RccConfiguration): ModuleWithProviders {
		return {
			ngModule: RccDataModule,
			providers: [
				{
					provide: RccConfiguration,
					useValue: { rootUrl: customParams.rootUrl }
				}
			]
		};
	}
}