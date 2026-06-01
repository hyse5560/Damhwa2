// declarations.d.ts
declare module 'react-native-live-audio-stream' {
  export interface AudioOptions {
    sampleRate?: number;
    channels?: number;
    bitsPerSample?: number;
    audioSource?: number;
    bufferSize?: number;
  }
  const LiveAudioStream: {
    init: (options: AudioOptions) => void;
    start: () => void;
    stop: () => Promise<string>;
    on: (event: 'data', callback: (data: string) => void) => void;
  };
  export default LiveAudioStream;
}
