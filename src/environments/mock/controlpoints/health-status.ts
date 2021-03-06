import { IEHealthStatusResponseModel } from '@sdp-api';
/** base API for controlpoints info */
const api = '/api/customerportal/controlpoint/v1/ie/health-status/2431199';

/**
 * Mock body of results
 */
const mockData: IEHealthStatusResponseModel = {
	component_details: [
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: '1',
				cpu_requests: '1m',
				memory: '177Mi',
				memory_limits: '512Mi',
				pod_name: 'bulk-plane-connector-sdp-connector-client-59cbd967d7-tl4hw',
				pod_restart_count: '1',
			},
			name: 'sdp-connector-client',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '1.0.0',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '9m',
				memory: '315Mi',
				memory_limits: 'NotSet',
				pod_name: 'connectivity-567bd66d9-t85vt',
				pod_restart_count: '1',
			},
			name: 'connectivity',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.9.1',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: '1',
				cpu_requests: '4m',
				memory: '213Mi',
				memory_limits: '512Mi',
				pod_name: 'control-plane-connector-sdp-connector-client-6dc84589d7-76s7q',
				pod_restart_count: '1',
			},
			name: 'sdp-connector-client',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '1.0.0',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: '1',
				cpu_requests: '4m',
				memory: '189Mi',
				memory_limits: '512Mi',
				pod_name: 'data-plane-connector-sdp-connector-client-845854dcf-wqrmb',
				pod_restart_count: '2',
			},
			name: 'sdp-connector-client',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '1.0.0',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '1m',
				memory: '231Mi',
				memory_limits: 'NotSet',
				pod_name: 'device-management-76b9b8f6b6-llcj8',
				pod_restart_count: '0',
			},
			name: 'device-management',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.9.9',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '1m',
				memory: '758Mi',
				memory_limits: 'NotSet',
				pod_name: 'ie-commonapi-76cc96f56-s6d7l',
				pod_restart_count: '1',
			},
			name: 'ie-commonapi',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.9.1',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '35m',
				memory: '1036Mi',
				memory_limits: 'NotSet',
				pod_name: 'ie-kafka-0',
				pod_restart_count: '2',
			},
			name: 'kafka',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.5.4',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '1m',
				memory: '200Mi',
				memory_limits: 'NotSet',
				pod_name: 'ie-ui-6f9f777d45-lnvpx',
				pod_restart_count: '1',
			},
			name: 'ie-ui',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.9.1',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '4m',
				memory: '366Mi',
				memory_limits: 'NotSet',
				pod_name: 'ie-zookeeper-0',
				pod_restart_count: '1',
			},
			name: 'zookeeper',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '1.0.0',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '1m',
				memory: '352Mi',
				memory_limits: 'NotSet',
				pod_name: 'ieupgrade-769f46c5b7-vfgbx',
				pod_restart_count: '1',
			},
			name: 'ieupgrade',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.9.1',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '2m',
				memory: '530Mi',
				memory_limits: 'NotSet',
				pod_name: 'keycloak-0',
				pod_restart_count: '1',
			},
			name: 'keycloak',
			status: 'ContainerCreation',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '4.8.0',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '3m',
				memory: '20Mi',
				memory_limits: 'NotSet',
				pod_name: 'metric-metrics-server-556dfbd44d-m54fq',
				pod_restart_count: '0',
			},
			name: 'metrics-server',
			status: 'Pending',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '2.8.2',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '2m',
				memory: '174Mi',
				memory_limits: 'NotSet',
				pod_name: 'nfs-provider-nfs-server-provisioner-0',
				pod_restart_count: '1',
			},
			name: 'nfs-server-provisioner',
			status: 'PodInitializing',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.2.0',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '5m',
				memory: '288Mi',
				memory_limits: 'NotSet',
				pod_name: 'nginx-ingress-controller-587787847d-dl6dq',
				pod_restart_count: '1',
			},
			name: 'nginx-ingress',
			status: 'FakeStatus',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.9.1',
		},
		{
			additional_details: {
				container_ready: 'false',
				cpu_limits: 'NotSet',
				cpu_requests: '1m',
				error: 'Back-off 5m0s restarting failed container=' +
					'nginx-ingress pod=nginx-ingress-default-backend-69b9c8f8f5-x9kbg' +
					'_default(ddfe85a3-9e05-11e9-bff9-005056bef458)',
				memory: '5Mi',
				memory_limits: 'NotSet',
				pod_name: 'nginx-ingress-default-backend-69b9c8f8f5-x9kbg',
				pod_restart_count: '1',
			},
			name: 'nginx-ingress',
			status: 'Error',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.9.1',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: 'NotSet',
				cpu_requests: '4m',
				memory: '134Mi',
				memory_limits: 'NotSet',
				pod_name: 'postgresql-postgresql-0',
				pod_restart_count: '1',
			},
			name: 'postgresql',
			status: 'Stopped',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.9.1',
		},
		{
			additional_details: {
				container_ready: 'false',
				error: 'Back-off 5m0s restarting failed container=' +
					'protoactivebridge pod=protoactivebridge-797bf94745-wk8q4' +
					'_default(ddfe85a3-9e05-11e9-bff9-005056bef458)',
				pod_name: 'protoactivebridge-797bf94745-wk8q4',
				pod_restart_count: '429',
			},
			name: 'protoactivebridge',
			status: 'CrashLoopBackOff',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '0.9.9',
		},
		{
			additional_details: {
				container_ready: 'true',
				cpu_limits: '1',
				cpu_requests: '5m',
				memory: '129Mi',
				memory_limits: '512Mi',
				pod_name: 'sdp-control-proxy-78dc478f5f-t8445',
				pod_restart_count: '2',
			},
			name: 'sdp-control-proxy',
			status: 'Running',
			timestamp: 'Fri Jul 05 10:50:00 GMT 2019',
			type: 'Application',
			version: '1.1.0',
		},
	],
	dnac_details: [
		{
			name: '172.21.137.122_DNAC',
			status: 'Reachable',
			timestamp: 'Mon Jul 15 21:45:00 GMT 2019',
			type: 'DNAC Controller',
			version: '1.2.10',
		},
		{
			name: 'dnacLoad',
			status: 'Reachable',
			timestamp: 'Mon Jul 15 21:45:00 GMT 2019',
			type: 'DNAC Controller',
			version: '1.2.10',
		},
		{
			additional_details: {
				error: 'Failed to fetch DNAC communication status',
			},
			status: 'Unreachable',
			timestamp: 'Mon Jul 15 21:45:00 GMT 2019',
			type: 'DNAC Controller',
			version: '1.2.10',
		},
	],
	ie_version: '0.9.1',
	ieStatus: 'Running',
	remote_id: 'c1678010-759e-478f-bd47-d0ef8c53c9b8',
	system_details: {
		hardware_details: {
			cpu_utilization: '41.4%',
			free_hdd_size: '519G',
			free_memory: '22065MB',
			hdd_size: '536G',
			total_cpu: '12',
			total_memory: '32163MB',
		},
		os_details: {
			containerRuntimeVersion: 'docker://18.6.1',
			kernelVersion: '4.15.0-50-generic',
			kubeletVersion: 'v1.11.8',
			kubeProxyVersion: 'v1.11.8',
			machineID: 'fff381ea4de44c52b2d513d019a07c32',
			operatingSystem: 'linux',
			osImage: 'Ubuntu 18.04.2 LTS',
			systemUUID: '564D94B6-3111-127C-C6EA-4219F9561605',
		},
	},
};

/**
 * Mock body of results where dnac is unreachable is first result in dnac_details
 */
const dnacUnreachableMockData: IEHealthStatusResponseModel = JSON.parse(JSON.stringify(mockData));
dnacUnreachableMockData.dnac_details[0] = dnacUnreachableMockData.dnac_details[2];

/**
 * The scenarios
 */
export const HealthStatusScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Call to get health-status',
					response: {
						body: [mockData],
						status: 200,
					},
					selected: true,
				},
				{
					delay: 30,
					description: 'Call to get health-status (dnac unreachable)',
					response: {
						body: [dnacUnreachableMockData],
						status: 200,
					},
					selected: true,
				},
				{
					delay: 30,
					description: 'Health-Status - Failure',
					response: {
						body: '',
						status: 500,
					},
					selected: false,
				},
			],
		},
		url: api,
		usecases: ['Admin Settings', 'General'],
	},
];
