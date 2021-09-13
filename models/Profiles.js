module.exports = (sequelize, DataTypes) => {

    const Profiles = sequelize.define("Profiles", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city_province: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        family_status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        other_Po_Box: {
            type: DataTypes.STRING,
            allowNull: true,
        }
        
    });
    
    return Profiles;

}