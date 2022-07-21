"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Ticker {
    constructor(maxIterations) {
        this.iteration = 0;
        this.maxIterations = maxIterations;
    }
    run(task) {
        if (!(this.iteration < this.maxIterations))
            return this.response(false);
        task(this.iteration);
        this.iteration++;
        return this.response(true);
    }
    response(executed) {
        return {
            executed,
            iteration: this.iteration,
            remaining: this.maxIterations - this.iteration,
        };
    }
}
class TaskScheduler {
    static start({ onTick = () => { }, onCancel = () => { }, onTimeout = () => { }, interval = 1000, maxIterations = Number.MAX_SAFE_INTEGER, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticker = new Ticker(maxIterations);
            if (!!this.tasks[id]) {
                throw Error(`Task with id ${id} already exists`);
            }
            (() => __awaiter(this, void 0, void 0, function* () {
                console.log(`Task ${id} started`);
                const intervalId = setInterval(() => {
                    // @ts-ignore
                    const { executed } = ticker.run(onTick);
                    if (!executed)
                        this.timeout(id);
                }, interval);
                console.log(`Task ${id} intervalId: ${intervalId} Scheduled`);
                this.tasks[id] = { intervalId, onCancel, onTimeout };
            }))().then(console.log);
        });
    }
    static timeout(id) {
        const info = this.tasks[id];
        if (!info)
            return;
        const { onTimeout, intervalId } = info;
        delete this.tasks[id];
        clearInterval(intervalId);
        console.log(`Task ${id} timed out`);
        onTimeout();
    }
    static cancel(id) {
        const info = this.tasks[id];
        if (!info)
            return;
        const { onCancel, intervalId } = info;
        delete this.tasks[id];
        clearInterval(intervalId);
        console.log(`Task ${id} cancelled`);
        onCancel();
    }
    static clear() {
        Object.values(this.tasks).forEach(({ intervalId }) => clearInterval(intervalId));
    }
}
exports.TaskScheduler = TaskScheduler;
TaskScheduler.tasks = {};
