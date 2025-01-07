import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../config/db";
import { hashPassword } from "../utils/password";

class UserAccount extends Model<
  InferAttributes<UserAccount>,
  InferCreationAttributes<UserAccount>
> {
  declare userAccountId: CreationOptional<string>;
  declare passwordHash: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

UserAccount.init(
  {
    userAccountId: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "user_accounts",
    timestamps: true,
    underscored: true,
    sequelize,
  }
);

UserAccount.beforeCreate(async (userAccount, options) => {
  userAccount.passwordHash = await hashPassword(userAccount.passwordHash);
});

UserAccount.beforeUpdate(async (userAccount, options) => {
  userAccount.passwordHash = await hashPassword(userAccount.passwordHash);
});

export default UserAccount;
