
export default class DataSource {
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
                      type: string= null, name: string= null, grafanaDatasourceId: number= null) {
    const urlParse: URL = new URL(url);
    this.host = urlParse.protocol + "//" + urlParse.hostname;
    this.port = urlParse.port;
    this.database = database;
    this.username = username;
    this.password = password;
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
  public getUrl(): string {
    return this.host + ":" + this.port;
  }
  public getType(): string {
    return this.type;
  }
  public getName(): string {
    return this.name ;
  }
  public getGrafanaDatasourceId(): number {
    return this.grafanaDatasourceId;
  }

}
