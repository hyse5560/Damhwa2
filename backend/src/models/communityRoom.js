module.exports = (sequelize, DataTypes) => {
  const CommunityRoom = sequelize.define(
    'CommunityRoom',
    {
      room_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '강좌',
      },
      thumb: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: '☕',
      },
      schedule_time: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 20,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'community_rooms',
      timestamps: true,
      underscored: true,
    }
  );

  return CommunityRoom;
};
