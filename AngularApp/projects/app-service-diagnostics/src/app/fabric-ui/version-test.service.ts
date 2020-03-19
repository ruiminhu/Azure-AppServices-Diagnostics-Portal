import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemoSubscriptions } from '../betaSubscriptions';
import { AuthService } from '../startup/services/auth.service';
import { ResourceService } from '../shared-v2/services/resource.service';
import { ResourceType, AppType } from '../shared/models/portal';
import { SiteService } from '../shared/services/site.service';
import { BehaviorSubject } from 'rxjs';
import { Site } from '../shared/models/site';

@Injectable({
    providedIn: 'root'
})
export class VersionTestService {
    public isLegacySub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    constructor(private _authService: AuthService, private _resourceService: ResourceService, private _siteService: SiteService) {
        this._authService.getStartupInfo().subscribe(startupInfo => {
            const resourceType = this._authService.resourceType;
            const resourceId = startupInfo.resourceId;
            const subId = resourceId.split('/')[2];
            const isExternalSub = DemoSubscriptions.betaSubscriptions.findIndex(item => item.toLowerCase() === subId.toLowerCase()) === -1;
            this._siteService.currentSite.subscribe(site => {
                const legacy = this.shouleUseLegacy(site, isExternalSub, resourceType);
                this.isLegacySub.next(legacy);
            });


        });
    }

    public setLegacyFlag(useLegacy) {
        this.isLegacySub.next(useLegacy);
    }

    private shouleUseLegacy(site: Site, isExternalSub: boolean, resourceType: ResourceType): boolean {
        if (resourceType !== ResourceType.Site) {
            return true;
        }
        if (!site || site.appType !== AppType.WebApp) {
            return true;
        }
        return isExternalSub;
    }
}
