import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private useLegcy: boolean;
  private subId:string;
  constructor() {}
  
  public getIsLegcy():boolean {
    return null;
  }

  public updateSubId(){  }
}
