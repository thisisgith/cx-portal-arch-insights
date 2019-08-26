import { CPProductFamily } from "./product-family";

/**
 * List of product families
 */
export interface ProductFamiliesList{
    customerId: string;
    productFamily: Array<CPProductFamily>;
}
