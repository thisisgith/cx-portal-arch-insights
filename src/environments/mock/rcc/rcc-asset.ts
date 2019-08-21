
import { RccAssetFilterResponse,RccAssetDetails } from '@sdp-api';

/** Base of URL for SDP API */

const api = '/compliance/v1';
/** Default Customer ID */
const customerId = '90019449';

/** Default Serial Number */
const serialNumber = 'FCW2246E0PB';

/** getAssetSummaryData Params */
const svParams = '&pageIndex=1&pageSize=10&serialNumber=serialNumber&sortBy=asc';
/** getRccAssetFilterData params */
const assetFilterParams = 'customerId=customerId&pageIndex=1&pageSize=10&serialNumber=serialNumber&sortBy=asc&policyGroupName=&policyName=&severity=';
/** The mock response for allCrashDetails */
const assetPolicyFilterInfo: any = {
//  const assetPolicyFilterInfo = {
    data: {
        customerid: '90019449',
        policygroupname: [
            'PCI',
            'HIPAA',
        ],
        policyname: [
            'Terminal Access [ IOS-XE ]',
            'AAA Authentication - Login [ IOS-XE ]',
            'NTP Configuration [ IOS-XE ]',
            'Console Access [ IOS-XE ]',
            'AAA Accounting - Network [ IOS-XE ]',
        ],
        rulehighseverity: [
            'P3',
            'P1',
            'P2',
            'P5',
        ],
        serialnumber: 'FOC2246Z0MU',
    },
    //error: null,
    message: 'SUCCESS',
    status: '200',
};

const assetViolationSummaryTableData :any  ={
    "status": "200",
"message": "SUCCESS",
error:null,
data: {
    "hostName": "border_2.dnaauto.cisco.com",
    violation: [
        {
            "policyGroupPolicyRuleId": "HIPAA_IOS_XE_GROUP__Terminal_Access__IOSXE___Check_the_Maximum_Idle_Timeout_Minutes_allowed_on_terminal_lines__IOSXE_",
            "policyGroup": "HIPAA",
            "policyName": "Terminal Access [ IOS-XE ]",
            "policyDesc": "This policy checks for various access controls that need to be put in place to restrict access to the network device's command line. One primary mechanism for remote administration of Cisco routers is logging in via Telnet or SSH. These connections are called virtual terminal lines. Login on the virtual terminal lines should be disabled if remote administration is not absolutely necessary. Remote administration without encryption is inherently dangerous because anyone with a network sniffer on the right LAN segment can acquire router passwords and would then be able to take control of the router.",
            "ruleName": "Check the Maximum Idle Timeout (Minutes) allowed on terminal lines [ IOS-XE ]",
            "ruleDesc": "Each terminal line should be configured with some type of authentication for logging on the device, failing to do so can enable an unauthorized user to gain device access. This rule checks other miscellaneous authentication parameters on the terminal lines including session time out, maximum default privilege level configured and any access restrictions on the terminal lines.",
            "ruleSeverity": "P3",
            "violationCount": 1,
            conditionList: [
                {
                    "conditionCount": 1,
                    "message": "Exec timeout is not defined for <C2.1> <C2.2> <C2.3> line/s. It should be 20",
                    "suggestedFix": "",
                    "age": 0,
                    "severity": "P3"
                }
            ]
        }]
        }
}

/** The scenarios */
export const RCCScenarios = [
    {
        scenarios: {
            GET: [
                {
                    delay: 100,
                    description: 'AssetFilterSummary',
                    response: {
                        body: assetPolicyFilterInfo,
                        status: 200,
                    },
                    selected: true,
                },
            ],
        },
        url: `https://violationaudit.sdp11-idev.csco.cloud/compliance/violationaudit/api/fetch-violation-details-filter/${assetFilterParams}`,
        usecases: ['Use Case 1'],
    },{
        scenarios: {
            GET: [
                {
                    delay: 100,
                    description: 'AssetViolationSummary',
                    response: {
                        body: assetViolationSummaryTableData,
                        status: 200,
                    },
                    selected: true,
                },
            ],
        },
        url: `https://violationaudit.sdp11-idev.csco.cloud/compliance/violationaudit/getAssetSummaryData/${assetFilterParams}`,
        usecases: ['Use Case 2'],
    },
    
];


