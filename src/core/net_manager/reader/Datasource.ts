export default class DataSource {
  private readonly host: string;
  private readonly port: string;
  private readonly database: string;
  private readonly username: string = null;
  private readonly password: string = null;

  public constructor (host: string, port: string = "8086", database: string = "telegraf",
                      username: string = null, password: string = null) {
    this.host = host;
    this.port = port;
    this.database = database;
    this.username = username;
    this.password = password;
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
}
