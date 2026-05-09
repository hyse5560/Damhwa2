module.exports = (sequelize, DataTypes) => {
  const CommunityMessage = sequelize.define(
    'CommunityMessage',
    {
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
      message_type: {
        type: DataTypes.ENUM('text', 'system'),
        allowNull: false,
        defaultValue: 'text',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'community_messages',
      timestamps: true,
      underscored: true,
    }
  );

  return CommunityMessage;
};
