import SoundPlayer from 'react-native-sound-player';
import RNFS from 'react-native-fs';

let subscription: any = null;

let queue: { base64: string; onFinish: () => void }[] = [];
let isPlaying = false;

export const audioService = {
  playBase64: async (base64: string, onFinish: () => void) => {
    queue.push({ base64, onFinish });

    if (!isPlaying) {
      processQueue();
    }
  },

  stop: () => {
    try {
      SoundPlayer.stop();

      if (subscription) {
        subscription.remove();
        subscription = null;
      }

      // 큐 초기화
      queue = [];
      isPlaying = false;
    } catch (e) {
      console.error('중단 에러:', e);
    }
  },

  clearCache: async () => {
    try {
      const files = await RNFS.readDir(RNFS.CachesDirectoryPath);

      const ttsFiles = files.filter(
        file => file.name.startsWith('tts_') && file.name.endsWith('.mp3'),
      );

      await Promise.all(
        ttsFiles.map(file => RNFS.unlink(file.path).catch(() => {})),
      );

      console.log('TTS 캐시 삭제 완료');
    } catch (e) {
      console.log('캐시 삭제 실패:', e);
    }
  },
};

const processQueue = async () => {
  if (queue.length === 0) {
    isPlaying = false;
    return;
  }

  isPlaying = true;

  const { base64, onFinish } = queue.shift()!;

  try {
    const pureBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

    const filePath = `${RNFS.CachesDirectoryPath}/tts_${Date.now()}.mp3`;

    await RNFS.writeFile(filePath, pureBase64, 'base64');

    if (subscription) {
      subscription.remove();
      subscription = null;
    }

    subscription = SoundPlayer.addEventListener('FinishedPlaying', async () => {
      subscription?.remove();
      subscription = null;

      await RNFS.unlink(filePath).catch(() => {});

      onFinish();

      processQueue();
    });

    SoundPlayer.playUrl(`file://${filePath}`);
  } catch (error) {
    console.error('재생 에러:', error);
    onFinish();
    processQueue();
  }
};
