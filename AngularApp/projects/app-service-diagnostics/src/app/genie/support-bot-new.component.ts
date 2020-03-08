import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Message } from './models/message';
import { GenieMessageProcessor } from './message-processor.service';

@Component({
    selector: 'support-bot-new',
    templateUrl: 'support-bot-new.component.html',
    providers: [GenieMessageProcessor]
})
export class SupportBotNewComponent implements OnInit {
    @ViewChild('scrollMe', { static: false }) myScrollContainer: ElementRef;

messages: Message[];
    showTypingMessage: boolean;
    chatContainerHeight: number;

    @Input() startingKey: string;

    constructor(private _messageProcessor: GenieMessageProcessor) {
        this.messages = [];
        this.showTypingMessage = false;
        this.chatContainerHeight = 0;
    }

    ngOnInit(): void {
        if (this.startingKey) {
            this._messageProcessor.setCurrentKey(this.startingKey);
        }

        this.chatContainerHeight = window.innerHeight - 60;

        this.getMessage();
    }

    scrollToBottom(event?: any): void {

        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    getMessage(event?: any): void {
        const self = this;
        const message = this._messageProcessor.getNextMessage(event);

        if (message) {

            console.log("message not empty", message);
            if (message.messageDelayInMs >= 2000) {
                console.log("1st settimeout");
                this.showTypingMessage = true;

                // To show the typing message icon, we need to scroll the page to the bottom.
                setTimeout(() => {
                    this.scrollToBottom();
                }, 200);
            }

            setTimeout(function () {
                self.showTypingMessage = false;
                self.messages.push(message);
                console.log("2nd settimeout");
            }, message.messageDelayInMs);
        }
    }
}
