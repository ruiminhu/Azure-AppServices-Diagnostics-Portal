import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemoSubscriptions } from '../betaSubscriptions';
import { AuthService } from '../startup/services/auth.service';
import { ResourceService } from '../shared-v2/services/resource.service';
import { ResourceType, AppType } from '../shared/models/portal';
import { SiteService } from '../shared/services/site.service';

const subscriptionIdStr = "subscription-id";
@Injectable({
    providedIn: 'root'
})
export class VersionTestService {
    private useLegcy: boolean;
    private subId: string;
    constructor(private _authService: AuthService, private _resourceService: ResourceService, private _siteService: SiteService) {
        let resourceType = this._authService.resourceType;
        this._authService.getStartupInfo().subscribe(startupInfo => {
            const resourceId = startupInfo.resourceId;
            this.subId = resourceId.split("/")[2];
            this.useLegcy = this.getIsLegcyByResourceId(resourceId, resourceType);
            console.log("versionTest Service", this.subId, this.useLegcy);
        });
    }
    public getIsLegcy() {
        return this.useLegcy;
    }

    public getIsLegcyByResourceId(resourceId: string, resourceType: ResourceType): boolean {
        const subId = resourceId.split("/")[2];
        let isExternalsub = DemoSubscriptions.betaSubscriptions.findIndex(item => subId.toLowerCase() === item.toLowerCase()) === -1;

        if (resourceType === ResourceType.Site) {
            this._siteService.currentSite.subscribe(site => {
                if (site && site.appType == AppType.WebApp) {
                    return isExternalsub;
                }
            });
        };
        return true;
    }
    //update before open third blade for new UI
    // public updateSubId() {
    //   localStorage.setItem(subscriptionIdStr,this.subId);
    // }
}
