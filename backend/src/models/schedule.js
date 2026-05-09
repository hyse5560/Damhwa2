module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define("Schedule", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: DataTypes.BIGINT,
    title: DataTypes.STRING(100),
    schedule_time: DataTypes.DATE,
    raw_message: DataTypes.TEXT,
    notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "schedules",
    timestamps: false,
    indexes: [
      { fields: ["schedule_time", "notified"] },
      { fields: ["user_id"] },
    ],
  });

  return Schedule;
};