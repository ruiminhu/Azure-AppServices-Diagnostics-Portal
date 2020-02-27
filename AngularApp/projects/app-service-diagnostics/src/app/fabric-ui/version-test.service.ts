import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemoSubscriptions } from '../betaSubscriptions';

const subscriptionIdStr = "subscription-id";
@Injectable({
  providedIn: 'root'
})
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
    
    // let subscriptionId : string;
    if (subIdByRoute && subIdByRoute.length > 0) {
      // subscriptionId = subIdByRoute;
      //subId only from route;
      this.subId = subIdByRoute;
    } else {
      this.subId = subIdByStorage;
    }
    localStorage.setItem(subscriptionIdStr,this.subId);
    // this.useLegcy = VersioningHelper.isV2Subscription(subId);
    this.useLegcy = DemoSubscriptions.betaSubscriptions.findIndex(item => this.subId.toLowerCase() === item.toLowerCase()) === -1;
    console.log("versionTest Service",this.subId,this.useLegcy);
  }
  public getIsLegcy() {
    return this.useLegcy;
  }

  //update before open third blade for new UI 
  public updateSubId() {
    localStorage.setItem(subscriptionIdStr,this.subId);
  }
}
