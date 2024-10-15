import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesComponentForLab } from './messages.lab.component';
import { By } from '@angular/platform-browser';


describe("2-message component integration testing:", () => {
    let fixture: ComponentFixture<MessagesComponentForLab>, component: MessagesComponentForLab;
    beforeEach(() => {
        // 1
        TestBed.configureTestingModule({ imports: [MessagesComponentForLab] })
        // 2
        fixture = TestBed.createComponent(MessagesComponentForLab);
        component = fixture.componentInstance;
    });

    it("expect component template to be empty", () => {
        //Note: there is @if"messageService.messages.length" in line 1 in template
        expect(component).toBeTruthy();
        const containerElement = fixture.debugElement.query(By.css('#container'));
        expect(containerElement).toBeNull();
    })
    it("then expect div.msg to have the messages after setting it", () => {
        component.messageService.messages = [
            { id: 1, message: "ITI .net" },
            { id: 2, message: "ITI Mearn" }
        ];

        // update template
        fixture.detectChanges();

        // access msg duv
        const messageDivs = fixture.debugElement.queryAll(By.css('div.msg'));
        //check the divs linght tobe 2
        expect(messageDivs.length).toBe(2);

        expect(messageDivs[0].nativeElement.textContent).toContain("ITI .net");
        expect(messageDivs[1].nativeElement.textContent).toContain("ITI Mearn");
    })
})