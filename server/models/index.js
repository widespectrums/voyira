import Address from "./address.model.js";
import User from "./user.model.js";

const models = {
    User,
    Address
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

console.log("Model associations after setup:", {
    userAssociations: models.User.associations,
    addressAssociations: models.Address.associations
});


export default models;