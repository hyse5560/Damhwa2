module.exports = (sequelize, DataTypes) => {
  const RoomMessage = sequelize.define("RoomMessage", {
    message_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    room_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

  }, {
    tableName: "room_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });

  return RoomMessage;
};