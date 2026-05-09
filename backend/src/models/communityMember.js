module.exports = (sequelize, DataTypes) => {
  const CommunityMember = sequelize.define(
    'CommunityMember',
    {
      member_id: {
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
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      is_speaking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      left_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'community_members',
      timestamps: true,
      underscored: true,
    }
  );

  return CommunityMember;
};
