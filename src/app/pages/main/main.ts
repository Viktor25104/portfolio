import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Header } from '../header/header';
import { About } from '../about/about';
import { Skills } from '../skills/skills';
import { Projects } from '../projects/projects';
import { Contact } from '../contact/contact';
import { Biography } from '../biography/biography';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    Navbar,
    Header,
    About,
    Skills,
    Projects,
    Contact,
    Biography,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Main {

}
