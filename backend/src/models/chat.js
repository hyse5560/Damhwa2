module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("Chat", {
    chat_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    conversation_id: DataTypes.BIGINT,
    user_id: DataTypes.BIGINT,
    role: {
      type: DataTypes.ENUM("elder", "ai"),
    },
    content: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "chats",
    timestamps: false,
    indexes: [
      { fields: ["conversation_id", "created_at"] },
      { fields: ["user_id", "created_at"] },
    ],
  });

  return Chat;
};