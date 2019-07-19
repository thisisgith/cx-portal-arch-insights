
const api = "/cparchinsights";
const getAllCBPRules = {"content":[
    {"ruleID":12341,"risk":"High","technology":"SJ-AP-923U","exception":"Rule Summary","recommendation":"SJ-AP-923U","correctiveAction":"Action that users takes","assetsAffected":"49","softwareType":"OS"},
    {"ruleID":12342,"risk":"High","technology":"SJ-AP-923U","exception":"Rule Summary","recommendation":"SJ-AP-923U","correctiveAction":"Action that users takes","assetsAffected":"45","softwareType":"IOS"},
    {"ruleID":12343,"risk":"High","technology":"SJ-AP-923U","exception":"Rule Summary","recommendation":"SJ-AP-923U","correctiveAction":"Action that users takes","assetsAffected":"40","softwareType":"OS"},
    {"ruleID":12344,"risk":"Medium","technology":"SJ-AP-923U","exception":"Rule Summary","recommendation":"SJ-AP-923U","correctiveAction":"Action that users takes","assetsAffected":"49","softwareType":"OS"},
    {"ruleID":12345,"risk":"Medium","technology":"SJ-AP-923U","exception":"Rule Summary","recommendation":"SJ-AP-923U","correctiveAction":"Action that users takes","assetsAffected":"49","softwareType":"IOS"}],
    "pageable":
    {"sort":{"sorted":false,"unsorted":true,"empty":true},
    "pageSize":5,
    "pageNumber":0,
    "offset":0,
    "unpaged":false,
    "paged":true},
    "facets":[],
    "aggregations":null,
    "scrollId":null,
    "maxScore":1.0,
    "totalElements":5,
    "totalPages":1,
    "sort":{"sorted":false,"unsorted":true,"empty":true},
    "last":true,
    "numberOfElements":5,
    "first":true,"size":5,
    "number":0,
    "empty":false}
/** The scenarios */
export const ArchitectureScenarios = [
	// Valid Case Details
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'List CBP Rules',
					response: {
						body: getAllCBPRules,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/getAllCBPRules`,
		usecases: ['Use Case 1'],
	},
	
];
