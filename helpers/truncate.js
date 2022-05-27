const { User, Bio, History } = require('../models');

module.exports = {
    user: () => {
        return User.destroy({ truncate: true, restartIdentity: true });
    },
    history: () => {
        return History.destroy({ truncate: true, restartIdentity: true });
    },
    bio: () => {
        return Bio.destroy({ truncate: true, restartIdentity: true });
    }
};