import BaseRepository from "../../../core/base/base.repository.js";
import CartItem from "../models/cartItem.model.js";
import Product from "../../product/models/product.model.js";
import Color from "../../product/models/color.model.js";
import Size from "../../product/models/size.model.js";
import ProductColors from "../../product/models/product-colors.model.js";
import ProductSizes from "../../product/models/product-sizes.model.js";

export default class CartItemRepository extends BaseRepository {
    constructor() {
        super(CartItem);
    }

    findByCartIdAndProductVariant = async (cartId, productId, colorId = null, sizeId = null, options = {}) => {
        return this.model.findOne({
            where: {
                cart_id: cartId,
                product_id: productId,
                ...(colorId ? { color_id: colorId } : {}),
                ...(sizeId ? { size_id: sizeId } : {})
            },
            ...options
        });
    };

    checkProductVariantStock = async (productId, colorId, sizeId, quantity, transaction) => {
        const product = await Product.findByPk(productId, { transaction });
        if (!product) {
            throw new Error("Product not found");
        }

        // Renk ve beden varyasyonlarını kontrol et
        if (colorId && sizeId) {
            // Eğer renk ve beden kombinasyonu varsa
            const colorVariant = await ProductColors.findOne({
                where: {
                    product_id: productId,
                    color_id: colorId
                },
                transaction
            });

            const sizeVariant = await ProductSizes.findOne({
                where: {
                    product_id: productId,
                    size_id: sizeId
                },
                transaction
            });

            // Varyasyon stok kontrolü
            if (!colorVariant || !sizeVariant) {
                throw new Error("Product variant combination not available");
            }

            // Burada renk ve beden kombinasyonuna özgü bir stok kontrolü olabilir
            // Örneğin: Kırmızı renk XL beden için ayrı bir stok değeri
            // Şu an için basitlik açısından ana ürün stoğunu kontrol ediyoruz
            if (product.stock < quantity) {
                throw new Error("Not enough stock available");
            }
        } else if (colorId) {
            // Sadece renk varyasyonu
            const colorVariant = await ProductColors.findOne({
                where: {
                    product_id: productId,
                    color_id: colorId
                },
                transaction
            });

            if (!colorVariant) {
                throw new Error("Product color not available");
            }

            if (product.stock < quantity) {
                throw new Error("Not enough stock available");
            }
        } else if (sizeId) {
            // Sadece beden varyasyonu
            const sizeVariant = await ProductSizes.findOne({
                where: {
                    product_id: productId,
                    size_id: sizeId
                },
                transaction
            });

            if (!sizeVariant) {
                throw new Error("Product size not available");
            }

            if (product.stock < quantity) {
                throw new Error("Not enough stock available");
            }
        } else {
            // Varyasyon yoksa direkt ürün stok kontrolü
            if (product.stock < quantity) {
                throw new Error("Not enough stock available");
            }
        }

        return product;
    };

    addToCart = async (cartId, productId, quantity, colorId = null, sizeId = null, transaction) => {
        // Ürün ve varyasyon stok kontrolü
        const product = await this.checkProductVariantStock(
            productId, colorId, sizeId, quantity, transaction
        );

        // Aynı ürün varyasyonu sepette var mı kontrol et
        const existingItem = await this.findByCartIdAndProductVariant(
            cartId, productId, colorId, sizeId, { transaction }
        );

        if (existingItem) {
            // Miktar güncelleme
            const newQuantity = existingItem.quantity + quantity;

            // Yeni miktar için stok kontrolü
            await this.checkProductVariantStock(
                productId, colorId, sizeId, newQuantity, transaction
            );

            return this.update(
                existingItem.id,
                {
                    quantity: newQuantity,
                    total_price: product.price * newQuantity
                },
                { transaction }
            );
        } else {
            // Yeni sepet ürünü oluştur
            return this.create(
                {
                    cart_id: cartId,
                    product_id: productId,
                    color_id: colorId,
                    size_id: sizeId,
                    quantity: quantity,
                    unit_price: product.price,
                    total_price: product.price * quantity
                },
                { transaction }
            );
        }
    };

    updateQuantity = async (itemId, quantity, transaction) => {
        const item = await this.findById(itemId, { transaction });
        if (!item) {
            throw new Error("Cart item not found");
        }

        return this.update(
            itemId,
            {
                quantity: quantity,
                total_price: item.unit_price * quantity
            },
            { transaction }
        );
    };

    getCartItems = async (cartId, options = {}) => {
        return this.model.findAll({
            where: { cart_id: cartId },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'stock', 'slug']
                }
            ],
            ...options
        });
    };

    deleteByCartIdAndProductId = async (cartId, productId, transaction) => {
        return this.model.destroy({
            where: {
                cart_id: cartId,
                product_id: productId
            },
            transaction
        });
    };

    deleteAllByCartId = async (cartId, transaction) => {
        return this.model.destroy({
            where: { cart_id: cartId },
            transaction
        });
    };
}