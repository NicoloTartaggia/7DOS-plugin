export class JsBayesAppConfigCtrl {
  public enabled: boolean;
  public appEditCtrl: any;
  public appModel: any;
  static templateUrl: string;
  public $location: any;

  constructor($location) {
    this.$location = $location;
  }

  redirect() {
    console.info("ciao");
    //this.$location.url("");  //da fare? se si, come?
  }
}

JsBayesAppConfigCtrl.templateUrl = "components/config.html";
