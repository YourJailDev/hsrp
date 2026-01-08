import EventEmitter from './event-emitter';
type TimerEvents = {
    tick: [];
};
declare class Timer extends EventEmitter<TimerEvents> {
    private unsubscribe;
    start(): void;
    stop(): void;
    destroy(): void;
}
export default Timer;
