module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define("ChatRoom", {
    room_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    room_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

  }, {
    tableName: "chat_rooms",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });

  return ChatRoom;
};