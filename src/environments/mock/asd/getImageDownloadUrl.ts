/* tslint:disable */
/** base API */
const api = '/software/preview/v3.0/downloads/udi/PID%3A+CAAPL-BCSP-1.0-K9VID%3A+V01%2C+' +
	'SN%3A+00000001/mdf_id/286324649/metadata_trans_id/1178782699/image_guids/' +
	'68C7706DB6C727B4C70B0D5F4EFFFF64EDD5C1C8';

/**
 * Mock body of results for successful DNAC call
 */
const mockData1  = {
    "asd_download_acceptance_exception": [
        {
            "acceptance_form": {
                "eula_form_details": null,
                "k9_form_details_response": {
                    "acceptance_web_form_url": "https://software.cisco.com/download/k9",
                    "form_details_type": {
                        "field_details": [
                            {
                                "child_field_details_type": [],
                                "field_display_name": null,
                                "field_display_value": null,
                                "field_id": "Status_Code",
                                "field_name": "Status_Code",
                                "field_type": null,
                                "field_value": "K9_ACCEPTANCE_REQUIRED",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": null,
                                "field_display_value": null,
                                "field_id": "Status_Message",
                                "field_name": "Status_Message",
                                "field_type": null,
                                "field_value": "User needs to accept K9",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "k9FormContent",
                                "field_display_value": null,
                                "field_id": "k9FormContent",
                                "field_name": "k9FormContent",
                                "field_type": "read_only",
                                "field_value": "<HTML>\n\n\n<DIV class=\"Section1\" style=\"margin-left:10px;margin-right:15px;margin-bottom:10px;\">\n\t<TABLE class=\"MsoNormalTable\" border=\"0px\" style=\"WIDTH: 100%\" cellSpacing= \"0\" cellPadding=\"0\" width=\"100%\" >\n\t\t<TBODY>\n\t\t<TR>\n\t\t<TD style=\"PADDING-RIGHT: 0.75pt; PADDING-LEFT: 0.75pt; PADDING-BOTTOM: 0.75pt; PADDING-TOP: 0pt\" border=\"0\" colSpan=\"2\">\n\t\t\t\t<P class=\"contenttitle\">\n\t\t\t\t<SPAN style=\"FONT-SIZE: 12px; FONT-FAMILY: Arial\">Instructions</SPAN>\n\n\t\t\t\t</P>\n\t\t\t\t<P>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px;COLOR:black;FONT-FAMILY:Arial\">\n\t\t\t\tTo apply for eligibility to download strong encryption software images:\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\t\t\t\t<P class=\"MsoNormal\" style=\"MARGIN-LEFT:0.5in; TEXT-INDENT:-0.25in\">\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\t1.\n\t\t\t\t<SPAN style=\"FONT:7pt'Arial'\">\n\n\t\t\t\t      \n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tEnsure the address listed in your \n\t\t\t\t<A href=\"https://tools.cisco.com/RPF/profile/edit_entitlement.do?Tab=3\" target=\"_blank\">Cisco.com User Profile</A> is correct and complete.\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\t\t\t\t<P class=\"MsoNormal\" style=\"MARGIN-LEFT: 0.5in; TEXT-INDENT: -0.25in\">\n\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\t2.\n\t\t\t\t<SPAN style=\"FONT: 7pt 'Arial'\">\n\t\t\t\t      \n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN class=contentbold1>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\tRead each of the\n\t\t\t\t</SPAN>\n\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN class=contentbold1>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: red; FONT-FAMILY: Arial\">\n\t\t\t\tconditions\n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN class=contentbold1>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\tbelow carefully\n\t\t\t\t</SPAN>\n\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN class=contentbold1>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: red; FONT-FAMILY: Arial\">\n\t\t\t\tprior to selecting your answer.\n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\n\t\t\t\t<P class=\"MsoNormal\" style=\"MARGIN-LEFT: 0.5in; TEXT-INDENT: -0.25in\">\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\t3.\n\t\t\t\t<SPAN style=\"FONT: 7pt 'Arial'\">\n\t\t\t\t      \n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tType your full name in the field provided.\n\t\t\t\t</SPAN>\n\n\t\t\t\t</P>\n\t\t\t\t<P class=\"MsoNormal\" style=\"MARGIN-LEFT: 0.5in; TEXT-INDENT: -0.25in\">\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\t4.\n\t\t\t\t<SPAN style=\"FONT: 7pt 'Arial'\">\n\t\t\t\t      \n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\n\t\t\t\tSubmit this form.\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\t\t\t\t<DIV class=\"MsoNormal\" style=\"TEXT-ALIGN: center\" align=\"center\">\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\t\t<HR align=\"center\" width=\"100%\" SIZE=\"2\">\n\t\t\t\t\t</SPAN>\n\t\t\t\t</DIV>\n\t\t\t\t<P class=\"contenttitle\">\n\n\t\t\t\t<SPAN style=\"FONT-SIZE:15px; FONT-FAMILY: Arial\">\n\t\t\t\tConditions</SPAN></P>\n\t\t\t</TD>\n\t\t</TR>\n\n\t\t<TR>\n\t\t\t\n\t\t\t<TD style=\"PADDING-RIGHT: 0.75pt; PADDING-LEFT: 0.75pt; PADDING-BOTTOM: 0.75pt; PADDING-TOP: 0.75pt\">\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<SPAN class=contentbold1>\n\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\t1.\n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\tCisco software images are subject to United States (U.S.) national security, foreign policy, anti-terrorism laws, export regulations and other national local laws.\n\t\t\t\t</SPAN>\n\n\t\t\t\t</P>\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\t</SPAN>\n\t\t\t\t \n\t\t\t\t</P>\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\tI agree to secure Cisco software images in a manner that prevents unauthorized access or transfer. Certain persons, countries or entities may require a U.S. export license in order to obtain restricted Cisco images. Detailed information regarding compliance with U.S. use, export, re-exports, and transfer laws may be found at:\n\t\t\t\t<SPAN style=\"COLOR: #3366ff\">\n\n<A title=\"http://www.cisco.com/wwl/export/compliance_provision.html\n\nhttp://www.cisco.com/wwl/export/compliance_provision.html\" href=\"http://www.cisco.com/wwl/export/compliance_provision.html\" target=\"_blank\">\n\t\t\t\t<SPAN style=\"COLOR: #3366ff\">\n\t\t\t\thttp://www.cisco.com/wwl/export/compliance_provision.html\n\t\t\t\t</SPAN>\n\t\t\t\t</A>\n\t\t\t\t</SPAN>\n\t\t\t\t. The lists of restricted entities is available at: \n<A title=\"http://www.bis.doc.gov/ComplianceAndEnforcement/ListsToCheck.htm\n\nhttp://www.bis.doc.gov/ComplianceAndEnforcement/ListsToCheck.htm\"\nhref=\"http://www.bis.doc.gov/ComplianceAndEnforcement/ListsToCheck.htm\" target=\"_blank\">http://www.bis.doc.gov/ComplianceAndEnforcement/ListsToCheck.htm</A> \n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\t</SPAN>\n\t\t\t\t \n\t\t\t\t</P>\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\tI shall not electronically or physically transfer Cisco software images to any unauthorized persons, countries or entities, identified at the aforementioned web pages, without first obtaining required export authorizations or licenses from the U.S. and any local governments.\n\t\t\t\t</SPAN>\n\n\t\t\t\t</P>\n\t\t\t</TD>\n\t\t</TR>\n\n\t\t<TR>\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\" colSpan=\"2\"></TD>\n\t\t</TR>\n\n\n\t\t<TR>\n\n\t\t\t\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\">\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<SPAN class=contentbold1>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\t2.\n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tI am not on any of the following U.S. denied persons lists:\n\t\t\t\t</SPAN>\n\n\t\t\t\t</P>\n<div style=\"margin-left:25px;\">\t\n\t\t\t\t<UL type=\"disc\">\n\t\t\t\t\t<LI class=\"MsoNormal\" style=\"COLOR: black\">\n\t\t\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t<A href=\"javascript:sitewide_toolkit_window('http://www.bis.doc.gov/dpl/Default.shtm','help_window')\" target=\"_blank\">Table of Denial Orders</A>(U.S.\n\tDepartment of Commerce)</SPAN>\n\t\t\t\t\t<LI class=\"MsoNormal\" style=\"COLOR: black\">\n\t\t\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t<A href=\"javascript:sitewide_toolkit_window('http://www.ustreas.gov/ofac/','help_window')\" target=\"_blank\">Specially Designated Nationals List</A> (U.S. Department of Treasury, Office of Foreign Assets Controls (OFAC))\n\t\t\t\t\t\t</SPAN>\n\n\t\t\t\t\t<LI class=\"MsoNormal\" style=\"COLOR: black\">\n\t\t\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t<A href=\"javascript:sitewide_toolkit_window('http://www.state.gov','help_window')\" target=\"_blank\">Debarred List</A> (U.S. Department of State)\n\t\t\t\t\t\t</SPAN>\n\t\t\t\t\t</LI>\n\t\t\t\t</UL></div>\t\n\t\t\t</TD>\n\t\t</TR>\n\t\t<TR>\n\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\" colSpan=\"2\"></TD>\n\t\t</TR>\n\n\t\t<TR>\n\t\t\t\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\">\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<SPAN class=contentbold1>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\t3.\n\t\t\t\t</SPAN>\n\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tI agree to abide by all\n\t\t\t\t<A href=\"http://www.cisco.com/wwl/export/crypto/index.html#advisory\" target=\"_blank\">export, import, use</A>, and development and/or re-export laws in the country in which I reside. I understand and agree that Cisco Systems, Inc. is not responsible for the recipient's failure to abide by any such law.\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\t\t\t</TD>\n\t\t</TR>\n\t\t<TR>\n\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\" colSpan=\"2\"></TD>\n\t\t</TR>\n\t\t<TR>\n\t\t\t\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\">\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<SPAN class=contentbold1>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\t4.\n\t\t\t\t</SPAN>\n\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tI agree to\n\t\t\t\t<A href=\"mailto:export@cisco.com\">contact Cisco's Export Compliance and Regulatory Affairs group</A> if I know or have reason to believe that another party has or intends to violate U.S. export laws or local country export laws.\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\t\t\t</TD>\n\t\t</TR>\n\t\t<TR>\n\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\" colSpan=\"2\"></TD>\n\t\t</TR>\n\n\t\t<TR>\n\t\t\t\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\">\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<span class=\"contentbold1\"><a name=\"7\">\n\t\t\t\t<span style=\"FONT-SIZE:11px; font-family: Arial\">5</span></a></span><A name=\"7\">\n\t\t\t\t<SPAN class=contentbold1>\n\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">.\n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t</A>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tI will not knowingly transfer (physically or electronically)\n\t\t\t\t</SPAN><SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\"><A href=\"http://www.cisco.com/wwl/export/crypto/tool/definitions.html#crypto\" target=\"_blank\">\n\t\t\t\tstrong encryption</A></SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">images to</SPAN>\n\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\"><A href=\"javascript:sitewide_toolkit_window('http://www.bis.doc.gov/dpl/Default.shtm','help_window')\" target=\"_blank\">\n\t\t\t\tdenied persons,\n\t\t\t\t</A></SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\"><A href=\"http://www.cisco.com/wwl/export/compliance_provision.html#entities\" target=\"_blank\">\n\t\t\t\tsanctioned entities, territories, or uses</A></SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">without ensuring compliance with U.S. and local laws and regulations.\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\t\t\t</TD>\n\n\t\t</TR>\n\t\t<TR>\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\" colSpan=\"2\"></TD>\n\t\t</TR>\n\n\t\t<TR>\n\t\t\t\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\">\n\t\t\t\t<P>\n\t\t\t\t<SPAN class=contentbold1>\n\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\t6.\n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tI will not knowingly transfer (physically or electronically)\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\"><A href=\"http://www.cisco.com/wwl/export/crypto/tool/definitions.html#crypto\" target=\"_blank\">\n\t\t\t\tstrong encryption</A></SPAN>\n\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\timages to, or for,\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\"><A href=\"http://www.cisco.com/wwl/export/crypto/tool/definitions.html#government\" target=\"_blank\">\n\t\t\t\tgovernment organizations/enterprises</A></SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tother than those of, or in:\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\n\t\t\t\t<P>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tAustria, Australia, Belgium, Canada, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Japan, Latvia, Lithuania, Luxembourg, Malta, Netherlands, New Zealand, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland, United Kingdom,United States.\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\t\t\t\t<P>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\twithout written authorization\n\t\t\t\t</SPAN>\n\t\t\t\t<A href=\"mailto:export@cisco.com\">\n\n<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">from Cisco Systems, Inc</SPAN>\n\t\t\t\t</A>\n<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">. and/or the governments of the United States, United Kingdom, and The Netherlands.</SPAN>\n\t\t\t\t</P>\n\t\t\t</TD>\n\t\t</TR>\n\n\t\t<TR>\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\" colSpan=\"2\"></TD>\n\n\t\t</TR>\n\n\t\t<TR>\n\t\t\t\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\">\n\t\t\t\t<P>\n\t\t\t\t<SPAN class=contentbold1>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t\t\t\t7.\n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tI will not supply network services (e.g., running a virtual private network) to, or for\n\t\t\t\t<A href=\"http://www.cisco.com/wwl/export/crypto/tool/definitions.html#government\" target=\"_blank\">government organizations/enterprises</A> other than those of, or in:\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\t\t\t\t<P>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tAustria, Australia, Belgium, Canada, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Japan, Latvia, Lithuania, Luxembourg, Malta, Netherlands, New Zealand, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland, United Kingdom,United States.\n\t\t\t\t</SPAN>\n\n\t\t\t\t</P>\n\t\t\t\t<P>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\twithout written authorization <A href=\"mailto:export@cisco.com\">from Cisco Systems, Inc.</A> and/or the governments of the U.S., United Kingdom, and The Netherlands.\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\t\t\t</TD>\n\t\t</TR>\n\n\t\t<TR>\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\" colSpan=\"2\"></TD>\n\t\t</TR>\n\n\t\t<TR>\n\t\t\t\n\t\t\t<TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\">\n\t\t\t\t<P class=\"MsoNormal\">\n\t\t\t\t<SPAN class=contentbold1>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\n\t\t\t\t8.\n\t\t\t\t</SPAN>\n\t\t\t\t</SPAN>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t\tI agree to notify consignee and end-user of conditions <b>4, 5, \n\t\t\t\t6</b> & <b>7</b>above.\n\t\t\t\t</SPAN>\n\t\t\t\t</P>\n\n\t\t\t</TD>\n\t\t</TR>\n\t\t<TR>\n        <TD style=\"PADDING-RIGHT: 0in; PADDING-LEFT: 0in; PADDING-BOTTOM: 0in; PADDING-TOP: 0in\" >\n              <BR>\n                   <P>\n\t\t\t\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t\t\t    If you are unable to comply with each and every condition as set forth above, please\n\t\t\t\t<A href=\"mailto:export@cisco.com\">contact Regulatory Affairs</A>.\n\t\t\t\t</SPAN>\n\n\t\t\t\t</P>\n            </TD>\n\t\t</TR>\n\t\t</TBODY>\n\t</TABLE>\n\t<P class=\"MsoNormal\">\n\t \n\t</P>\n\n\t<P>\n\t<SPAN class=contentbold1>\n\t<SPAN style=\"FONT-SIZE:15px; FONT-FAMILY: Arial\">\n\tCisco Systems Inc. Encryption Software Usage Handling and Distribution Policy\n\t</SPAN>\n\t</SPAN>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\n\t<BR>\n\t</SPAN>\n\t<SPAN class=contentbold1>\n\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t1.0 Introduction\n\t</SPAN>\n\t</SPAN>\n\t</P>\n\t<P>\n\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tAs a Cisco employee, contractor, or vendor (hereafter personnel) who has a business need to access cryptographic software or documentation, you have entered a controlled and monitored site where that cryptographic software and technical documentation reside. By entering this site you acknowledge Cisco's right to monitor, and according to federal regulations, audit your access device (computer and \n\tnetwork) - and to take such measures as necessary to enforce compliance with the conditions set forth in this agreement.\n\t</SPAN>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tDue to their role in preserving national security and thwarting terrorism, cryptographic enabled software and technical documentation are subject to\n\t<A href=\"http://www.cisco.com/wwl/export/crypto/tool/stqrg.html\" target=\"_blank\">country, user, and use restrictions</A> that vary according to product type (Retail or Non-Retail).\n\t</SPAN>\n\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tTo ensure that we all understand the serious nature of protecting and properly distributing/posting these crypto images, Cisco requires that all personnel, with access to cryptographic enabled software and technical documentation agree to abide by two documents, Cisco's\n\t<SPAN class=subjecthead1>\n<A href=\"https://www.cisco.com/cgi-bin/swc/front.x/Software/Crypto/crypto.cgi#2.0#2.0\" target=\"_blank\">Export, Re-Export, And Transfer\nPolicy</A>, and the\n<A href=\"https://www.cisco.com/cgi-bin/swc/front.x/Software/Crypto/crypto.cgi#3.0#3.0\" target=\"_blank\"> Crypto Image Posting & Handling\nGuidelines.</A>\n\t</SPAN>\n\n\t</SPAN>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t<BR>\n\t<BR>\n\t</SPAN>\n\t<A name=\"2.0\"></A>\n\t<SPAN class=contentbold1>\n\n\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t2.0 Export, Re-Export, and Transfer Policy\n\t</SPAN>\n\t</SPAN>\n\t</P>\n\t<P>\n\t<U>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">Design, Development, and Production Technology</SPAN>\n\t</U>\n\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">Export of design, development, and production technology is subject to national security, foreign policy, and anti-terrorism laws and regulations.</SPAN>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tPersonnel must obtain written authorization from Cisco's Regulatory Affairs group before providing design, development, or production technology to nationals or territories of countries\n\t<A href=\"http://www.cisco.com/wwl/export/compliance_provision.html\" target=\"_blank\">(Contract Compliance Provisions)</A> that have not ratified global weapon non-proliferation treaties. Non-Disclosure Agreements do not constitute written authorization to transfer design, development, or production technology.<BR>\n\n\t<BR>\n\tUse technology and technology that has been made publicly available,\n\t</SPAN>\n\t<SPAN class=contentbold1>\n\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\twith the exception of cryptography\n\t</SPAN>\n\t</SPAN>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t, may be exported to all foreign nationals and territories except those\n\t<A href=\"http://www.cisco.com/wwl/export/compliance_provision.html\" target=\"_blank\">embargoed or sanctioned</A> by the United States.\n\t</SPAN>\n\n\t</P>\n\t<p><span style=\"font-size: 11px; color: black; font-family: Arial;\">\n\t<u>Products & Technology</u></span>\n\t</p>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tUnder no circumstances shall employees or agents engage in marketing, service, or sales of products or technology to \n\t<A href=\"http://www.cisco.com/wwl/export/compliance_provision.html\" target=\"_blank\">embargoed or sanctioned</A> countries or sanctioned territories without written authorization from ECRA.\n\t</SPAN>\n\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tViolation & Suspicious Activities Reporting\n\t</SPAN>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\n\tPersonnel should contact Regulatory Affairs if they know or have reason to believe that any party (e.g. partners, users, personnel) has or intends to violate United States or local country laws or regulations. <BR>\n\t<BR>\n\tIf you would like additional information, visit\n\t<A href=\"http://wwwin.cisco.com/cto/legal/legal_services/final_web/export_compliance/policies.html\" target=\"_blank\">Regulatory Affair's\n\tweb site</A>, or contact the \n\t<A href=\"mailto:export@cisco.com\">team</A> directly.\n\t</SPAN>\n\t</P>\n\t<P class=\"MsoNormal\" style=\"MARGIN-BOTTOM: 12pt\">\n\n\t<A name=\"3.0\"></A>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\t</SPAN>\n\t \n\t</P>\n\t<P>\n\t<SPAN class=contentbold1>\n\t<SPAN style=\"FONT-SIZE:11px; FONT-FAMILY: Arial\">\n\t3.0 Crypto Image Posting & Handling Policy\n\t</SPAN>\n\n\t</SPAN>\n\t</P>\n\t<P>\n\t<U>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">Posting Images</SPAN>\n\t</U>\n\t</P>\n\t<P>\n\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tAccess to crypto images can be obtained only after completing out the required U.S. government form.\n\t</SPAN>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tPersonnel will be authorized to post released and interim cryptographic images only upon completing this form.\n\t</SPAN>\n\t</P>\n\t<P>\n\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tPersonnel will not knowingly deliver crypto images in violation of applicable\n\t<A href=\"http://www.cisco.com/wwl/export/crypto/tool/stqrg.html\" target=\"_blank\">restrictions</A>\n\t</SPAN>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tAs part of the crypto image posting process, personnel must record the recipient's personal/business profile data on the form provided.\n\t</SPAN>\n\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tPersonnel will <B>only use</B> the official\n\t<A href=\"http://www.cisco.com/kobayashi/sw-center/\" target=\"_blank\">Software Download Process</A>, or\n\t<A href=\"https://depot.cisco.com/cgi-bin/SFA/sitepublish.cgi\" target=\"_blank\">Special File Access</A> to provide crypto software images to end-users with export privileges.\n\t</SPAN>\n\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tPersonnel understand that crypto images posted into the special file access area will be deleted at post time +24 hours.\n\t</SPAN>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tPersonnel will not use email as a means of providing cryptographic images.\n\t</SPAN>\n\n\t</P>\n\t<P>\n\t<U>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">Securing Images</SPAN>\n\t</U>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\n\tYou are expected to know and practice your teams' policies regarding hardware and software security.\n\t</SPAN>\n\t</P>\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tInfosec provides Cisco's\n\t<A href=\"http://wwwin.cisco.com/infosec/policies/acceptable_use.html\" target=\"_blank\">Acceptable Use Policy,</A> this policy defines acceptable use of Cisco Systems, Inc. equipment and computing services, and the appropriate employee security measures to protect Cisco's corporate resources and proprietary information.\n\t</SPAN>\n\t</P>\n\n\t<P>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tAs an employee, vendor or contractor,you are responsible to know the processes for completing end-user forms, posting images, and securing crypto images. You are also responsible to keep the images in your control secure. If you do not understand this policy, ask your leads or management for guidance.\n\t</SPAN>\n\t</P>\n\t<P>\n\t<A name=\"export\"></A>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tI understand that violation of either of these policies is grounds for disciplinary action, up to and including termination of employment. There are no exceptions or justifications for any transactions that violate this policy.\n\t</SPAN>\n\n\t</P>\n\t<P>\n\t<B>\n\t<SPAN style=\"FONT-SIZE:11px; COLOR: black; FONT-FAMILY: Arial\">\n\tIf you do not accept this policy, you will not be allowed to have access to cryptographic images.\n\t</SPAN>\n\t</B>\n\t</P>\n\t<P class=\"MsoNormal\">\n\n\t \n\t</P>\n</DIV>\n</HTML>",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "subApp_Version",
                                "field_display_value": null,
                                "field_id": "subApp_Version",
                                "field_name": "subApp_Version",
                                "field_type": "read_only",
                                "field_value": "5",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "Doc_Id",
                                "field_display_value": null,
                                "field_id": "Doc_Id",
                                "field_name": "Doc_Id",
                                "field_type": "read_only",
                                "field_value": "5",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "Doc_Type",
                                "field_display_value": null,
                                "field_id": "Doc_Type",
                                "field_name": "Doc_Type",
                                "field_type": "read_only",
                                "field_value": "html",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "Doc_Mime_Type",
                                "field_display_value": null,
                                "field_id": "Doc_Mime_Type",
                                "field_name": "Doc_Mime_Type",
                                "field_type": "read_only",
                                "field_value": "text/html",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [
                                    {
                                        "child_field_details_type": [],
                                        "field_display_name": "Accept",
                                        "field_display_value": "Accept",
                                        "field_id": null,
                                        "field_name": null,
                                        "field_type": "interactive",
                                        "field_value": "Accepted",
                                        "input_type": "CommandButton"
                                    },
                                    {
                                        "child_field_details_type": [],
                                        "field_display_name": "Decline",
                                        "field_display_value": "Decline",
                                        "field_id": null,
                                        "field_name": null,
                                        "field_type": "interactive",
                                        "field_value": "Declined",
                                        "input_type": "CommandButton"
                                    }
                                ],
                                "field_display_name": null,
                                "field_display_value": null,
                                "field_id": "user_action",
                                "field_name": null,
                                "field_type": "hierarchy",
                                "field_value": null,
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "Confirmation",
                                "field_display_value": "By checking this field, I hereby certify that I, as a duly authorized representative of the organization, understand and agree to abide by the conditions set forth above regarding the usage of Cisco Systems, Inc. hardware and/or software.",
                                "field_id": "Confirmation",
                                "field_name": "Confirmation",
                                "field_type": "interactive",
                                "field_value": "checked",
                                "input_type": "checkbox"
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "User_Label",
                                "field_display_value": null,
                                "field_id": "User_Label",
                                "field_name": "User_Label",
                                "field_type": null,
                                "field_value": "USER DETAILS",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "FIRST_NAME",
                                "field_display_value": "Samuel",
                                "field_id": "givenName",
                                "field_name": "FIRST_NAME",
                                "field_type": null,
                                "field_value": "FirstNameValue",
                                "input_type": "read_only"
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "LAST_NAME",
                                "field_display_value": "Deckard",
                                "field_id": "sn",
                                "field_name": "LAST_NAME",
                                "field_type": null,
                                "field_value": "LastNameValue",
                                "input_type": "read_only"
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "Email",
                                "field_display_value": "tadeckar@cisco.com",
                                "field_id": "mail",
                                "field_name": "Email",
                                "field_type": null,
                                "field_value": "EmailValue",
                                "input_type": "read_only"
                            },
                            {
                                "child_field_details_type": [
                                    {
                                        "child_field_details_type": [],
                                        "field_display_name": "Commercial/Civilian entity",
                                        "field_display_value": null,
                                        "field_id": null,
                                        "field_name": null,
                                        "field_type": null,
                                        "field_value": "COMM_OR_CIVIL",
                                        "input_type": "radioButton"
                                    },
                                    {
                                        "child_field_details_type": [],
                                        "field_display_name": "Government entity, a Military entity or Defense Contractor",
                                        "field_display_value": null,
                                        "field_id": null,
                                        "field_name": null,
                                        "field_type": null,
                                        "field_value": "GOV_OR_MIL",
                                        "input_type": "radioButton"
                                    }
                                ],
                                "field_display_name": "BUS_FUNCTION",
                                "field_display_value": null,
                                "field_id": "BUS_FUNCTION",
                                "field_name": "BUS_FUNCTION",
                                "field_type": null,
                                "field_value": null,
                                "input_type": "interactive"
                            },
                            {
                                "child_field_details_type": [
                                    {
                                        "child_field_details_type": [],
                                        "field_display_name": "Yes",
                                        "field_display_value": null,
                                        "field_id": "Yes",
                                        "field_name": null,
                                        "field_type": null,
                                        "field_value": "Yes",
                                        "input_type": "radioButton"
                                    },
                                    {
                                        "child_field_details_type": [],
                                        "field_display_name": "No",
                                        "field_display_value": null,
                                        "field_id": "No",
                                        "field_name": null,
                                        "field_type": null,
                                        "field_value": "No",
                                        "input_type": "radioButton"
                                    }
                                ],
                                "field_display_name": "GOV_MIL_COUNTRIES",
                                "field_display_value": null,
                                "field_id": "GOV_MIL_COUNTRIES",
                                "field_name": "GOV_MIL_COUNTRIES",
                                "field_type": "interactive",
                                "field_value": "If Government entity, a Military entity or Defense Contractor,  Are you in <br> <br>Austria, Australia, Belgium, Canada, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Japan, Latvia, Lithuania, Luxembourg, Malta, Netherlands, New Zealand, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland, United Kingdom or the United States.",
                                "input_type": null
                            }
                        ]
                    }
                }
            }
        },
        {
            "acceptance_form": {
                "eula_form_details": {
                    "acceptance_web_form_url": "https://software.cisco.com/download/eula",
                    "form_details_type": {
                        "field_details": [
                            {
                                "child_field_details_type": [],
                                "field_display_name": "EULA_CONTENT",
                                "field_display_value": null,
                                "field_id": "EULA_CONTENT",
                                "field_name": "EULA_CONTENT",
                                "field_type": "read_only",
                                "field_value": "In order to download software, Please confirm that you have read \nand agree to be bound by the terms of the &nbsp;\n<a href=http://www.cisco.com/c/en/us/products/end-user-license-agreement.html target=_blank>Cisco End User License Agreement</a> and any\n<a href=http://www.cisco.com/c/en/us/about/legal/cloud-and-software/software-terms.html target=_blank>Supplemental Product Terms,</a> if applicable.\n",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "EULA_DOC_PARAMS",
                                "field_display_value": "EULA_DOC_PARAMS",
                                "field_id": "EULA_DOC_PARAMS",
                                "field_name": "EULA_DOC_PARAMS",
                                "field_type": "read_only",
                                "field_value": "9",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "EULA_LABEL",
                                "field_display_value": "EULA_LABEL",
                                "field_id": "EULA_LABEL",
                                "field_name": "EULA_LABEL",
                                "field_type": null,
                                "field_value": "Cisco's End User Software License Agreement",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [
                                    {
                                        "child_field_details_type": [],
                                        "field_display_name": null,
                                        "field_display_value": null,
                                        "field_id": null,
                                        "field_name": null,
                                        "field_type": "interactive",
                                        "field_value": "Accept",
                                        "input_type": "CommandButton"
                                    },
                                    {
                                        "child_field_details_type": [],
                                        "field_display_name": null,
                                        "field_display_value": null,
                                        "field_id": null,
                                        "field_name": null,
                                        "field_type": "interactive",
                                        "field_value": "Decline",
                                        "input_type": "CommandButton"
                                    }
                                ],
                                "field_display_name": null,
                                "field_display_value": null,
                                "field_id": "user_action",
                                "field_name": null,
                                "field_type": "hierarchy",
                                "field_value": null,
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "subApp_Version",
                                "field_display_value": null,
                                "field_id": "subApp_Version",
                                "field_name": "subApp_Version",
                                "field_type": "read_only",
                                "field_value": "9",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "Status_Code",
                                "field_display_value": null,
                                "field_id": "Status_Code",
                                "field_name": "Status_Code",
                                "field_type": "read_only",
                                "field_value": "EULA_ACCEPTANCE_REQUIRED",
                                "input_type": null
                            },
                            {
                                "child_field_details_type": [],
                                "field_display_name": "Status_Message",
                                "field_display_value": null,
                                "field_id": "Status_Message",
                                "field_name": "Status_Message",
                                "field_type": "read_only",
                                "field_value": "User needs to Accept EULA",
                                "input_type": null
                            }
                        ]
                    }
                },
                "k9_form_details_response": null
            }
        }
    ],
    "asd_service_response_exception": null,
    "download_info_list": [
        {
            "asd_download_url_exception": [
                {
                    "exception_code": "K9_FORM_AR",
                    "exception_message": "K9 form have not been accepted or rejected to continue download."
                },
                {
                    "exception_code": "EULA_FORM_AR",
                    "exception_message": "Eula form have not been accepted or rejected to continue download."
                }
            ],
            "cloud_url": null,
            "download_url": null,
            "image_full_name": "Test_dummy.zip",
            "image_guid": "68C7706DB6C727B4C70B0D5F4EFFFF64EDD5C1C8",
            "token": null
        }
    ],
    "download_retry_id": "1151931304",
    "download_session_id": "1159838637",
    "service_status": "success"
};

