module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define("Conversation", {
    conversation_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: DataTypes.BIGINT,
    title: DataTypes.STRING(100),
    started_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ended_at: DataTypes.DATE,
  }, {
    tableName: "conversations",
    timestamps: false,
    indexes: [
      {
        fields: ["user_id", "started_at"],
      },
    ],
  });

  return Conversation;
};