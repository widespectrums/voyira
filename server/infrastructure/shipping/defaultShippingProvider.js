import ShippingProviderInterface from "./shippingProviderInterface.js";

/**
 * Default shipping provider implementation
 * Uses static rates defined in the database
 */
export default class DefaultShippingProvider extends ShippingProviderInterface {
    constructor(shippingMethodRepository) {
        super();
        this.repository = shippingMethodRepository;
    }

    async getShippingRates(shipmentData) {
        try {
            const { orderTotal } = shipmentData;

            // Get all active shipping methods
            const methods = await this.repository.findAllActive();

            // Transform shipping methods to rate options
            return methods.map(method => {
                let cost = method.base_fee;

                // Apply free shipping if threshold is met
                if (method.free_shipping_threshold && orderTotal >= method.free_shipping_threshold) {
                    cost = 0;
                }

                return {
                    id: method.id,
                    name: method.name,
                    description: method.description,
                    cost: cost,
                    estimated_days: '1-3', // Default for the basic provider
                };
            });
        } catch (error) {
            console.error("Error getting shipping rates:", error);
            throw error;
        }
    }

    async createShipment(shipmentData) {
        // For the default provider, we just return a mock shipment
        // In a real implementation, this would create an actual shipment with a carrier
        return {
            id: `SHIP-${Date.now()}`,
            tracking_number: `TRK${Math.floor(Math.random() * 1000000)}`,
            label_url: null,
            status: 'created',
            created_at: new Date(),
        };
    }

    async trackShipment(trackingNumber) {
        // For the default provider, we return mock tracking information
        return {
            tracking_number: trackingNumber,
            status: 'in_transit',
            estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            tracking_events: [
                {
                    timestamp: new Date(),
                    status: 'in_transit',
                    description: 'Package is in transit',
                    location: 'Distribution Center',
                }
            ],
        };
    }

    async cancelShipment(shipmentId) {
        // For the default provider, we just return success
        return true;
    }

    async validateAddress(address) {
        // For the default provider, we just return the address as is
        return {
            valid: true,
            normalized_address: address,
        };
    }
}