const mockData2 = {
	download_session_id: null,
	download_retry_id: '1151932297',
	service_status: 'success',
	asd_service_response_exception: null,
	asd_download_acceptance_exception: [],
	download_info_list: [
		{
			download_url: null,
			image_guid: null,
			image_full_name: null,
			asd_download_url_exception: [
				{
					exception_code: 'MTRANSID_EXPIRED',
					exception_message: 'metadata_trans_id had been previously granted that has expired due to time limit on its validity. Please invoke the metadata service and initiate the download.. ',
				}
			],
			cloud_url: null,
			token: null,
		},
	],
};

const mockData3 = {
	download_session_id: '1159839630',
	download_retry_id: '1151932298',
	service_status: 'success',
	asd_service_response_exception: null,
	asd_download_acceptance_exception: [],
	download_info_list: [
		{
			// download_url:  'https: //dl.cisco.com/pcgi-bin/swdld/download.cgi?dwnld_code' +
			// 	'=xhMnkw8Z-oFltDf3axOpBevQIwhNuMOKDsxTEc2t2pV-kWmprHKHpL_sw' +
			// 	'zsIkRMaK5rZeKt8QjhAx7xyw7oGKDQoZ6-B04shD5gjp1m7z_I0Tw' +
			// 	'CVZ1XhB22eRCABCOU1BTZL41njHvlNfJzExcRNkE3LxQ3yQSGMlyEN3-zeKqk',
			download_url: 'http://engci-maven-master.cisco.com/artifactory/services-cf-insight' +
				'_engine-release/ie/Insight_Engine_1.0/ubuntu/137/CXC_1.0_Build-137.ova',
			image_guid: '68C7706DB6C727B4C70B0D5F4EFFFF64EDD5C1C8',
			image_full_name: 'Test_dummy.zip',
			asd_download_url_exception: [],
			cloud_url: null,
			token: null,
		},
	],
};

/**
 * The scenarios
 */
export const ASDImageDownloadUrlScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Get Image download URL - Needs k9/Eula',
					response: {
						body: mockData1,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 500,
					description: 'Get Image download URL - meta trans id expired',
					response: {
						body: mockData2,
						status: 200,
					},
					selected: false,
				},
				{
					delay: 500,
					description: 'Get Image download URL - criteria met',
					response: {
						body: mockData3,
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: api,
		usecases: ['ASD'],
	},
];
