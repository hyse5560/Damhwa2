module.exports = (sequelize, DataTypes) => {
  const PendingSchedule = sequelize.define("PendingSchedule", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: DataTypes.BIGINT,
    chat_id: DataTypes.BIGINT,
    raw_message: DataTypes.TEXT,
    parsed_title: DataTypes.STRING(255),
    parsed_datetime: DataTypes.DATE,
    confidence: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "rejected"),
      defaultValue: "pending",
    },
  }, {
    tableName: "pending_schedules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["user_id", "status"] },
    ],
  });

  return PendingSchedule;
};