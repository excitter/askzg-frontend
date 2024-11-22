import {Injectable} from '@angular/core';

class TitleData {
  path: RegExp;
  title: string;

  constructor(path: RegExp, title: string) {
    this.path = path;
    this.title = title;
  }
}

@Injectable()
export class TitleService {

  private titles: TitleData[] = [];

  constructor() {
    this.titles.push(new TitleData(/members/, 'Članovi'));
    this.titles.push(new TitleData(/payments/, 'Financije'));
    this.titles.push(new TitleData(/events/, 'Događaji'));
    this.titles.push(new TitleData(/reports/, 'Izvješće'));
    this.titles.push(new TitleData(/statistics/, 'Statistika'));
    this.titles.push(new TitleData(/users/, 'Korisnici'));
    this.titles.push(new TitleData(/settings/, 'Postavke'));
    this.titles.push(new TitleData(/products/, 'Oprema'));
  }

  getTitle(path: string): string {
    let result = '';
    for (let i = 0; i < this.titles.length; i++) {
      const data = this.titles[i];
      if (data.path.test(path)) {
        result = data.title;
      }
    }
    return result;
  }
}



