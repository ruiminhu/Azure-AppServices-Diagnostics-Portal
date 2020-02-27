import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemoSubscriptions } from '../betaSubscriptions';
import { AuthService } from '../startup/services/auth.service';

const subscriptionIdStr = "subscription-id";
@Injectable({
  providedIn:'root'
})
export class VersionTestService {
  private useLegcy: boolean;
  private subId:string;
  constructor(private _authService: AuthService) {
    this._authService.getStartupInfo().subscribe(startupInfo => {
      const resourceId = startupInfo.resourceId;
      this.subId = resourceId.split("/")[2];
      this.useLegcy = this.getIsLegcyByResourceId(resourceId);
      console.log("versionTest Service",this.subId,this.useLegcy);
    });
  }
  public getIsLegcy() {
    return this.useLegcy;
  }

  public getIsLegcyByResourceId(resourceId:string):boolean {
    const subId = resourceId.split("/")[2];
    return DemoSubscriptions.betaSubscriptions.findIndex(item => subId.toLowerCase() === item.toLowerCase()) === -1;
  }
  //update before open third blade for new UI 
  // public updateSubId() {
  //   localStorage.setItem(subscriptionIdStr,this.subId);
  // }
}
