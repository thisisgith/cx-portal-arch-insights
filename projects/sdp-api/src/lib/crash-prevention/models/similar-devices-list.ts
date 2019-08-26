import { SimilarDevice } from "./similar-device";

export interface SimilarDevicesList{
    customerId: string;
    count: number;
    similarDevices : Array<SimilarDevice>;
}