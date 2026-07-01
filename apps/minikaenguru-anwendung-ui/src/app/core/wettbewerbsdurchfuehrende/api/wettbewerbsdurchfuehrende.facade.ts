import { Injectable } from '@angular/core';

@Injectable()
export class WettbewerbsdurchfuehrendeFacade {
    public privatpersonAnlegen(): void {
        console.log('jetzt die action wettbewerbsdurchfuehrendenAnlegen mit Durchführungsart privat dispatchen');
    }

    public lehrpersonAnlegen(schule: string): void {
        console.log(
            'jetzt die action wettbewerbsdurchfuehrendenAnlegen mit Durchführungsart schule und der schule=' +
                schule +
                ' dispatchen'
        );
    }
}
