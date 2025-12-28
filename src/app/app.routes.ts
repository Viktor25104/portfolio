import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { ProjectModalComponent } from './pages/project-detail/project-detail';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'project/:id', component: ProjectModalComponent },
  { path: '**', redirectTo: '' }
];
