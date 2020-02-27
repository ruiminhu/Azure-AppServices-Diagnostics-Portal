import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { GenieChatFlow } from '../../../supportbot/message-flow/v2-flows/genie-chat.flow';
import { Message, TextMessage } from '../../../supportbot/models/message';
import { MessageProcessor } from '../../../supportbot/message-processor.service';
import { Router, NavigationEnd } from '@angular/router';
import { WebSitesService } from '../../../resources/web-sites/services/web-sites.service';
import { PanelType } from 'office-ui-fabric-react';
import { GenieGlobals } from 'diagnostic-data';
import { AuthService } from '../../../startup/services/auth.service';

@Component({
    selector: 'genie-panel',
    templateUrl: './genie-panel.component.html',
    styleUrls: ['./genie-panel.component.scss']
})
export class GeniePanelComponent implements OnInit, OnDestroy {
    @ViewChild('scrollMe', { static: true }) myScrollContainer: any;
    @Input() resourceId: string = "";

    searchValue: string="";
    type: PanelType = PanelType.custom;
    messages: Message[] = [];
    showTypingMessage: boolean;
    chatContainerHeight: number;
    loading: boolean = true;
    navigationContent: (() => HTMLElement);
    renderFooter: (() => HTMLElement);
    isLightDismiss: boolean = true;
    welcomeMessage: string = "Welcome to App Service Diagnostics. My name is Genie and I am here to help you answer any questions you may have about diagnosing and solving your problems with your app. Please describe the issue of your app.";
    panelStyles: any;
    width: string = "1200px";
    disableChat: boolean = false;

    constructor(private _resourceService: WebSitesService, private _authService: AuthService, private _route: Router, private _genieChatFlow: GenieChatFlow, private _messageProcessor: MessageProcessor, public globals: GenieGlobals) {
        this.panelStyles = {
            root: {
                width: 585,
            },
        };
        this.chatContainerHeight = 0;
        this.messages = [];
        this.showTypingMessage = false;
        this.chatContainerHeight = 0;
    }

    ngOnInit() {
        this.globals.openGeniePanel = false;
        console.log("init genie with openGeniePanel", this.globals);

        this.getMessage();
        this.chatContainerHeight = window.innerHeight - 170;

        this.renderFooter = () => {
            // let panelTitle =  document.createElement('fab-search-box') as HTMLElement;
            let panelTitle = document.createElement('div') as HTMLElement;

            panelTitle.innerHTML = "Hi my name is Genie";
            return panelTitle;
            // (props?: P, defaultRender?: (props?: P) => JSX.Element | null): JSX.Element | null;
        };
    }

    getHistoryMessage(): void {
        this.messages = JSON.parse(JSON.stringify(this.globals.messages))
        //  this.messages = {...this.globals.messages};
    }

    ngOnDestroy() {
        console.log("Genie destroyed");
    }

    closeGeniePanel() {
        this.globals.openGeniePanel = false;
    }

    updateView(event?: any): void {
        this.scrollToBottom();
        if (event && event.hasOwnProperty('data') && event['data'] === "view-loaded" ) {
            (<HTMLInputElement>document.getElementById("genieChatBox")).disabled = false;
        }
    }

    updateStatus(event?: any): void {
        this.loading = false;
        this.getMessage(event);
        this.disableChat = false;
    }

    scrollToBottom(event?: any): void {
        try {
            this.myScrollContainer.nativeElement.childNodes[0].scrollTop = this.myScrollContainer.nativeElement.childNodes[0].scrollHeight;
        } catch (err) { 
            console.log("scrolltobottom error", err);
        }
    }

    onSearchEnter(event: any): void {
        console.log("search event", event);
        // Push messages to the current object, also wait for the complete status, and push the object to globa message component
        let inputValue = (<HTMLInputElement>document.getElementById("genieChatBox")).value;
        let analysisMessageGroupId = inputValue + (new Date()).toUTCString();
        // event.newValue
        this._genieChatFlow.createMessageFlowForAnaysis(inputValue, analysisMessageGroupId, this.resourceId).subscribe((analysisMessages: Message[]) => {
            console.log("**** analysis messsages", analysisMessages);
            analysisMessages.forEach(message => {
            });

            console.log("constructing messages onsearch", this.globals.messages, this.messages);
        });
        this._messageProcessor.setCurrentKey(analysisMessageGroupId);
        this.getMessage();
        (<HTMLInputElement>document.getElementById("genieChatBox")).value = "";
        (<HTMLInputElement>document.getElementById("genieChatBox")).disabled = true;
        this.disableChat = true;
        this.searchValue="";
    }

    getMessage(event?: any): void {
        console.log("status oncomplete: event", event);
        const self = this;
        const message = this._messageProcessor.getNextMessage(event);

        if (message) {
            if (message.messageDelayInMs >= 2000) {
                this.showTypingMessage = true;

                // To show the typing message icon, we need to scroll the page to the bottom.
                setTimeout(() => {
                    this.scrollToBottom();
                }, 200);
            }

            setTimeout(function () {
                self.showTypingMessage = false;
                self.messages.push(message);
            }, message.messageDelayInMs);
        }
    }
}
