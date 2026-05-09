module.exports = (sequelize, DataTypes) => {
  const CommunityBlock = sequelize.define('CommunityBlock', {
    block_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    blocker_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    blocked_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    tableName: 'community_blocks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['blocker_user_id', 'blocked_user_id'],
      },
    ],
  });

  return CommunityBlock;
};
