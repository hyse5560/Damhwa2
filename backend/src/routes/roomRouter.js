const express = require('express');
const router = express.Router();
const { ChatRoom } = require('../models'); 

router.get('/', async (req, res) => {
  try {
    const rooms = await ChatRoom.findAll({
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json(rooms);
  } catch (error) {
    console.error('방 목록 조회 오류:', error);
    return res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { room_name, description } = req.body;

    if (!room_name) {
      return res.status(400).json({ message: '방 제목은 필수입니다.' });
    }

    const newRoom = await ChatRoom.create({
      room_name,
      description
    });

    return res.status(201).json(newRoom);
  } catch (error) {
    console.error('방 생성 오류:', error);
    return res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

router.delete('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    const deletedCount = await ChatRoom.destroy({
      where: { room_id: roomId }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: '삭제할 방이 존재하지 않습니다.' });
    }

    return res.status(200).json({ success: true, message: '방이 삭제되었습니다.' });
  } catch (error) {
    console.error('방 삭제 오류:', error);
    return res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router;