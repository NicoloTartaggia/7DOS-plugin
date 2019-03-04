import { PanelCtrl } from 'grafana/app/plugins/sdk';

class Ctrl extends PanelCtrl {
    
  static templateUrl: string = 'html/module.html';
  static scrollable: boolean = true;
  
  constructor($scope, $injector) {
    super($scope, $injector);
  }

  link(scope, element) {
  }

  
}

export { Ctrl as PanelCtrl }
