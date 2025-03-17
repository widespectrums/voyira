import BaseRepository from "../../../core/base/base.repository.js";
import Tag from "../models/tag.model.js";

export default class TagRepository extends BaseRepository {
    constructor() {
        super(Tag);
    };

    findByName(name, options = {}) {
        return this.model.findOne({
            where: { name },
            ...options,
        })
    };

    updateTag = async (id, data, options = {}) => {
        const transaction = options.transaction || await this.startTransaction();
        const newOptions = { ...options, transaction };

        try {
            const tag = await this.model.findByPk(id);
            if (!tag) {
                throw new Error(`Tag with id ${id} not found!`);
            }

            if (data.name && data.name !== tag.name) {
                const existingTag = await this.findByName(data.name);
                if (existingTag) {
                    throw new Error(`Tag with name "${data.name}" already exists!`);
                }
            }

            await tag.update(data, newOptions);

            if (!options.transaction) {
                await transaction.commit();
            }

            return tag;
        } catch (error) {
            if (!options.transaction) {
                await transaction.rollback();
            }
            console.error("Error updating tag:", error);
            throw error;
        }
    };

    deleteTag = async (id, options = {}) => {
        const transaction = options.transaction || await this.startTransaction();
        const newOptions = { ...options, transaction };

        try {
            const tag = await this.model.findByPk(id);
            if (!tag) {
                throw new Error(`Tag with id ${id} not found!`);
            }

            const tagData = tag.toJSON();

            await tag.destroy(newOptions);

            if (!options.transaction) {
                await transaction.commit();
            }

            return {
                deletedTag: tagData,
                success: true
            };
        } catch (error) {
            if (!options.transaction) {
                await transaction.rollback();
            }
            console.error("Error deleting tag:", error);
            throw error;
        }
    };
};