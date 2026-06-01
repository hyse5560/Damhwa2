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

db.ChatRoom = require("./chatRoom")(sequelize, Sequelize);
db.RoomMember = require("./roomMember")(sequelize, Sequelize);
db.RoomMessage = require("./roomMessage")(sequelize, Sequelize);

// ================== 관계 설정 ==================

// User - Conversation
db.User.hasMany(db.Conversation, {foreignKey: "user_id", onDelete: "CASCADE",});
db.Conversation.belongsTo(db.User, { foreignKey: "user_id",});

// Conversation - Chat
db.Conversation.hasMany(db.Chat, { foreignKey: "conversation_id", onDelete: "CASCADE",});
db.Chat.belongsTo(db.Conversation, { foreignKey: "conversation_id",});

// User - Chat
db.User.hasMany(db.Chat, { foreignKey: "user_id", onDelete: "CASCADE",});
db.Chat.belongsTo(db.User, { foreignKey: "user_id",});

// User - Schedule
db.User.hasMany(db.Schedule, { foreignKey: "user_id", onDelete: "CASCADE",});
db.Schedule.belongsTo(db.User, { foreignKey: "user_id",});

// User - PendingSchedule
db.User.hasMany(db.PendingSchedule, { foreignKey: "user_id", onDelete: "CASCADE",});
db.PendingSchedule.belongsTo(db.User, { foreignKey: "user_id",});

// Chat - PendingSchedule
db.Chat.hasMany(db.PendingSchedule, { foreignKey: "chat_id", onDelete: "SET NULL",});
db.PendingSchedule.belongsTo(db.Chat, { foreignKey: "chat_id",});

// ChatRoom - RoomMember
db.ChatRoom.hasMany(db.RoomMember, { foreignKey: "room_id", onDelete: "CASCADE",});
db.RoomMember.belongsTo(db.ChatRoom, { foreignKey: "room_id",});

// User - RoomMember
db.User.hasMany(db.RoomMember, { foreignKey: "user_id", onDelete: "CASCADE",});
db.RoomMember.belongsTo(db.User, { foreignKey: "user_id",});

// User <-> ChatRoom (N:M)
db.User.belongsToMany(db.ChatRoom, { through: db.RoomMember, foreignKey: "user_id", otherKey: "room_id",});
db.ChatRoom.belongsToMany(db.User, {through: db.RoomMember, foreignKey: "room_id", otherKey: "user_id",});

// ChatRoom - RoomMessage
db.ChatRoom.hasMany(db.RoomMessage, {foreignKey: "room_id", onDelete: "CASCADE",});
db.RoomMessage.belongsTo(db.ChatRoom, { foreignKey: "room_id",});

// User - RoomMessage
db.User.hasMany(db.RoomMessage, {foreignKey: "user_id", onDelete: "CASCADE",});
db.RoomMessage.belongsTo(db.User, { foreignKey: "user_id",});

module.exports = db;