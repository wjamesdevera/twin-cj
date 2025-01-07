import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../config/db";

class PersonalDetail extends Model<
  InferAttributes<PersonalDetail>,
  InferCreationAttributes<PersonalDetail>
> {
  declare personalDetailId: CreationOptional<string>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phoneNumber: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PersonalDetail.init(
  {
    personalDetailId: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        min: 5,
        max: 150,
      },
    },
    lastName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        min: 5,
        max: 150,
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(15),
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "personal_details",
    timestamps: true,
    underscored: true,
    sequelize,
  }
);

export default PersonalDetail;
