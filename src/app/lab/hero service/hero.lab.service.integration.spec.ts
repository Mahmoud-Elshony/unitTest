import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { HeroServiceForLab } from "./hero.lab.service";
import { provideHttpClient } from '@angular/common/http';
import { Hero } from '../../hero';

describe("3-hero service (http) integration testing:", () => {
    let httpTesting: HttpTestingController;
    let service: HeroServiceForLab;
    let heroesUrl = 'http://localhost:3000/heroes'; //URL to web api

    beforeEach(() => {
        // 1
        TestBed.configureTestingModule({
            providers: [
                // ... other test providers
                provideHttpClient(),
                provideHttpClientTesting(),
                HeroServiceForLab,
            ]
        });
        // 2
        httpTesting = TestBed.inject(HttpTestingController);
        // 3
        service = TestBed.inject(HeroServiceForLab);
    });
    it("getHeroes function: send request and receive response successfully", () => {
        const mockHeroes: Hero[] = [
            { id: 1, name: 'Hero 1', strength: 10 },
            { id: 2, name: 'Hero 2', strength: 15 }
        ];

        service.getHeroes().subscribe({
            next: (heroes) => {
                expect(heroes.length).toBe(2);
                expect(heroes).toEqual(mockHeroes);
            }
        });

        // check conection and method
        let req = httpTesting.expectOne(heroesUrl);
        expect(req.request.method).toBe('GET');

        req.flush(mockHeroes);
    });

    it("updateHero function: send request and receive response successfully", () => {
        const updatedHero: Hero = { id: 1, name: 'Updated Hero', strength: 20 };

        service.updateHero(updatedHero).subscribe({
            next: (response) => {
                expect(response).toEqual(updatedHero);
            }
        });
        // check conection and method
        let req = httpTesting.expectOne(heroesUrl);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updatedHero);
        // moke res
        req.flush(updatedHero);
    });
});
