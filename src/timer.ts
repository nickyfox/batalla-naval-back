import Timeout = NodeJS.Timeout;

class Ticker {
    iteration = 0
    maxIterations: number
    constructor(maxIterations: number) {
        this.maxIterations = maxIterations
    }

    run(task: { (): void; (arg0: number): void }) {
        if (!(this.iteration < this.maxIterations)) return this.response(false)
        task(this.iteration)
        this.iteration++
        return this.response(true)

    }

    response(executed: boolean) {
        return {
            executed,
            iteration: this.iteration,
            remaining: this.maxIterations - this.iteration,
        }
    }
}

type Tasks = {[x: string] : {intervalId: Timeout, onCancel: () => void, onTimeout: () => void}}
type StartTasksArgs =  {id: string, onTick?: (i: number) => void, onCancel?: () => void, onTimeout?: () => void, interval?: number, maxIterations?: number}
export class TaskScheduler {
    static tasks: Tasks = {}

    static async start({ onTick = () => {}, onCancel = () => {}, onTimeout = () => {}, interval = 1000, maxIterations = Number.MAX_SAFE_INTEGER, id }: StartTasksArgs) {
        const ticker = new Ticker(maxIterations);
        if (!!this.tasks[id]) {
            throw Error(`Task with id ${id} already exists`);
        }

        (async () => {
            console.log(`Task ${id} started`)
            const intervalId = setInterval(() => {
                // @ts-ignore
                const { executed } = ticker.run(onTick);
                if (!executed) this.timeout(id)
            }, interval);
            console.log(`Task ${id} intervalId: ${intervalId} Scheduled`)
            this.tasks[id] = { intervalId, onCancel, onTimeout }
        })().then(console.log);
    }

    static timeout(id: string) {
        const info = this.tasks[id];
        if (!info) return
        const { onTimeout, intervalId } = info
        delete this.tasks[id]
        clearInterval(intervalId)
        console.log(`Task ${id} timed out`)
        onTimeout()
    }

    static cancel(id: string) {
        const info = this.tasks[id];
        if (!info) return
        const { onCancel, intervalId } = info
        delete this.tasks[id]
        clearInterval(intervalId)
        console.log(`Task ${id} cancelled`)
        onCancel()
    }

    static clear() {
        Object.values(this.tasks).forEach(({ intervalId }) => clearInterval(intervalId))
    }
}