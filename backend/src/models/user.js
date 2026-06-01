module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING(50),
    phone: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    push_token: DataTypes.TEXT,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return User;
};