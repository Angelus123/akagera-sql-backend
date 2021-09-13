module.exports = (sequelize, DataTypes) => {

    const Eligibilties = sequelize.define("Eligibilties", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: true,
        },
        DiplomaOrCert: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        university: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        universityOneYear: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bachelorDegree: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        masterDegree: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        germanLangCert: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        GermLangLevel: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        foreignLang: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        interLangCert: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        didInternship: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        beenVolunteer: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        workExperience: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        workingNow: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    
    
    return Eligibilties;

}

