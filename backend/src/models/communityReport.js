module.exports = (sequelize, DataTypes) => {
  const CommunityReport = sequelize.define('CommunityReport', {
    report_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    reporter_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    target_user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending',
    },
  }, {
    tableName: 'community_reports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return CommunityReport;
};
