/*  tslint:disable */
export interface IParamType {
    collectionId ?: string;
    customerId ?: string;
    page ?: number;
    pageSize ?: number;
    searchText ?: string;
	deviceCompliance ?: string;
	deviceIp ?: string;
    body ?: Array<string>;
    filterBy ?: string;
    useCase ? : string;
  }

  /**
   * Parameters for getAssets
   */
  export interface ArchitectureAssetsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * The serial number of the device
     */
    serialNumber?: Array<string>;

    /**
     * Searchable field - title. Applied only when the length of this parameter is more than 3 characters.
     */
    search?: string;

    /**
     * Number of rows of data per page
     */
    rows?: number;

    /**
     * The device role
     */
    role?: Array<string>;

    /**
     * The page number of the response
     */
    page?: number;
    managedNeId?: Array<string>;

    /**
     * A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastDateOfSupportRange till particular date. Use <fromDateInMillis> format to filter advisories having lastDateOfSupportRange from a particular date.
     */
    lastDateOfSupportRange?: Array<string>;
    hwInstanceId?: Array<string>;

    /**
     * Activates filter on assets having security advisories. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasSecurityAdvisories?: string;

    /**
     * Activates filter on assets having field notices. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasFieldNotices?: string;

    /**
     * Activates filter on assets having bugs. If multiple of these attributes are provided,  the last value would be considered. Values "true" or "1" are considered as boolean value  "True" and any other value is considered false. This filter is activated is attribute is present.
     */
    hasBugs?: string;

    /**
     * The coverage
     */
    coverage?: Array<'covered' | 'uncovered' | 'unknown' | 'expired'>;

    /**
     * The contract numbers
     */
    contractNumber?: Array<string>;

    collectionId?: string;
  }
