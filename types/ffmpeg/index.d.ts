declare module "@ffmpeg/ffmpeg" {
  export interface FFmpeg {
    load(): Promise<void>;
    isLoaded(): boolean;
    FS(method: string, ...args: any[]): any;
    run(...args: string[]): Promise<void>;
    setProgress?(handler: (progress: { ratio: number }) => void): void;
  }

  export function createFFmpeg(opts?: {
    log?: boolean;
    corePath?: string;
  }): FFmpeg;
}
