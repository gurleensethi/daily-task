export namespace models {
	
	export class CreateTask {
	    title: string;
	    taskType: string;
	    taskTime: number;
	
	    static createFrom(source: any = {}) {
	        return new CreateTask(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.title = source["title"];
	        this.taskType = source["taskType"];
	        this.taskTime = source["taskTime"];
	    }
	}
	export class TimerTask {
	    taskTime: number;
	    isRunning: boolean;
	
	    static createFrom(source: any = {}) {
	        return new TimerTask(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.taskTime = source["taskTime"];
	        this.isRunning = source["isRunning"];
	    }
	}
	export class Task {
	    id: string;
	    title: string;
	    taskType: string;
	    // Go type: TimerTask
	    timerTask?: any;
	    // Go type: time.Time
	    time: any;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.taskType = source["taskType"];
	        this.timerTask = this.convertValues(source["timerTask"], null);
	        this.time = this.convertValues(source["time"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

