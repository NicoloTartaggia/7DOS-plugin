export default class DataSource {
  public static copy (other: DataSource): DataSource {
    return new DataSource((other.host + ":" + other.port), other.database, other.username, other.password,
      other.type, this.name, other.grafanaDatasourceId);
  }
  private readonly host: string;
  private readonly port: string;
  private readonly database: string;
  private readonly username: string = null;
  private readonly password: string = null;
  private readonly type: string = null;
  private readonly name: string = null;
  private readonly grafanaDatasourceId: number = null;

  public constructor (url: string, database: string = "telegraf",
                      username: string = null, password: string = null,
                      type: string = null, name: string = null, grafanaDatasourceId: number = null) {
    if (url.length === 0) {
      throw new Error("invalid url parameter");
    } else if (type !== null && type.length === 0) {
      throw new Error("invalid type parameter");
    } else if (name !== null && name.length === 0) {
      throw new Error("invalid name parameter");
    }

    const urlParse: URL = new URL(url);
    this.host = urlParse.protocol + "//" + urlParse.hostname;
    this.port = urlParse.port;
    this.database = database;
    if (username === "") {
      this.username = null;
    } else {
      this.username = username;
    }
    if (password === "") {
      this.password = null;
    } else {
      this.password = password;
    }
    this.type = type;
    this.name = name;
    this.grafanaDatasourceId = grafanaDatasourceId;

  }

  public getHost (): string {
    return this.host;
  }

  public getPort (): string {
    return this.port;
  }

  public getDatabase (): string {
    return this.database;
  }

  public getUsername (): string {
    return this.username;
  }

  public getPassword (): string {
    return this.password;
  }

  public getUrl (): string {
    return this.host + ":" + this.port;
  }

  public getType (): string {
    return this.type;
  }

  public getName (): string {
    return this.name;
  }

  public getGrafanaDatasourceId (): number {
    return this.grafanaDatasourceId;
  }

  public clone (): DataSource {
    return new DataSource((this.host + ":" + this.port), this.database, this.username, this.password,
      this.type, this.name, this.grafanaDatasourceId);

  }

  public cloneWithDB (database_name: string): DataSource {
    return new DataSource((this.host + ":" + this.port), database_name, this.username, this.password,
      this.type, this.name, this.grafanaDatasourceId);
  }

}
