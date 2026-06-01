module.exports = (sequelize, DataTypes) => {
  const RoomMember = sequelize.define("RoomMember", {
    room_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },

  }, {
    tableName: "room_members",
    timestamps: false,
  });

  return RoomMember;
};