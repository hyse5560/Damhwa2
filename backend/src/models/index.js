const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: "+09:00",
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// models
db.User = require("./user")(sequelize, Sequelize);
db.Conversation = require("./conversation")(sequelize, Sequelize);
db.Chat = require("./chat")(sequelize, Sequelize);
db.Schedule = require("./schedule")(sequelize, Sequelize);
db.PendingSchedule = require("./pendingSchedule")(sequelize, Sequelize);
db.CommunityRoom = require("./communityRoom")(sequelize, Sequelize);
db.CommunityMember = require("./communityMember")(sequelize, Sequelize);
db.CommunityMessage = require("./communityMessage")(sequelize, Sequelize);
db.CommunityReport = require("./communityReport")(sequelize, Sequelize);
db.CommunityBlock = require("./communityBlock")(sequelize, Sequelize);

// ================== 관계 설정 ==================

// User - Conversation
db.User.hasMany(db.Conversation, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Conversation.belongsTo(db.User, { foreignKey: "user_id" });

// Conversation - Chat
db.Conversation.hasMany(db.Chat, { foreignKey: "conversation_id", onDelete: "CASCADE" });
db.Chat.belongsTo(db.Conversation, { foreignKey: "conversation_id" });

// User - Chat
db.User.hasMany(db.Chat, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Chat.belongsTo(db.User, { foreignKey: "user_id" });

// User - Schedule
db.User.hasMany(db.Schedule, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Schedule.belongsTo(db.User, { foreignKey: "user_id" });

// User - PendingSchedule
db.User.hasMany(db.PendingSchedule, { foreignKey: "user_id", onDelete: "CASCADE" });
db.PendingSchedule.belongsTo(db.User, { foreignKey: "user_id" });

// Chat - PendingSchedule
db.Chat.hasMany(db.PendingSchedule, { foreignKey: "chat_id", onDelete: "SET NULL" });
db.PendingSchedule.belongsTo(db.Chat, { foreignKey: "chat_id" });

// User - CommunityMember
db.User.hasMany(db.CommunityMember, { foreignKey: "user_id", onDelete: "CASCADE" });
db.CommunityMember.belongsTo(db.User, { foreignKey: "user_id" });

// CommunityRoom - CommunityMember
db.CommunityRoom.hasMany(db.CommunityMember, { foreignKey: "room_id", onDelete: "CASCADE" });
db.CommunityMember.belongsTo(db.CommunityRoom, { foreignKey: "room_id" });

// CommunityRoom - CommunityMessage
db.CommunityRoom.hasMany(db.CommunityMessage, { foreignKey: "room_id", onDelete: "CASCADE" });
db.CommunityMessage.belongsTo(db.CommunityRoom, { foreignKey: "room_id" });

// User - CommunityMessage
db.User.hasMany(db.CommunityMessage, { foreignKey: "user_id", onDelete: "CASCADE" });
db.CommunityMessage.belongsTo(db.User, { foreignKey: "user_id" });

// CommunityRoom - CommunityReport
db.CommunityRoom.hasMany(db.CommunityReport, { foreignKey: "room_id", onDelete: "CASCADE" });
db.CommunityReport.belongsTo(db.CommunityRoom, { foreignKey: "room_id" });

// User - CommunityReport
db.User.hasMany(db.CommunityReport, { foreignKey: "reporter_user_id", as: "reportsMade", onDelete: "CASCADE" });
db.CommunityReport.belongsTo(db.User, { foreignKey: "reporter_user_id", as: "reporter" });
db.User.hasMany(db.CommunityReport, { foreignKey: "target_user_id", as: "reportsReceived", onDelete: "SET NULL" });
db.CommunityReport.belongsTo(db.User, { foreignKey: "target_user_id", as: "target" });

// User - CommunityBlock
db.User.hasMany(db.CommunityBlock, { foreignKey: "blocker_user_id", as: "blocksMade", onDelete: "CASCADE" });
db.CommunityBlock.belongsTo(db.User, { foreignKey: "blocker_user_id", as: "blocker" });
db.User.hasMany(db.CommunityBlock, { foreignKey: "blocked_user_id", as: "blocksReceived", onDelete: "CASCADE" });
db.CommunityBlock.belongsTo(db.User, { foreignKey: "blocked_user_id", as: "blocked" });

module.exports = db;
