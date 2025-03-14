/**
* Interface for shipping providers
* All shipping providers must implement these methods
*/
export default class ShippingProviderInterface {
    /**
     * Get shipping rates for a shipment
     * @param {Object} shipmentData - Data required for calculating rates
     * @returns {Promise<Array>} - Array of rate options
     */
    getShippingRates(shipmentData) {
        throw new Error("Method 'getShippingRates' must be implemented.");
    }

    /**
     * Create a shipment with the provider
     * @param {Object} shipmentData - Shipment details
     * @returns {Promise<Object>} - Created shipment details
     */
    createShipment(shipmentData) {
        throw new Error("Method 'createShipment' must be implemented.");
    }

    /**
     * Track a shipment
     * @param {string} trackingNumber - Tracking number
     * @returns {Promise<Object>} - Tracking information
     */
    trackShipment(trackingNumber) {
        throw new Error("Method 'trackShipment' must be implemented.");
    }

    /**
     * Cancel a shipment
     * @param {string} shipmentId - ID of the shipment to cancel
     * @returns {Promise<boolean>} - Success status
     */
    cancelShipment(shipmentId) {
        throw new Error("Method 'cancelShipment' must be implemented.");
    }

    /**
     * Validate an address
     * @param {Object} address - Address to validate
     * @returns {Promise<Object>} - Validated address information
     */
    validateAddress(address) {
        throw new Error("Method 'validateAddress' must be implemented.");
    }
}
