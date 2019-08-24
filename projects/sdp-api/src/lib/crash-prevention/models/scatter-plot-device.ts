export interface ScatterPlotDevice {
    deviceId: string;
    deviceName: string;
    productFamily: string;
    productId: string;
    featureProfilePCA1: string;
    featureProfilePCA2: string;
    featureProfilePCA3: string;
    lemmaFeaturePCA1: string;
    lemmaFeaturePCA2: string;
    lemmaFeaturePCA3: string;
    fingerprintPCA1: string;
    fingerprintPCA2: string;
    fingerprintPCA3: string;
    featureProfileKcluster: number;
    lemmaFeatureKcluster: number;
    fingerprintKcluster: number;
    featureProfileKclusterCrashrate: string;
    lemmaFeatureKclusterCrashrate: string;
    fingerprintKclusterCrashrate: string;
}