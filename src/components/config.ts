export class JsBayesAppConfigCtrl {
  public static templateUrl: string;
  public enabled: boolean;
  public appEditCtrl: any;
  public appModel: any;
  public $location: any;

  constructor($location) {
    this.$location = $location;
  }

  public redirect() {
    console.info("redirect() not done");
    // this.$location.url("");  //da fare? se si, come?
  }
}

JsBayesAppConfigCtrl.templateUrl = "components/config.html";
