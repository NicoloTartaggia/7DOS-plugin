import { InfluxDB } from "influx";

export class InfluxClientFactory {
    public static async createInfluxClient(host: string, port: string, defaultDB: string,
                                           credentials?: [string, string]): Promise<ConcreteInfluxClient> {
        const address: string = host + ":" + port;
        const login: string = credentials
            ? credentials[0] + ":" + credentials[1] + "@"
            : "";
        const dsn = "http://" + login + address + "/" + defaultDB;
        const influx: InfluxDB = new InfluxDB(dsn);
        await influx.getDatabaseNames()
            .then((names) => {
            if (!names.includes(defaultDB)) {
                return influx.createDatabase(defaultDB);
            }
        })
        .then(() => console.log("Database " + defaultDB + " created successfully."))
        .catch(() => console.log("Couldn't create database. Check your connection!"));
        return new ConcreteInfluxClient(address, credentials[1], defaultDB, influx);
    }
}

export interface InfluxClient {
    getAddress(): string;
    getUser(): string;
    getDefaultDB(): string;
    writeLooper({database}: {database?: string}): Promise<void>;
    writePoints({database}: {database?: string}): Promise<void>;
}

class ConcreteInfluxClient implements InfluxClient {
    /*
        Private fields
    */
    private address: string;
    private user: string;
    private defaultDB: string;
    private influx: InfluxDB;
    /*
        Constructor
    */
    constructor(address: string, user: string, defaultDB: string, influx: InfluxDB) {
        this.address = address;
        this.user = user;
        this.defaultDB = defaultDB;
        this.influx = influx;
    }
    /*
        Methods
    */
    public getAddress(): string { return this.address; }
    public getUser(): string { return this.user; }
    public getDefaultDB(): string { return this.defaultDB; }

    // Creates a client with a deafult database based on the currently loaded network
    public async writeLooper({database = this.defaultDB}: {database?: string}): Promise < void > {
        while (true) {
            this.influx.writePoints([{
                // tslint:disable-next-line: quotemark
                fields: {
                    cpu: 3,
                    mem: 1,
                },
                measurement: "perf",
                tags: {
                    host: "box1.example.com",
                },
            }], {
                database,
            });
        }
    }

    public async writePoints({database = this.defaultDB}: {database?: string}): Promise <void> {
        console.log("scrivo...");
        this.influx.writePoints([{
            fields: {
                cpu: 3,
                mem: 1,
            },
            measurement: "perf",
            tags: {
                host: "box1.example.com",
            },
        }], {
            database,
        });
    }
}
