import { ScatterPlotDevice } from './scatter-plot-device';
/**
 * mlvisualization
 */
export interface MlVisualizationDevices {
	customerId: string;
	count: number;
	scatterPlotDevices: ScatterPlotDevice[];
}
