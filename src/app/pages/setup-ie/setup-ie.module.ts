import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SetupIeComponent } from './setup-ie.component';
import { BeginInstallationComponent } from './begin-installation/begin-installation.component';
import { DeployStepsComponent } from './deploy-steps/deploy-steps.component';
import { DownloadImageComponent } from './download-image/download-image.component';
import { SelectInstructionsComponent } from './select-instructions/select-instructions.component';
import { SetupIeRoutingModule } from './setup-ie-routing.module';
import { BeginInstallationModule } from './begin-installation/begin-installation.module';
import { ConnectCollectorModule } from './connect-collector/connect-collector.module';
import { ConnectCollectorComponent } from './connect-collector/connect-collector.component';
import { DeployStepsModule } from './deploy-steps/deploy-steps.module';
import { DownloadImageModule } from './download-image/download-image.module';
import { SelectInstructionsModule } from './select-instructions/select-instructions.module';
import { IESetupWizardStatusBar } from './status-bar/status-bar.component';
import { CuiSpinnerModule, CuiModalModule } from '@cisco-ngx/cui-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { ResetCacheModal } from './reset-cache-modal/reset-cache-modal.component';
import { ConnectDNACenterComponent } from './connect-dna-center/connect-dna-center.component';
import { RegisterCollectorComponent } from './register-collector/register-collector.component';
import { RegisterCollectorModule } from './register-collector/register-collector.module';
import { ConnectDNACenterModule } from './connect-dna-center/connect-dna-center.module';
import { NoDNACComponent } from './no-dnac/no-dnac.component';
import { NoDNACModule } from './no-dnac/no-dnac.module';
import {
	CollectorCredsModalComponent,
} from './collector-creds-modal/collector-creds-modal.component';
import { SetupIEService } from './setup-ie.service';
import { ControlPointsModule } from '@sdp-api';
import { AlertModule, ContactSupportModule } from '@components';
import { environment } from '../../../environments/environment';
import { SetupHelpComponent } from './help';
import { ManageUsersModule } from './manage-users/manage-users.module';
import { ManageUsersComponent } from './manage-users/manage-users.component';

/**
 * SDP Root url for the apis
 */
const rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;

/**
 * Module representing Intelligence Engine setup pages/slides
 */
@NgModule({
	declarations: [
		CollectorCredsModalComponent,
		IESetupWizardStatusBar,
		ResetCacheModal,
		SetupIeComponent,
		SetupHelpComponent,
	],
	entryComponents: [
		BeginInstallationComponent,
		CollectorCredsModalComponent,
		ConnectCollectorComponent,
		ConnectDNACenterComponent,
		DeployStepsComponent,
		DownloadImageComponent,
		ManageUsersComponent,
		NoDNACComponent,
		RegisterCollectorComponent,
		ResetCacheModal,
		SelectInstructionsComponent,
	],
	imports: [
		AlertModule,
		BeginInstallationModule,
		CommonModule,
		ConnectCollectorModule,
		ConnectDNACenterModule,
		ContactSupportModule,
		ControlPointsModule.forRoot({ rootUrl }),
		CuiModalModule,
		CuiSpinnerModule,
		DeployStepsModule,
		DownloadImageModule,
		I18nPipeModule,
		ManageUsersModule,
		NoDNACModule,
		ReactiveFormsModule,
		RegisterCollectorModule,
		SelectInstructionsModule,
		SetupIeRoutingModule,
	],
	providers: [
		SetupIEService,
	],
})
export class SetupIeModule { }
