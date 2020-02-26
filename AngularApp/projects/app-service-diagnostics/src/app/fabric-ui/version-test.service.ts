import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VersioningHelper } from '../shared/utilities/versioningHelper';
import { DemoSubscriptions } from '../betaSubscriptions';

const subscriptionIdStr = "subscription-id";
@Injectable()
export class VersionTestService {
  private useLegcy: boolean;
  constructor(private _activatedRoute: ActivatedRoute) {
    //retrieve from local storage first
    const subId = sessionStorage.getItem(subscriptionIdStr);
    let subscriptionId : string;
    if (subId && subId.length > 0) {
      subscriptionId = subId;
    } else {
      subscriptionId = this._activatedRoute.root.firstChild.firstChild.snapshot.params['subscriptionid'];
      sessionStorage.setItem(subscriptionIdStr,subscriptionId);
    }
    // this.useLegcy = VersioningHelper.isV2Subscription(subId);
    this.useLegcy = DemoSubscriptions.betaSubscriptions.findIndex(item => subscriptionId.toLowerCase() === item.toLowerCase()) === -1;
  }
  public getIsLegcy() {
    return this.useLegcy;
  }
}
