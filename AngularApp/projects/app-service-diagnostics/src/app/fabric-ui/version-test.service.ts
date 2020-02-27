import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VersioningHelper } from '../shared/utilities/versioningHelper';
import { DemoSubscriptions } from '../betaSubscriptions';

const subscriptionIdStr = "subscription-id";
@Injectable()
export class VersionTestService {
  private useLegcy: boolean;
  private subId:string;
  constructor(private _activatedRoute: ActivatedRoute) {
    //retrieve from local storage first
    let subIdByStorage = localStorage.getItem(subscriptionIdStr);
    let subIdByRoute:string;
    if (this._activatedRoute.root.firstChild.firstChild) {
      subIdByRoute = this._activatedRoute.root.firstChild.firstChild.snapshot.params['subscriptionid'];
    } else {
      subIdByRoute = null;
    }
    
    let subscriptionId : string;
    if (subIdByRoute && subIdByRoute.length > 0) {
      subscriptionId = subIdByRoute;
      //subId only from route;
      this.subId = subscriptionId;
    } else {
      subscriptionId = subIdByStorage;
    }
    localStorage.setItem(subscriptionIdStr,subscriptionId);
    // this.useLegcy = VersioningHelper.isV2Subscription(subId);
    this.useLegcy = DemoSubscriptions.betaSubscriptions.findIndex(item => subscriptionId.toLowerCase() === item.toLowerCase()) === -1;
  }
  public getIsLegcy() {
    return this.useLegcy;
  }

  //update before open third blade for new UI 
  public updateSubId() {
    localStorage.setItem(subscriptionIdStr,this.subId);
  }
}
